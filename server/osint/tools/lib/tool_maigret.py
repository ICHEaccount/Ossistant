import json
import os.path
import subprocess

from db_conn.mongo.models import RunModel
from db_conn.neo4j.models import SurfaceUser


def run_maigret(run):
    # print("Current working directory:", os.getcwd())
    try:
        subprocess.Popen(['maigret', run.input_value, '--json', 'simple'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        run.status = 'running'
    except Exception as e:
        message = f'Run maigret failed. Username is {run.input_value}. Return code: {e}'
        run.status = 'error'
        return message

    run.save()
    return run.run_id


def report_maigret(case_id, run):  # status is COMPLETED
    try:
        with open(f'./reports/report_{run.input_value}_simple.json', 'r') as f:
            report = json.load(f)
    except FileNotFoundError as e:
        message = f'FileNotFoundError: {e}. Something must be wrong. File may have been deleted.'
        return message

    # Get needed infos from Maigret report.
    site_user_url = {}
    for site, site_data in report.items():
        if "url_user" in site_data:
            site_user_url[site] = site_data["url_user"]

    # Middle process
    result_site = []
    result_url = []
    for key, value in site_user_url.items():
        result_site.append(key)
        result_url.append(value)

    # Making "results" format and save
    length = len(result_site)
    for i in range(length):
        inside = {
            "site": result_site[i],
            "url_user": result_url[i]
        }
        RunModel.create_result(data=inside, run_id=run.run_id)
        run.save()

    # Making response
    result_list = RunModel.get_all_results(run_id=run.run_id)[1]
    maigret_response = {
        "run_id": run.run_id,
        "state": run.status,
        "results": result_list
    }

    # node
    s_user = SurfaceUser.get_node({'username': run.input_value, 'case_id': case_id})
    if not s_user:
        s_user = SurfaceUser.created_node({'username': run.input_value, 'case_id': case_id})
    # inside the node
    inp_data = {'registered': result_site}
    status, s_user = SurfaceUser.update_node_properties(node_id=s_user.uid, return_node=True, **inp_data)
    if status is False:
        return "SurfaceUser registered update error"

    return maigret_response


def check_maigret(case_id, run_id):
    run = RunModel.objects.get(_id=run_id)
    if run.status == 'ready':
        message = 'Run the tool first.'
        return message
    elif run.status == 'error':
        message = 'Failed run.'
        return message

    # Status 'completed' or 'running' can pass this line
    if os.path.exists(f'./reports/report_{run.input_value}_simple.json'):
        run.status = 'completed'
        run.save()
    else:
        message = 'File not exists.(yet)'
        return message

    maigret_response = report_maigret(case_id, run)
    return maigret_response
