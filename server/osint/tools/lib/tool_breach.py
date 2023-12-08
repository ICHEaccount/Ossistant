import json
import os.path
import subprocess
import requests

from db_conn.mongo.models import RunModel
from db_conn.neo4j.models import *

def run_breach(run):
    url = "https://breachdirectory.p.rapidapi.com/"
    req_data = run.input_value

    headers = {
        "X-RapidAPI-Key": "6cbe75edb1msh3b4816139900b59p140f0fjsn78d7d8a4ec05", #발급 받은 키
        "X-RapidAPI-Host": "breachdirectory.p.rapidapi.com",
    }

    params = {"func": "auto", "term": req_data}

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise an exception for bad responses (4xx and 5xx)
    
        data = response.json()
        print(data)
        json_format={"label":"Email", 
                     "property":"email",
                     "type":"breached",
                     "value":data}
        
        #for key, value in data.items(): #데이터를 몽고DB에 저장
        #    inside = {key: value}
        RunModel.create_result(data= json_format, run_id=run.run_id) 

        run.status = 'completed'
        
    except requests.exceptions.RequestException as error:
        run.status = 'error'
        print(f"Error: {error}", flush=True)

    
    run.save()
    return run.run_id