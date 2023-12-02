import os 
import datetime 
import base64
import re
from PIL import Image
from io import BytesIO

import pandas as pd
import numpy as np 
from flask import Blueprint, jsonify, send_file, request

from db_conn.neo4j.init import db
from db_conn.neo4j.models import *
from db_conn.mongo.models import CaseModel

bp = Blueprint('export', __name__, url_prefix='/export')

# path 
DOCS_BASE_PATH = os.path.abspath('./docs')
EXCEL_PATH = os.path.join(DOCS_BASE_PATH,'excel')
REPORT_PATH = os.path.join(DOCS_BASE_PATH,'report')

## Image name 
RELATION = 1
WHOLE = 2
SUSPECT = 3
DOMAIN = 4 

IMAGE_NAME = {
    RELATION : 'relation.png',
    WHOLE : 'whole.png',
    SUSPECT : 'suspect.png',
    DOMAIN : 'domain.png'
}

def create_case_path(case_id, base_path):
    try:
        if not os.path.exists(DOCS_BASE_PATH):
            os.mkdir(path=DOCS_BASE_PATH)    

        if not os.path.exists(base_path):
            os.mkdir(path=base_path)
        
        case_path = os.path.join(base_path, case_id)
        if not os.path.exists(case_path):
            os.mkdir(path=case_path)
        
        return True, case_path
    except OSError as e:
        return False, "path" + str(e)

def get_case_name_from_id(case_id):
    case_obj = CaseModel.objects.get(case_id=case_id)   
    if not case_obj:
        return None
    else:
        return case_obj.case_name


@bp.route('/excel/<string:case_id>', methods=['GET'])
def export_excel(case_id):
    if not case_id:
        return jsonify({'Error': 'case_id did not exist'}), 404

    try:
        create_flag, msg= create_case_path(case_id=case_id, base_path=EXCEL_PATH)
        if create_flag is False:
            return jsonify({'Error':msg }), 500
        else:
            case_path = msg

        casename = get_case_name_from_id(case_id=case_id)
        if casename is None:
            return jsonify({'Error': 'Case did not exist'}), 500 
        
        export_time = datetime.datetime.now().strftime("%Y%m%d")
        excel_filename = casename + "_" + export_time + ".xlsx"
        excel_file_path = os.path.join(case_path,excel_filename)
    
        # Write in Excel 
        writer = pd.ExcelWriter(excel_file_path, engine='xlsxwriter')
        workbook=writer.book
        worksheet=workbook.add_worksheet('Result')
        writer.sheets['Result'] = worksheet

        start_row = 1

        for key, node_obj in NODE_LIST.items():
            get_node_flag, node_data = node_obj.get_all_nodes_list(case_id=case_id, is_export=True)
            if get_node_flag is True:
                node_df = pd.DataFrame.from_dict(data=node_data, orient='columns')

                if not node_df.empty:
                    worksheet.write_string(start_row, 1, key)
            
                    node_df.to_excel(writer,sheet_name='Result', index=False, startrow= start_row+1, startcol=1)
                    start_row += (node_df.shape[0] + 3)

        writer.close()

        # Send file 
        return send_file(excel_file_path, as_attachment=True)
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    
# This is other excel version :) 
# excel_writer = pd.ExcelWriter('output_file.xlsx', engine='xlsxwriter')

# for key, node_obj in NODE_LIST.items():
#     get_node_flag, node_data = node_obj.get_all_nodes_list(case_id='b2ba1f9a-8fea-11ee-b98c-0242ac190006', is_export=True)
#     if get_node_flag is True:
#         node_df = pd.DataFrame.from_dict(data=node_data, orient='columns')
#         node_df.name = key
#         if not node_df.empty:
#             # Write each DataFrame to a separate sheet in the Excel file
#             node_df.to_excel(excel_writer, sheet_name=key, index=False)

# # Save and close the Excel writer
# excel_writer.close()

@bp.route('/upload/img', methods=["POST"])
def upload_image():
    req = request.get_json()
    if not req:
        return jsonify({'Error':'Request did not exist'}), 404
    if 'type' not in req or 'img' not in req or 'case_id' not in req:
        return jsonify({'Error':'Invalid req'}), 404
    
    req_type = req.get('type')
    case_id = req.get('case_id')
    data = req.get('img')
    try:
        create_flag, msg= create_case_path(case_id=case_id, base_path=REPORT_PATH)
        if create_flag is False:
            return jsonify({'Error':msg }), 500
        else:
            case_path = msg

        report_path = os.path.join(case_path,IMAGE_NAME[req_type])

        # create image 
        encoded_data = re.search(r'base64,(.*)', data).group(1)
        decoded_data = base64.b64decode(encoded_data)
        image = Image.open(BytesIO(decoded_data))
        image.save(report_path)

        return jsonify({'Message':'Success'}), 200
    except OSError as e:
        return jsonify({'Error':"OS" + str(e)}), 500 
    except Exception as e:
        return jsonify({'Error':str(e)}), 500 

    

    