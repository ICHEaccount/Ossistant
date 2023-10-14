import datetime

# flaks 
from flask import request, jsonify,Blueprint

from db_conn.mongo.init import db 
from db_conn.mongo.models import CaseModel


bp = Blueprint('data', __name__, url_prefix='/data')

# @bp.route('/<case_id>',methods=['GET'])
# def get_data(case_id):
#     res = {}
#     res['case_id'] = case_id,
#     res['data'] +

@bp.route('/createData',methods=['POST'])
def create_data():

    return 0

@bp.route('/getData')
def get_data():

    return 0

@bp.route('/editData',methods=['POST'])

@bp.route('/deleteData/<int:case_id>')