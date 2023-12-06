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
        "X-RapidAPI-Key": "e0722ff2ffmshc757bb19c9a00d7p171c87jsn8ea60da9698c", #발급 받은 키
        "X-RapidAPI-Host": "breachdirectory.p.rapidapi.com",
    }

    params = {"func": "auto", "term": req_data}

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise an exception for bad responses (4xx and 5xx)
    
        data = response.json()
        print(data)
               
        for key, value in data.items(): #데이터를 몽고DB에 저장
            inside = {key: value}
            RunModel.create_result(data=inside, run_id=run.run_id) 

        run.status = 'completed'
    except requests.exceptions.RequestException as error:
        print(f"Error: {error}")
    
    run.save()
    return run.run_id