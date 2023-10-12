import datetime

# flaks 
from flask import request, jsonify,Blueprint

from db_conn.mongo.init import db 
from db_conn.mongo.models import CaseModel


bp = Blueprint('data', __name__, url_prefix='/getData')

# @bp.route('/<case_id>',methods=['GET'])
# def get_data(case_id):
#     res = {}
#     res['case_id'] = case_id,
#     res['data'] +



