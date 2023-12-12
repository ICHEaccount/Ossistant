import json
import os.path
import subprocess
import requests

from db_conn.mongo.models import RunModel
from db_conn.neo4j.models import *

def run_breach(run, input_label):
    url = "https://breachdirectory.p.rapidapi.com/"
    api_key = os.environ.get("BREACHED_DIRECTORY")
    req_data = run.input_value

    headers = {
        "X-RapidAPI-Key": api_key, #발급 받은 키
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
            if key ==  "found":
                RunModel.create_result(data= json_format, run_id=run.run_id)
                if value > 0:
                    node_obj = NODE_LIST[input_label].get_node({'uid':run.input_node})
                    if node_obj:
                        node_obj.leaked = 'Yes'
                        node_obj.save()
            else:
                if value:
                    for leaked_data in value:
                        for leaked_key, leaked_value in leaked_data.items():
                            if leaked_key is "source":
                                break 
                            leaked_json_format = {
                                "label":input_label, 
                                "property":"others",
                                "type":leaked_key,
                                "value":leaked_value
                            }
                            RunModel.create_result(data=leaked_json_format, run_id=run.run_id)

        run.status = 'completed'

        print(json_format, flush=True)
        
    except requests.exceptions.RequestException as error:
        run.status = 'error'
        print(f"Error: {error}", flush=True)

    
    run.save()
    return run.run_id