from flask import Flask, request, send_file, jsonify, render_template
from theme_classifier import classify_image_theme_and_palette
import requests
import io
import os
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


IMAGE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large"


ANALYSIS_API_URL = "https://api-inference.huggingface.co/models/MIT/ast-finetuned-audioset-10-10-0.4593"
GENERATION_API_URL = "https://api-inference.huggingface.co/models/facebook/musicgen-small"
ANALYSIS_API_TOKEN = "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"
GENERATION_API_TOKEN = "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"
analysis_headers = {"Authorization": f"Bearer {ANALYSIS_API_TOKEN}"}
generation_headers = {"Authorization": f"Bearer {GENERATION_API_TOKEN}"}
IMAGE_HEADERS = {"Authorization": f"Bearer {GENERATION_API_TOKEN}"}

def query_image(prompt):
    response = requests.post(IMAGE_API_URL, headers=IMAGE_HEADERS, json={"inputs": prompt})
    if response.status_code == 200:
        return response.content
    print("else block")
    return None



def analyze_audio_file(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(ANALYSIS_API_URL, headers=analysis_headers, data=data)
    return response.json() if response.status_code == 200 else None


def generate_audio_from_prompt(prompt):
    response = requests.post(GENERATION_API_URL, headers=generation_headers, json={"inputs": prompt})
    return response.content if response.status_code == 200 else None


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files['image']
    theme, confidence, palette = classify_image_theme_and_palette(image_file)
    return jsonify({"theme": theme, "confidence": confidence * 100, "palette": palette})


@app.route('/generate-image', methods=['POST'])
def generate_image():
    print("working")
    data = request.get_json()
    prompt = data.get('prompt')
    print(prompt)
    image_bytes = query_image(prompt)
    if image_bytes:
        print("IMAGE BYTES RECIEVED")
        img = Image.open(io.BytesIO(image_bytes))
        img_io = io.BytesIO()
        img.save(img_io, 'PNG')
        img_io.seek(0)
        print("working")
        return send_file(img_io, mimetype='image/png')
    return jsonify({"error": "Failed to generate image"}), 500


@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    if 'audioFile' not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    audio_file = request.files['audioFile']
    file_path = f"temp/{audio_file.filename}"
    audio_file.save(file_path)


    analysis_result = analyze_audio_file(file_path)
    os.remove(file_path)

    if analysis_result:
        themes = "\n".join(f"{theme['label']}: {theme['score']}" for theme in analysis_result)
        chord_progression = "\n".join(["C", "G", "Am", "F"])
        prompt = f"generate music with Music Themes\n{themes}\nChord Progression\n{chord_progression}"

        
        generated_audio = generate_audio_from_prompt(prompt)

        if generated_audio:
            return send_file(io.BytesIO(generated_audio), mimetype="audio/mpeg", as_attachment=True, download_name="generated_audio.mp3")
        else:
            return jsonify({"error": "Error generating audio"}), 500
    else:
        return jsonify({"error": "Error analyzing audio"}), 500

def generate_audio_from_prompt(prompt):
    response = requests.post(GENERATION_API_URL, headers=generation_headers, json={"inputs": prompt})
    return response.content if response.status_code == 200 else None

@app.route('/generate-audio', methods=['POST'])
def generate_audio():
    data = request.get_json()
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400
    
    generated_audio = generate_audio_from_prompt(prompt)
    if generated_audio:
        return send_file(io.BytesIO(generated_audio), mimetype="audio/mpeg", as_attachment=True, download_name="generated_audio.mp3")
    return jsonify({"error": "Failed to generate audio"}), 500


@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "working"})


if __name__ == '__main__':
    
    if not os.path.exists("temp"):
        os.makedirs("temp")
    app.run(debug=True)
