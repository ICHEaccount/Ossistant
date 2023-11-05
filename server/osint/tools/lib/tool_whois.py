import whois
import json
import re
from datetime import datetime

from db_conn.mongo.models import RunModel
from db_conn.neo4j.models import *


def run_whois(run):
    # 1. Execute
    try:
        whois_search = whois.whois(run.input_value)
        run.status = 'running'
        whois_str = json.dumps(whois_search, default=str, ensure_ascii=False)

        report = open(f'./reports/whois_{run.input_value}_{run.run_id}.json', 'w')
        report.write(whois_str)
        report.close()

        run.save()
        return run.run_id

    except Exception as e:
        run.status = 'error'
        message = f'Run whois failed. Domain is {run.input_value}. Return code: {e}'
        run.save()
        return message


def check_whois(case_id, run):
    if not run.status == 'completed':
        try:
            with open(f'./reports/whois_{run.input_value}_{run.run_id}.json', 'r') as report:
                whois_search = json.load(report)
            run.status = 'completed'
            run.save()
        except FileNotFoundError as e:
            message = f'FileNotFoundError: {e}.'
            return message

        if isinstance(whois_search.get("domain_name"), list):
            is_upper = any(char.isupper() for char in whois_search.get("domain_name")[0])
            if is_upper:
                domain_response = whois_search.get("domain_name")[1]
            else:
                domain_response = whois_search.get("domain_name")[0]
        else:
            domain_response = whois_search.get("domain_name")

        if isinstance(whois_search.get("creation_date"), list):
            one = whois_search.get("creation_date")[0]
            two = whois_search.get("creation_date")[1]
            if one < two:
                regdate_response = two
            else:  # one > two
                regdate_response = one
        else:
            regdate_response = whois_search.get("creation_date")

        created = False

        results_data = [
            {
                "result_id": "01",
                "result": {
                    "domain": domain_response,
                    "regdate": regdate_response,
                    "email": whois_search.get("admin_email")
                },
                "created": created
            }
        ]
        RunModel.create_result(data=results_data, run_id=run.run_id)
        run.save()

    final = RunModel.get_all_results(run_id=run.run_id)[1]
    whois_response = {
        "run_id": run.run_id,
        "state": run.status,
        "results": final
    }

    # [
    #     {
    #         "created": false,
    #         "result": {
    #             "domain": "proton.me",
    #             "email": null,
    #             "regdate": "2010-10-10 21:20:51"
    #         },
    #         "result_id": 11
    #     }
    # ]

    # # 2. Save to DB
    # regdate = regdate_response
    # # regdate = whois_response['result'][0]['domain']['regdate']
    # if regdate:
    #     regdate = datetime.strptime(regdate, '%Y-%m-%d %H:%M:%S')
    #
    # if whois_search.get("admin_email"):
    #     # 1차 email to username
    #     regex = r'^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}$'
    #     pattern = re.compile(regex)
    #     # Node
    #     email = whois_search.get("admin_email")
    #     match = re.match(pattern, email)
    # else:
    #     match = None
    #
    # if match:
    #     username = match.group(1)
    #     user = SurfaceUser.get_node({'username': username})
    #     # user = SurfaceUser.get_node.first_or_none({'username': username})
    #     if not user:
    #         user = SurfaceUser(username=username, case_id=case_id).save()
    #
    #     domain_obj = Domain.get_node({'domain': run.input_value})
    #     # domain_obj = Domain.get_node.first_or_none({'domain': run.input_value})
    #     if not domain_obj:
    #         domain_obj = Domain(domain=run.input_value, regdate=regdate, status=False, case_id=case_id).save()
    #     else:
    #         inp_data = {'regdate': regdate}
    #         domain_obj = Domain.update_node_properties(node_id=domain_obj.uid, **inp_data)
    #
    #     # user -(REGISTER)-> domain
    #     user.rel_to.connect(domain_obj,{'label':'REGISTER'})

    run.save()

    return whois_response
    # return final
