import json
import os.path
import subprocess

from db_conn.mongo.models import RunModel

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


def report_maigret(run):  # status is COMPLETED
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
    return maigret_response


def check_maigret(run):
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

    maigret_response = report_maigret(run)
    return maigret_response
