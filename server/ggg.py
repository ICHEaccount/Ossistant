from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/graph/ext/create', methods=['POST'])
def receive_data():
    data = request.json
    print("Received data:", data)
    # 여기서 데이터를 처리할 수 있음
    return jsonify({"status": "success", "message": "Data received"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
