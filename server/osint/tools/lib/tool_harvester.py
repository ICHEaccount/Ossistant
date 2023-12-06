import json
import os
import subprocess

from db_conn.mongo.models import RunModel, ResultModel


def run_harvester(run):
    try:
        subprocess.Popen([
            'python',
            './tools/lib/clone/theharvester/theHarvester.py',
            '-d', run.input_value,
            '-f', f'./reports/hrv_{run.input_value}_{run.run_id}.',
            '-b', 'bing'
        ])
        run.status = 'running'
    except Exception as e:
        inside = {
            "message": f"Run theHarvester failed. Debug: {e}"
        }
        run.status = 'error'
        RunModel.create_result(data=inside, run_id=run.run_id)
    run.save()
    return run.run_id


def report_harvester(case_id, run):
    try:
        with open(f'./reports/hrv_{run.input_value}_{run.run_id}.json') as f:
            report = json.load(f)
    except FileNotFoundError as e:
        inside = {
            'message': 'No result file.'
        }
        run.status = 'error'
        RunModel.create_result(data=inside, run_id=run.run_id)
        run.save()
        return None

    # If nothing found.
    if "emails" not in report:
        if not report['hosts']:
            inside = {
                'label': 'Domain',
                'property': 'others',
                'type': 'no_data',
                'value': 'Data not found'
            }
            # RunModel.create_result(data=inside, run_id=run.run_id)
            result_obj = ResultModel(result=inside, created=True)
            result_obj.save()
            run.results.append(result_obj)
            return None

    # Found.
    if report['hosts']:
        for subdomain in report['hosts']:
            inside = {
                "label": "Domain",
                "property": "others",
                "type": "subdomain",
                "value": subdomain
            }
            RunModel.create_result(data=inside, run_id=run.run_id)

    run.save()

    # In OSSISTANT, Tool theHarvester is for subdomain only. No email collect. (for now)
    # if "emails" in report:
    #     for email in report['emails']:
    #         inside = {
    #             "label": "Email",
    #             "property": "email",
    #             "type": "email",
    #             "value": email
    #         }
    #         RunModel.create_result(data=inside, run_id=run.run_id)

    return None


def check_harvester(case_id, run_id):
    run = RunModel.objects.get(_id=run_id)
    if run.status == 'ready':
        run_harvester(run=run)
        message = None
    elif run.status == 'error':
        message = None
    elif run.status == 'running':
        if os.path.exists(f'./reports/hrv_{run.input_value}_{run.run_id}.json'):
            run.status = 'completed'
            run.save()
            message = report_harvester(case_id, run)  # Returning 'None' is normal.
        else:
            message = None
    elif run.status == 'completed':
        if os.path.exists(f'./reports/hrv_{run.input_value}_{run.run_id}.json'):
            message = None
        else:
            message = f'\'hrv_{run.input_value}_{run.run_id}.json\' not exists.'
    else:
        message = f'hrv run.status exception occurred. run.status is {run.status}'

    # if message is None, it's good.
    return message
