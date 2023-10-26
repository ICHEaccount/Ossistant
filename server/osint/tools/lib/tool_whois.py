import whois
import json
import re

from flask import jsonify
from db_conn.neo4j.lib.relation_manager import SurfaceUser, Domain


def run_whois(case_id, domain, run):
    # 1. Execute
    whois_search = whois.whois(domain)
    # whois_result = json.dumps(whois_search, default=str, ensure_ascii=False)

    whois_response = {
        "run_id": "",
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
    # whois_response = json.dumps(whois_response, default=str, ensure_ascii=False)
    # whois_response = json.loads(whois_response)

    # 2. Save to DB
    regdate = whois_response['result'][0]['domain']['regdate']
    if regdate:
        regdate = regdate.strftime('%Y-%m-%d')

    # 1차 email to username
    regex = r'^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}$'
    pattern = re.compile(regex)
    email = whois_response['result'][0]['domain']['email']
    # Npde
    match = re.match(pattern, email)
    if match:
        username = match.group(1)
        user = SurfaceUser.nodes.first_or_none(username=username)
        if not user:
            user = SurfaceUser(username=username, case_id=case_id).save()

        domain_obj = Domain.nodes.first_or_none(domain=domain)
        if not domain_obj:
            domain_obj = Domain(domain=domain, regdate=regdate, status=False, case_id=case_id).save()
        else:
            inp_data = {'regdate': regdate}
            domain_obj = Domain.update_node_properties(node_id=domain_obj.uid, **inp_data)

        # Establishing the relationship
        if not user.register.is_connected(domain_obj):
            user.register.connect(domain_obj)

        run.status = 'completed'
        run.save()

        return run.run_id
