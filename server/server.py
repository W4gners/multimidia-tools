from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import tempfile

app = Flask(__name__)
CORS(app)

# Carregar o modelo Whisper (pode demorar um pouco na primeira vez)
model = whisper.load_model("base")

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    
    # Salvar o arquivo temporariamente
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
        audio_file.save(temp_file.name)
        temp_path = temp_file.name
    
    try:
        # Transcrever o áudio
        result = model.transcribe(temp_path)
        transcription = result["text"]
        
        # Limpar o arquivo temporário
        os.unlink(temp_path)
        
        return jsonify({'transcription': transcription})
    except Exception as e:
        if os.path.exists(temp_path):
            os.unlink(temp_path)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3001)
