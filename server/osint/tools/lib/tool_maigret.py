import json
import subprocess


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


def check_maigret(run):
    if run.status == 'ready':
        message = 'Run the tool first.'
        return message
    elif run.status == 'error':
        message = 'Failed run.'
        return message

    # Status 'completed' or 'running' can pass this line
    try:
        username = run.input_value
        with open(f'./reports/report_{username}_simple.json', 'r') as report:
            maigret_search = json.load(report)
    except FileNotFoundError as e:
        message = f'FileNotFoundError: {e}.'
        return message

    run.status = 'completed'
    run.save()

    # ADD maigret_search filtering code HERE

    maigret_response = {
        "run_id": run.run_id,
        "status": run.status,
        "result": [
            {
                "To Do": "here"
            }
        ]
    }
    return maigret_response
