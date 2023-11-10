from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route('/graph/ext/create', methods=['POST'])
def receive_data():
    try:
        data = json.loads(request.data)
        print('Received data:', data)

        # Process the data here

        response = {'status': 'success', 'message': 'Data received successfully'}
        return jsonify(response), 200
    except Exception as e:
        print('Error:', e)
        response = {'status': 'error', 'message': str(e)}
        return jsonify(response), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
