import os
import json
import subprocess
# import maigret


def run_maigret(case_id, username, run):
    print("Current working directory:", os.getcwd())

    try:
        # exec(f"maigret {username} --json simple")
        subprocess.run(['maigret', username, '--json', 'simple'], check=True)
    except subprocess.CalledProcessError as e:
        run_failed = f'Run failed. Username is {username}. Return code: {e.returncode}'
        return run_failed

    return run.run_id


def check_maigret(username):  # unfinished
    try:
        with open(f'./reports/report_{username}_simple.json', 'r') as report:
            maigret_search = json.load(report)
    except FileNotFoundError:
        print(f"'report_{username}_simple.json' not exist or can't be found.")
