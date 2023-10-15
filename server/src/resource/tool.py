from flask import request, jsonify,Blueprint

from db_conn.mongo.init import db 
from db_conn.mongo.models import CaseModel


bp = Blueprint('tool', __name__, url_prefix='/tool')


@bp.route('/createTool',methods=["POST"])
def create_tool():
    res = request.get_json()
    status = CaseModel.create_tool(res['case_id'],tool_id=res['tool_id'],tool=res['tool'])
    if status is True:
        return jsonify({'msg':'good'}), 200
    else:
        return jsonify({'msg':'error'}), 400

@bp.route('/createRun',methods=["POST"])
def create_run():
    res = request.get_json()
    status = CaseModel.create_runs(case_id=res['case_id'],tool_id=res['tool_id'])
    if status is True:
        return jsonify({'msg':'good'}), 200
    else:
        return jsonify({'msg':'error'}), 400