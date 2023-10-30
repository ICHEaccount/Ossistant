import os
import json
import subprocess


def run_maigret(case_id, username, run):
    print("Current working directory:", os.getcwd())

    try:
        subprocess.Popen(['maigret', run.input_value, '--json', 'simple'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        run.status = 'running'
    except Exception as e:
        message = f'Run maigret failed. Username is {run.input_value}. Return code: {e}'
        run.status = 'error'
        return message

    return run.run_id


def check_maigret(run):  # unfinished
    try:
        username = run.input_value
        with open(f'./reports/report_{username}_simple.json', 'r') as report:
            maigret_search = json.load(report)
    except FileNotFoundError as e:
        # print(f"'report_{username}_simple.json' not exist or can't be found.")
        # status = run.status
        message = f'Error: {e}. cd: {os.getcwd()}.'
        return message

    run.status = 'completed'

    maigret_response = {
        "run_id": run.run_id,
        "state": run.status,
        "result": [
            {
                "surfaceuser": {
                    "username": run.input_value,
                    "url": maigret_search
                }
            }
        ]
    }
