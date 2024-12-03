from flask import Flask, request, jsonify
from pymongo import MongoClient
import numpy as np
from PIL import Image
import io
from keras_facenet import FaceNet
from sklearn.metrics.pairwise import cosine_similarity
from numpy.linalg import norm
from flask_cors import CORS 
from scipy.spatial.distance import euclidean
from mtcnn import MTCNN
from scipy.spatial.distance import cosine
import torch
import cv2


app = Flask(__name__)
CORS(app)  
client = MongoClient('mongodb://localhost:27017/')
db = client['face_recognition_db']
embeddings_collection = db['embeddings']


embedder = FaceNet()
detector = MTCNN()

@app.route('/process_group_image', methods=['POST'])
def process_group_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    image = Image.open(io.BytesIO(file.read()))
    image_np = np.array(image)

   
    faces = detector.detect_faces(image_np)
    if not faces:
        return jsonify({'error': 'No faces detected'}), 400

    embeddings = []
    for face in faces:
        x, y, w, h = face['box']
        face_image = image_np[y:y+h, x:x+w]
        face_embedding = embedder.embeddings([face_image])[0]
        embeddings.append(np.array(face_embedding))

    
    match_results = []
    distances=[]
    for face_embedding in embeddings:
        matched_users = []
        for stored_user in embeddings_collection.find():
            stored_embedding = np.array(stored_user['embeddings'])
            similarity = cosine(face_embedding, stored_embedding[0])
            distances.append(similarity)
            if similarity <0.8:  
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

    
    image = Image.open(io.BytesIO(file.read()))
    image = np.array(image)

    embeddings = embedder.embeddings([image])

    embeddings_data = {
        'username': username,
        'phone_number': phone_number,
        'embeddings': embeddings.tolist() 
    }
    result = embeddings_collection.insert_one(embeddings_data)

    return jsonify({'message': 'Image processed and embeddings saved.', 'id': str(result.inserted_id)})

@app.route('/compare', methods=['POST'])
def compare_face():
    if 'file' not in request.files or 'phoneNumber' not in request.form:
        return jsonify({'error': 'Missing data'}), 400

    phone_number = request.form['phoneNumber']
    file = request.files['file']
    
   
    image = Image.open(io.BytesIO(file.read()))
    image = np.array(image)

    if len(image.shape) != 3:
        return jsonify({'error': 'Invalid image format, expected 3D array (H, W, C)'}), 400
    
    captured_embeddings = embedder.embeddings([image]) 

    user_data = embeddings_collection.find_one({'phone_number': phone_number})
    
    if not user_data:
        return jsonify({'error': 'User not found'}), 404
    
 
    stored_embeddings = np.array(user_data['embeddings'])
    
   
    if captured_embeddings.ndim != 2 or stored_embeddings.ndim != 2:
        return jsonify({'error': 'Invalid embedding dimensions'}), 500
    

    
    def are_faces_same(embeddings1, embeddings2, threshold=0.8):
        distance = euclidean(embeddings1[0], embeddings2[0])
        return distance<threshold,distance
    
    is_match,distance =are_faces_same(captured_embeddings,stored_embeddings)
    return jsonify({'match': is_match,'distance':distance})

@app.route('/compare_custom', methods=['POST'])
def compare_face_custom():
    if 'file' not in request.files or 'phoneNumber' not in request.form:
        return jsonify({'error': 'Missing data'}), 400

    phone_number = request.form['phoneNumber']
    file = request.files['file']
    
   
    image = Image.open(io.BytesIO(file.read()))
    image = np.array(image)

    if len(image.shape) != 3:
        return jsonify({'error': 'Invalid image format, expected 3D array (H, W, C)'}), 400
    
    captured_embeddings = embedder.embeddings([image]) 

    user_data = embeddings_collection.find_one({'phone_number': phone_number})
    
    if not user_data:
        return jsonify({'error': 'User not found'}), 404
    
 
    stored_embeddings = np.array(user_data['embeddings'])
    
   
    if captured_embeddings.ndim != 2 or stored_embeddings.ndim != 2:
        return jsonify({'error': 'Invalid embedding dimensions'}), 500
    

    
    def are_faces_same(embeddings1, embeddings2, threshold=0.8):
        distance = euclidean(embeddings1[0], embeddings2[0])
        return distance<threshold,distance
    
    is_match,distance =are_faces_same(captured_embeddings,stored_embeddings)
    return jsonify({'match': is_match,'distance':distance})




model = torch.hub.load('ultralytics/yolov5', 'yolov5s')
@app.route('/detect', methods=['POST'])
def detect():
    file = request.files['image']
    image = np.fromstring(file.read(), np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    results = model(image)
    detections = results.xyxy[0].tolist()  # Bounding boxes
    return jsonify({'detections': detections, 'count': len(detections)})



if __name__ == '__main__':
    app.run(debug=True)
