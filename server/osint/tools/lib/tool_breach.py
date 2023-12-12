import json
import os.path
import subprocess
import requests

from db_conn.mongo.models import RunModel
from db_conn.neo4j.models import *

def input_json(input_label, key, value):
    json_format={"label":input_label, 
                        "property":"others",
                        "type":key,
                        "value":value
            }
    return json_format


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
        else:
            err = { "message": "Not Defined label" }
            RunModel.create_result(data=err, run_id=run.run_id)
            run.status = 'error'
            return
    
        data = response.json()

        print(data, flush=True)    
        run.status = 'ready'   

        for key, value in data.items(): #데이터를 몽고DB에 저장

            if key == 'success':
                continue
            elif key == 'result' and not value:
                continue
            elif key == 'result' and value:
                result_array = data.get('result', [])
                for result_item in result_array:
                    password = result_item.get('password', '')
                    RunModel.create_result(data=input_json(input_label, 'password', password), run_id=run.run_id)

                    sources = result_item.get('sources', [])
                    for source in sources:
                        RunModel.create_result(data=input_json(input_label, 'source', source), run_id=run.run_id)

            elif key ==  "found":
                RunModel.create_result(data=input_json(input_label, 'found', value), run_id=run.run_id)
            else:
                err = { "message": "API return value error" }
                RunModel.create_result(data=err, run_id=run.run_id)
                run.status = 'error'
            
        run.status = 'completed'
        
    except requests.exceptions.RequestException as error:
        run.status = 'error'
        err = { "message": "500 api server error" }
        RunModel.create_result(data=err, run_id=run.run_id)
    
    run.save()
    return run.run_id