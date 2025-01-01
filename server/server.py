from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import tempfile
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Carregar o modelo Whisper (pode demorar um pouco na primeira vez)
try:
    logger.info("Carregando modelo Whisper...")
    model = whisper.load_model("base")
    logger.info("Modelo Whisper carregado com sucesso!")
except Exception as e:
    logger.error(f"Erro ao carregar modelo Whisper: {str(e)}")
    raise

@app.route('/transcribe', methods=['POST'])
def transcribe():
    try:
        logger.info("Recebendo requisição de transcrição")
        
        if 'audio' not in request.files:
            logger.error("Nenhum arquivo de áudio fornecido")
            return jsonify({'error': 'Nenhum arquivo de áudio fornecido'}), 400
        
        audio_file = request.files['audio']
        if not audio_file.filename:
            logger.error("Nome do arquivo vazio")
            return jsonify({'error': 'Nome do arquivo vazio'}), 400

        logger.info(f"Processando arquivo: {audio_file.filename}")
        
        # Salvar o arquivo temporariamente
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
            audio_file.save(temp_file.name)
            temp_path = temp_file.name
            logger.info(f"Arquivo salvo temporariamente em: {temp_path}")
        
        try:
            # Transcrever o áudio
            logger.info("Iniciando transcrição...")
            result = model.transcribe(temp_path)
            transcription = result["text"]
            logger.info("Transcrição concluída com sucesso")
            
            # Limpar o arquivo temporário
            os.unlink(temp_path)
            logger.info("Arquivo temporário removido")
            
            return jsonify({'transcription': transcription})
        except Exception as e:
            logger.error(f"Erro durante a transcrição: {str(e)}")
            if os.path.exists(temp_path):
                os.unlink(temp_path)
            return jsonify({'error': f'Erro ao processar áudio: {str(e)}'}), 500
            
    except Exception as e:
        logger.error(f"Erro inesperado: {str(e)}")
        return jsonify({'error': f'Erro inesperado: {str(e)}'}), 500

if __name__ == '__main__':
    logger.info("Iniciando servidor na porta 3001...")
    app.run(port=3001, debug=True)
