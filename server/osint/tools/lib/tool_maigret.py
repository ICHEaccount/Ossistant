import os
import json
import subprocess


def run_maigret(case_id, username, run):
    print("Current working directory:", os.getcwd())

    try:
        subprocess.Popen(['maigret', username, '--json', 'simple'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        run.status = 'running'
    except Exception as e:
        message = f'Run maigret failed. Username is {username}. Return code: {e}'
        run.status = 'error'
        return message

    return run.run_id


def check_maigret(username, run):  # unfinished
    try:
        with open(f'./reports/report_{username}_simple.json', 'r') as report:
            maigret_search = json.load(report)
    except FileNotFoundError:
        print(f"'report_{username}_simple.json' not exist or can't be found.")
        print(f"Searching {username} is still in progress.")

    maigret_response = {
        "run_id": run.run_id,
        "state": "completed",
        "result": [
            {
                "username": maigret_search.get("username"),
                "url": maigret_search.get("url")
            }
        ]
    }
