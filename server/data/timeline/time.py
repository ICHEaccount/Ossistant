
from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/show',methods=["GET"])
def show_timeline():
    # DB 호출
    res = dict()
    res['a'] = 'a'
    return jsonify(res), 200 


@app.route('/create',methods=["POST"])
def create_some():
    data = request.get_json()  
    print(data)
    print(data['username'])
    return jsonify({'msg':'hell'}), 200


if __name__ == '__main__':
    app.run(host = '0.0.0.0', debug=True, port=5011)