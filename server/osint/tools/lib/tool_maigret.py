import os
import json
# import maigret


def run_maigret(case_id, username, run):
    print("Current working directory:", os.getcwd())

    try:
        exec(f"maigret {username} --json simple")
        return run.run_id
    except Exception as e:
        print(f"Failed to run maigret. {e}")
        run_failed = 'run failed'
        return run_failed


def check_maigret(username):  # unfinished
    try:
        with open(f'./reports/report_{username}_simple.json', 'r') as report:
            maigret_search = json.load(report)
    except FileNotFoundError:
        print(f"'report_{username}_simple.json' not exist or can't be found.")
