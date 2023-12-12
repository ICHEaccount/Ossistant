import json
import os.path
import subprocess
import requests

from db_conn.mongo.models import RunModel
from db_conn.neo4j.models import *

def run_etherscan(run): 
    etherium_address=run.input_value
    api_key = os.environ.get("ETHERSCAN")
    api_url = f"https://api.etherscan.io/api?module=account&action=balance&address={etherium_address}&tag=latest&apikey={api_key}"
    
    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Check if the request was successful
        data = response.json() #받아온 정보 JSON

        # Print the entire JSON response
        # print("Full JSON Response:")
        # print(data)

        # 에러 체크
        if data.get('message') == "OK":          

            inside = {
                "label":"Wallet", 
                "property":"others",
                "type":"balance",
                "value":data.get('result')
            }
            RunModel.create_result(data=inside, run_id=run.run_id) 
            run.status = 'completed'
            
        else:
            run.status = 'error'
            RunModel.create_result(data={'message':data.get('result')}, run_id=run.run_id,created=False)
            print("error:",data, flush=True)

    except requests.exceptions.RequestException as e:
        run.status = 'error'
        RunModel.create_result(data={'message':e}, run_id=run.run_id,created=False)
        print(f"\nError making API request: {e}", flush=True)

    run.save()
    return run.run_id #, data