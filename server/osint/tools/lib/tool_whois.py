import json
import os
import re
import whois

from datetime import datetime

from db_conn.mongo.models import RunModel, ResultModel
from db_conn.neo4j.models import *


def run_whois(run):
    # status is 'ready'
    try:
        whois_search = whois.whois(run.input_value)
        run.status = 'running'
    except whois.parser.PywhoisError as e:
        # message = f'Run whois error-1. {e}'
        result = {
            "message": e
        }
        run.status = 'error'
        RunModel.create_result(data=result, run_id=run.run_id)
        run.save()
        return run.run_id

    try:
        whois_str = json.dumps(whois_search, default=str, ensure_ascii=False)
        report = open(f'./reports/whois_{run.run_id}.json', 'w')
        report.write(whois_str)
        report.close()
    except Exception as e:
        message = f'Run whois error-2. {e}'
        run.status = 'error'
        run.save()
        return message

    run.save()
    return run.run_id


def report_whois(case_id, run):
    try:
        with open(f'./reports/whois_{run.run_id}.json') as f:
            report = json.load(f)
    except FileNotFoundError as e:
        message = f'Report whois error-1. {e}'
        return message

    # Choosing lower case of domain_name
    if isinstance(report.get("domain_name"), list):
        is_upper = any(char.isupper() for char in report.get("domain_name")[0])
        if is_upper:
            domain_response = report.get("domain_name")[1]
        else:
            domain_response = report.get("domain_name")[0]
    else:
        domain_response = report.get("domain_name")

    # Choosing one date if many
    if isinstance(report.get("creation_date"), list):
        one = report.get("creation_date")[0]
        two = report.get("creation_date")[1]
        if one < two:
            regdate_response = two
        else:  # one > two
            regdate_response = one
    else:
        regdate_response = report.get("creation_date")

    if isinstance(regdate_response, datetime):
        regdate = regdate_response.strftime('%Y-%m-%d %H:%M')
    elif isinstance(regdate_response, str):
        datetime_regdate_response = datetime.strptime(regdate_response, "%Y-%m-%d %H:%M:%S")
        regdate = datetime_regdate_response.strftime("%Y-%m-%d %H:%M")
    else:
        regdate = regdate_response

    # List of emails
    email_key = ['admin_email', 'registrant_email', 'tech_email', 'emails']
    email_list = []
    for key in email_key:
        if key in report:
            emails_value = report[key]
            if isinstance(emails_value, list):
                email_list.extend(emails_value)
            else:
                email_list.append(emails_value)

    # Need to remove abuse, whois email
    # filtered_email_list = [email for email in email_list if 'abuse' not in email and 'whois' not in email]

    # email to username
    regex = r'^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}$'
    pattern = re.compile(regex)

    # Node works - domain
    domain_obj = Domain.get_node({'domain': run.input_value, 'case_id': case_id})
    if not domain_obj:
        try:
            domain_obj = Domain(domain=run.input_value, regdate=regdate, status=False, case_id=case_id).save()
        except TypeError as e:
            message = f'{e}. domain_response is {domain_response}.'
            return message
    else:
        inp_data = {'regdate': regdate}
        status, domain_obj = Domain.update_node_properties(node_id=domain_obj.uid, return_node=True, **inp_data)
        if status is False:
            return "Domain update error"

    # Node works - email & username
    email_domain = [
        'gmail', 'outlook', 'hotmail', 'yahoo', 'naver', 'daum', 'proton', 'protonmail',
        'aol', 'aim', 'icloud', 'zoho', 'yandex', 'mail', 'gmx'
    ]
    node_created = []

    for email in email_list:  # Deleted 'filtered_email_list'
        match = None
        try:
            match = re.match(pattern, email)
        except TypeError as e:  # TypeError: expected string or byte-like object
            break
            # return f'Debug: email is {email}'  # email is none
        if match:
            username = match.group(1)
            domain = match.group(2)  # It's "gmail", not "gmail.com".
            if domain in email_domain:
                node_created.append(email)
                user = SurfaceUser.get_node({'username': username, 'case_id': case_id})
                if not user:
                    user = SurfaceUser.create_node({'username': username, 'case_id': case_id})

                email_obj = Email.get_node({'email': email, 'case_id': case_id})
                if not email_obj:
                    email_obj = Email.create_node({'email': email, 'case_id': case_id})

                # Relationship works
                _, register_status = Relationship.check_relationship(from_uid=user.uid, to_uid=domain_obj.uid)
                _, has_status = Relationship.check_relationship(from_uid=user.uid, to_uid=email_obj.uid)
                if register_status is False:
                    user.rel_to.connect(domain_obj, {'label': 'REGISTER'})
                if has_status is False:
                    user.rel_to.connect(email_obj, {'label': 'HAS'})
        # else:
        #     return f'Debug: No email match exist. {email}'

    # The code only for "emails"
    results_email = None
    if report.get("emails"):
        for email in report.get("emails"):
            # match = re.match(pattern, email)
            # if match:
            #     if 'abuse' not in match.group(1) and 'whois' not in match.group(1):
            #         results_email = email
            results_email = email

    # Output works
    results = {
        # "domain": domain_response,
        # "regdate": regdate,
        "email": results_email,
        "admin": report.get("admin_name"),
        "admin_email": report.get("admin_email"),
        "admin_phone": report.get("admin_phone"),
        "registrant": report.get("registrant_name"),
        "name": report.get("name"),
        "registrar": report.get("registrar"),
        "organization": report.get("org")
    }
    for key, value in results.items():
        inside = {
            "label": None,
            "property": None,
            "type": key,
            "value": value
        }
        if value:
            # if key == 'domain':
            #     inside['label'] = 'Domain'
            #     inside['property'] = 'domain'
            # elif key == 'regdate':
            #     inside['label'] = 'Domain'
            #     inside['property'] = 'regdate'
            if key in ['email', 'admin_email']:
                inside['label'] = 'Email'
                inside['property'] = 'email'
            elif key == 'admin_phone':
                inside['label'] = 'Phone'
                inside['property'] = 'number'
            elif key in ['registrar', 'organization']:
                inside['label'] = 'Company'
                inside['property'] = 'name'
            else:
                inside['label'] = 'Domain'
                inside['property'] = 'others'

        if inside['value'] in node_created:  # For Email/email
            result_obj = ResultModel(result=inside, created=True)
        else:
            result_obj = ResultModel(result=inside, created=False)
        result_obj.save()
        run.results.append(result_obj)

    run.save()


def check_whois(case_id, run_id):
    run = RunModel.objects.get(_id=run_id)
    if run.status == 'ready':
        message = 'Run the tool first.'
        return message
    elif run.status == 'error':
        # message = 'Failed run.'
        return None

    # Status 'completed' or 'running' can pass this line
    if os.path.exists(f'./reports/whois_{run.run_id}.json') and run.status == 'running':
        message = report_whois(case_id, run)
        if message:
            return message
        run.status = 'completed'
        run.save()
        message = None
    elif os.path.exists(f'./reports/whois_{run.run_id}.json') and run.status == 'completed':
        message = None
    elif not os.path.exists(f'./reports/whois_{run.run_id}.json') and run.status == 'running':
        message = f'The file \'whois_{run.run_id}.json\' not exists.(yet)'
    elif not os.path.exists(f'./reports/whois_{run.run_id}.json') and run.status == 'completed':
        message = f'Critical: The file \'whois_{run.run_id}.json\' somehow not exists.'
    else:
        message = 'Exception happens...'

    if message:
        RunModel.create_result(data=message, run_id=run.run_id)
