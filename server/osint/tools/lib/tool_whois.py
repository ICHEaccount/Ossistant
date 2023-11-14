import whois
import json
from datetime import datetime
import re

from db_conn.mongo.models import RunModel
from db_conn.neo4j.models import *


def run_whois(case_id, run):
    # 1. Execute
    try:
        whois_search = whois.whois(run.input_value)
        run.status = 'running'
        whois_str = json.dumps(whois_search, default=str, ensure_ascii=False)

        report = open(f'./reports/whois_{run.input_value}_{run.run_id}.json', 'w')
        report.write(whois_str)
        report.close()
        
        # Data processing 
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
        regdate = None
        if regdate_response:
            if isinstance(regdate_response, datetime):
                regdate = regdate_response.strftime('%Y-%m-%d %H:%M')
            elif isinstance(regdate_response, str):
                regdate = regdate_response

        if whois_search.get("admin_email"):
            # 1차 email to username
            regex = r'^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}$'
            pattern = re.compile(regex)
            # Node
            email = whois_search.get("admin_email")
            match = re.match(pattern, email)
        else:
            match = None

        # Save to DB
        if match:
            username = match.group(1)
            user = SurfaceUser.get_node({'username': username,'case_id':case_id})
            # user = SurfaceUser.get_node.first_or_none({'username': username})
            if not user:
                # user = SurfaceUser(username=username, case_id=case_id).save()
                user = SurfaceUser.create_node({'username': username,'case_id':case_id})

            domain_obj = Domain.get_node({'domain': domain_response, 'case_id':case_id})
            # domain_obj = Domain.get_node.first_or_none({'domain': run.input_value})
            if not domain_obj:
                domain_obj = Domain(domain=run.input_value, regdate=regdate, status=False, case_id=case_id).save()
            else:
                inp_data = {'regdate': regdate}
                status, domain_obj = Domain.update_node_properties(node_id=domain_obj.uid, return_node=True, **inp_data)
                if status is False:
                    return "Domain update error"

            email_obj = Email.get_node({'email': whois_search.get("admin_email"), 'case_id': case_id})
            if not email_obj:
                email_obj = Email.create_node({'email': whois_search.get("admin_email"), 'case_id': case_id})

            _,register_status= Relationship.check_relationship(from_uid=user.uid, to_uid=domain_obj.uid)
            _,has_status = Relationship.check_relationship(from_uid=user.uid, to_uid=email_obj.uid)
            if register_status is False:
                user.rel_to.connect(domain_obj,{'label':'REGISTER'})
            if has_status is False:
                user.rel_to.connect(email_obj, {'label':'HAS'})
            
            inside = {
                "domain": domain_response,
                "regdate": regdate,
                "email": whois_search.get("admin_email"),
                "admin": whois_search.get("admin_name"),
                "registrant": whois_search.get("registrant_name")
            }
            RunModel.create_result(data=inside, run_id=run.run_id)

            # Change to status -> Completed
            run.status = 'completed'
        else: 
            run.status = 'error'
            run.save()
        run.save()
        return run.run_id

    except Exception as e:
        run.status = 'error'
        message = f'Run whois failed. Domain is {run.input_value}. Return code: {e}'
        run.save()


def check_whois(run_id):
    regdate_response = None
    run = RunModel.objects.get(_id=run_id)
    if not run.status == 'completed':
        try:
            with open(f'./reports/whois_{run.input_value}_{run.run_id}.json', 'r') as report:
                whois_search = json.load(report)
            run.status = 'completed'
            run.save()
        except FileNotFoundError as e:
            message = f'FileNotFoundError: {e}.'
            return message
    elif run.status == 'completed':
        with open(f'./reports/whois_{run.input_value}_{run.run_id}.json', 'r') as report:
            whois_search = json.load(report)

    final = RunModel.get_all_results(run_id=run.run_id)[1]
    whois_response = {
        "run_id": run.run_id,
        "state": run.status,
        "results": final
    }

    run.save()
    return whois_response




# def run_whois(run):
#     # 1. Execute
#     try:
#         whois_search = whois.whois(run.input_value)
#         run.status = 'running'
#         whois_str = json.dumps(whois_search, default=str, ensure_ascii=False)

#         report = open(f'./reports/whois_{run.input_value}_{run.run_id}.json', 'w')
#         report.write(whois_str)
#         report.close()

#         run.save()
#         return run.run_id

#     except Exception as e:
#         run.status = 'error'
#         message = f'Run whois failed. Domain is {run.input_value}. Return code: {e}'
#         run.save()
#         return message


# def check_whois(case_id, run_id):
#     regdate_response = None
#     run = RunModel.objects.get(_id=run_id)
#     if not run.status == 'completed':
#         try:
#             with open(f'./reports/whois_{run.input_value}_{run.run_id}.json', 'r') as report:
#                 whois_search = json.load(report)
#             run.status = 'completed'
#             run.save()
#         except FileNotFoundError as e:
#             message = f'FileNotFoundError: {e}.'
#             return message

#         if isinstance(whois_search.get("domain_name"), list):
#             is_upper = any(char.isupper() for char in whois_search.get("domain_name")[0])
#             if is_upper:
#                 domain_response = whois_search.get("domain_name")[1]
#             else:
#                 domain_response = whois_search.get("domain_name")[0]
#         else:
#             domain_response = whois_search.get("domain_name")

#         if isinstance(whois_search.get("creation_date"), list):
#             one = whois_search.get("creation_date")[0]
#             two = whois_search.get("creation_date")[1]
#             if one < two:
#                 regdate_response = two
#             else:  # one > two
#                 regdate_response = one
#         else:
#             regdate_response = whois_search.get("creation_date")

#         inside = {
#             "domain": domain_response,
#             "regdate": regdate_response,
#             "email": whois_search.get("admin_email"),
#             "admin": whois_search.get("admin_name"),
#             "registrant": whois_search.get("registrant_name")
#         }
#         RunModel.create_result(data=inside, run_id=run.run_id)
#         run.save()
#     elif run.status == 'completed':
#         with open(f'./reports/whois_{run.input_value}_{run.run_id}.json', 'r') as report:
#             whois_search = json.load(report)

#     final = RunModel.get_all_results(run_id=run.run_id)[1]
#     whois_response = {
#         "run_id": run.run_id,
#         "state": run.status,
#         "results": final
#     }

#     # 2. Save to DB
#     regdate = regdate_response
#     if regdate:
#         regdate = datetime.strptime(regdate, '%Y-%m-%d %H:%M:%S')
    
#     if whois_search.get("admin_email"):
#         # 1차 email to username
#         regex = r'^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}$'
#         pattern = re.compile(regex)
#         # Node
#         email = whois_search.get("admin_email")
#         match = re.match(pattern, email)
#     else:
#         match = None
    
#     if match:
#         username = match.group(1)
#         user = SurfaceUser.get_node({'username': username,'case_id':case_id})
#         # user = SurfaceUser.get_node.first_or_none({'username': username})
#         if not user:
#             # user = SurfaceUser(username=username, case_id=case_id).save()
#             user = SurfaceUser.create_node({'username': username,'case_id':case_id})
    
#         domain_obj = Domain.get_node({'domain': run.input_value, 'case_id':case_id})
#         # domain_obj = Domain.get_node.first_or_none({'domain': run.input_value})
#         if not domain_obj:
#             domain_obj = Domain(domain=run.input_value, regdate=regdate, status=False, case_id=case_id).save()
#         else:
#             inp_data = {'regdate': regdate}
#             status, domain_obj = Domain.update_node_properties(node_id=domain_obj.uid, return_node=True, **inp_data)
#             if status is False:
#                 return "Domain update error"

#         email_obj = Email.get_node({'email': whois_search.get("admin_email"), 'case_id': case_id})
#         if not email_obj:
#             email_obj = Email.create_node({'email': whois_search.get("admin_email"), 'case_id': case_id})
                    
#         # user -(REGISTER)-> domain
#         user.rel_to.connect(domain_obj,{'label':'REGISTER'})
#         user.rel_to.connect(email_obj, {'label':'HAS'})

#     run.save()
#     return whois_response
