import whois
import json
import re
from datetime import datetime

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
    try:
        with open(f'./reports/whois_{run.input_value}_{run.run_id}.json', 'r') as report:
            whois_search = json.load(report)
        run.status = 'completed'
        run.save()
    except FileNotFoundError as e:
        message = f'FileNotFoundError: {e}.'
        return message

    whois_response = {
        "run_id": run.run_id,
        "state": "completed",
        "result": [
            {
                "domain": {
                    "domain": whois_search.get("domain_name"),
                    "regdate": whois_search.get("creation_date"),
                    "email": whois_search.get("admin_email")
                }
            }
        ]
    }

    # 2. Save to DB
    regdate = whois_response['result'][0]['domain']['regdate']
    if regdate:
        regdate = regdate.strftime('%Y-%m-%d')
        #  AttributeError: 'str' object has no attribute 'strftime'

    # 1차 email to username
    regex = r'^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}$'
    pattern = re.compile(regex)
    email = whois_response['result'][0]['domain']['email']
    # Node
    match = re.match(pattern, email)
    if match:
        username = match.group(1)
        user = SurfaceUser.nodes.first_or_none(username=username)
        if not user:
            user = SurfaceUser(username=username, case_id=case_id).save()

        domain_obj = Domain.nodes.first_or_none(domain=run.input_value)
        if not domain_obj:
            domain_obj = Domain(domain=run.input_value, regdate=regdate, status=False, case_id=case_id).save()
        else:
            inp_data = {'regdate': regdate}
            domain_obj = Domain.update_node_properties(node_id=domain_obj.uid, **inp_data)

        # Establishing the relationship
        if not user.register.is_connected(domain_obj):
            user.register.connect(domain_obj)

        run.status = 'completed'
        run.save()

        return run.run_id
