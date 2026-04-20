from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os

load_dotenv()
chave = os.getenv('GROQ_KEY')

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

@app.route('/chat', methods=['POST'])
def chat():
    dados = request.json
    historico = dados.get('mensagem')
    response = requests.post(
        'https://api.groq.com/openai/v1/chat/completions',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {chave}'  # ← usa a variável
        },
        json={
            'model': 'llama-3.3-70b-versatile',
            'max_tokens': 1024,
            'messages': historico
        }
    )
    data = response.json()
    resposta = data['choices'][0]['message']['content']
    return jsonify({'resposta': resposta})

if __name__ == '__main__':
    app.run(port=3000)