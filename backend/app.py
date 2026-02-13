
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from pdf_utils import genera_pdf

app = Flask(__name__)
CORS(app)


@app.route('/api/preventivo', methods=['POST'])
def genera_preventivo():
    dati = request.json
    if dati.get('modalita') == 'pdf':
        pdf_path = genera_pdf(dati)
        return jsonify({'pdfUrl': pdf_path})
    else:
        return jsonify({'messaggio': 'Preventivo digitale generato (funzionalità firma digitale da implementare).'})

# Serve i file statici (PDF)
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'static'), filename)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
