from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

print("app")

@app.route('/collectData', methods=['POST'])
def process_data():
    data = request.to_json()
    print("Received data:", data)
    return jsonify({'result': 'success', 'data': data})

if __name__ == '__main__':
    app.run(host = '0.0.0.0', debug=True)