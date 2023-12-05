import json
import os.path
import subprocess
import requests

from db_conn.mongo.models import RunModel
from db_conn.neo4j.models import *

def run_btc(run): 
    bitcoin_address=run.input_value
    api_url = f'https://chain.api.btc.com/v3/address/{bitcoin_address}'
    
    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Check if the request was successful
        res_data = response.json() #받아온 정보 JSON
        data = res_data['data']
        # Print the entire JSON response
        print("Full JSON Response:")
        print(data)

        # 에러 체크

        if data.get('err_no') == 0:          
            for key, value in data.get('data').items(): #데이터를 몽고DB에 저장. #에러 주의 #^^ by RINM
                inside = {key: value}
                RunModel.create_result(data=inside, run_id=run.run_id) 

            run.status = 'completed'
            
        else:
            run.status = 'error'
            print(f"\nError: {data.get('err_msg')}")

    except requests.exceptions.RequestException as e:
        print(f"\nError making API request: {e}")

    run.save()
    return run.run_id #, data