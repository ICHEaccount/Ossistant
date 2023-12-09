import json
import os.path
import subprocess
import requests

from db_conn.mongo.models import RunModel
from db_conn.neo4j.models import *

def run_breach(run, input_label):
    url = "https://breachdirectory.p.rapidapi.com/"
    req_data = run.input_value

    headers = {
        "X-RapidAPI-Key": "af4f1e1e70mshb4888512dc72b85p182a1cjsn6e722049b8d6", #발급 받은 키
        "X-RapidAPI-Host": "breachdirectory.p.rapidapi.com",
    }

    params = {"func": "auto", "term": req_data}

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise an exception for bad responses (4xx and 5xx)


        if(input_label=='username'):
            input_label='SurfaceUser'
        elif(input_label=='email'):
            input_label='Email'
        elif(input_label=='domain'):
            input_label='Domain'
    
        data = response.json()

        print(data, flush=True)    
        run.status = 'ready'
        for key, value in data.items(): #데이터를 몽고DB에 저장
            #inside = {key: value}

            if key == 'success':
                continue
            if key == 'result' and not value:
                continue

            json_format={"label":input_label, 
                        "property":"others",
                        "type":key,
                        "value":value
            } #"value":data['found']}
            RunModel.create_result(data= json_format, run_id=run.run_id)

        run.status = 'completed'

        print(json_format, flush=True)
        
    except requests.exceptions.RequestException as error:
        run.status = 'error'
        print(f"Error: {error}", flush=True)

    
    run.save()
    return run.run_id