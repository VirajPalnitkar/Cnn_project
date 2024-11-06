from flask import Flask, request, jsonify
from pymongo import MongoClient
import numpy as np
from PIL import Image
import io
from keras_facenet import FaceNet
from sklearn.metrics.pairwise import cosine_similarity
from numpy.linalg import norm
from flask_cors import CORS  # Import CORS
from scipy.spatial.distance import euclidean
from mtcnn import MTCNN
from scipy.spatial.distance import cosine

# Initialize Flask and MongoDB
app = Flask(__name__)
CORS(app)  # Enable CORS for the entire application
client = MongoClient('mongodb://localhost:27017/')
db = client['face_recognition_db']
embeddings_collection = db['embeddings']

# Load FaceNet model
embedder = FaceNet()
detector = MTCNN()

@app.route('/process_group_image', methods=['POST'])
def process_group_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    image = Image.open(io.BytesIO(file.read()))
    image_np = np.array(image)

    # Detect faces in the image
    faces = detector.detect_faces(image_np)
    if not faces:
        return jsonify({'error': 'No faces detected'}), 400

    embeddings = []
    for face in faces:
        x, y, w, h = face['box']
        face_image = image_np[y:y+h, x:x+w]
        face_embedding = embedder.embeddings([face_image])[0]
        embeddings.append(np.array(face_embedding))

    # Check each embedding against stored embeddings
    match_results = []
    distances=[]
    for face_embedding in embeddings:
        matched_users = []
        for stored_user in embeddings_collection.find():
            stored_embedding = np.array(stored_user['embeddings'])
            similarity = cosine(face_embedding, stored_embedding[0])
            distances.append(similarity)
            if similarity >0.8:  # Adjust threshold as needed
                matched_users.append(stored_user['username'])
        match_results.append(matched_users)

    return jsonify({'matches': match_results,"distances":[stored_embedding.ndim,face_embedding.ndim,distances,embeddings_collection.count_documents({})]})

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

@app.route('/compare', methods=['POST'])
def compare_face():
    if 'file' not in request.files or 'phoneNumber' not in request.form:
        return jsonify({'error': 'Missing data'}), 400

    phone_number = request.form['phoneNumber']
    file = request.files['file']
    
    # Load the image and convert it into a numpy array
    image = Image.open(io.BytesIO(file.read()))
    image = np.array(image)

    # Ensure the image has 3 dimensions (height, width, channels) and is a valid image format
    if len(image.shape) != 3:
        return jsonify({'error': 'Invalid image format, expected 3D array (H, W, C)'}), 400
    
    # Get the face embeddings of the captured image
    captured_embeddings = embedder.embeddings([image])  # Get the first (and only) embedding

    # Fetch the stored embedding for the provided phone number
    user_data = embeddings_collection.find_one({'phone_number': phone_number})
    
    if not user_data:
        return jsonify({'error': 'User not found'}), 404
    
    # Compare the embeddings
    stored_embeddings = np.array(user_data['embeddings'])
    
    # Ensure both embeddings are 2D arrays
    if captured_embeddings.ndim != 2 or stored_embeddings.ndim != 2:
        return jsonify({'error': 'Invalid embedding dimensions'}), 500
    
    # Perform the comparison (L2 distance or other method)
    
    def are_faces_same(embeddings1, embeddings2, threshold=0.8):
        distance = euclidean(embeddings1[0], embeddings2[0])
        return distance<threshold,distance
    
    is_match,distance =are_faces_same(captured_embeddings,stored_embeddings)
    return jsonify({'match': is_match,'distance':distance})


if __name__ == '__main__':
    app.run(debug=True)
