from flask import Flask, request, jsonify
from pymongo import MongoClient
import numpy as np
from PIL import Image
import io
from keras_facenet import FaceNet
from flask_cors import CORS  # Import CORS

# Initialize Flask and MongoDB
app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app
client = MongoClient('mongodb://localhost:27017/')
db = client['face_recognition_db']
embeddings_collection = db['embeddings']

# Load FaceNet model
embedder = FaceNet()

@app.route('/dashboard/register', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    username = request.form.get('username')
    phone_number = request.form.get('phoneNumber')

    if file.filename == '' or not username or not phone_number:
        return jsonify({'error': 'Missing data'}), 400

    # Load the image and convert it into a numpy array
    image = Image.open(io.BytesIO(file.read()))
    image = np.array(image)

    # Get the face embeddings
    embeddings = embedder.embeddings([image])

    # Save the embeddings, username, and phone number to MongoDB
    embeddings_data = {
        'username': username,
        'phone_number': phone_number,
        'embeddings': embeddings.tolist()  # Store as list in MongoDB
    }
    result = embeddings_collection.insert_one(embeddings_data)

    return jsonify({'message': 'Image processed and embeddings saved.', 'id': str(result.inserted_id)})

if __name__ == '__main__':
    app.run(debug=True)
