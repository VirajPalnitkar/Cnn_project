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


# Initialize Flask and MongoDB
app = Flask(__name__)
CORS(app)  # Enable CORS for the entire application
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



# from flask import Flask, request, jsonify
# from flask_cors import CORS  # Import CORS
# from pymongo import MongoClient
# import numpy as np
# from PIL import Image
# import io
# from keras_facenet import FaceNet

# # Initialize Flask and MongoDB
# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes
# client = MongoClient('mongodb://localhost:27017/')
# db = client['face_recognition_db']
# embeddings_collection = db['embeddings']

# # Load FaceNet model
# embedder = FaceNet()

# @app.route('/compare', methods=['POST'])
# def compare_face():
#     if 'file' not in request.files or 'phoneNumber' not in request.form:
#         return jsonify({'error': 'Missing data'}), 400

#     phone_number = request.form['phoneNumber']
#     file = request.files['file']
    
#     # Load the image and convert it into a numpy array
#     image = Image.open(io.BytesIO(file.read()))
#     image = np.array(image)

#     # Get the face embeddings of the captured image
#     captured_embeddings = embedder.embeddings([image])[0]  # Get the first (and only) embedding
    
#     # Fetch the stored embedding for the provided phone number
#     user_data = embeddings_collection.find_one({'phone_number': phone_number})
    
#     if not user_data:
#         return jsonify({'error': 'User not found'}), 404
    
#     # Compare the embeddings
#     stored_embeddings = np.array(user_data['embeddings'])
    
#     # Implement your comparison logic here
#     is_match = np.allclose(captured_embeddings, stored_embeddings)  # Placeholder for your comparison logic

#     return jsonify({'match': is_match})

# @app.route('/dashboard/register', methods=['POST'])
# def upload_image():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part'}), 400
    
#     file = request.files['file']
#     username = request.form.get('username')
#     phone_number = request.form.get('phoneNumber')

#     if file.filename == '' or not username or not phone_number:
#         return jsonify({'error': 'Missing data'}), 400

#     # Load the image and convert it into a numpy array
#     image = Image.open(io.BytesIO(file.read()))
#     image = np.array(image)

#     # Get the face embeddings
#     embeddings = embedder.embeddings([image])

#     # Save the embeddings, username, and phone number to MongoDB
#     embeddings_data = {
#         'username': username,
#         'phone_number': phone_number,
#         'embeddings': embeddings.tolist()  # Store as list in MongoDB
#     }
#     result = embeddings_collection.insert_one(embeddings_data)

#     return jsonify({'message': 'Image processed and embeddings saved.', 'id': str(result.inserted_id)})

# if __name__ == '__main__':
#     app.run(debug=True)



# from flask import Flask, request, jsonify
# from pymongo import MongoClient
# import numpy as np
# from PIL import Image
# import io
# from keras_facenet import FaceNet
# from flask_cors import CORS  # Import CORS

# # Initialize Flask and MongoDB
# app = Flask(__name__)
# CORS(app)  # Enable CORS for the entire app
# client = MongoClient('mongodb://localhost:27017/')
# db = client['face_recognition_db']
# embeddings_collection = db['embeddings']

# # Load FaceNet model
# embedder = FaceNet()

# @app.route('/dashboard/register', methods=['POST'])
# def upload_image():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part'}), 400
    
#     file = request.files['file']
#     username = request.form.get('username')
#     phone_number = request.form.get('phoneNumber')

#     if file.filename == '' or not username or not phone_number:
#         return jsonify({'error': 'Missing data'}), 400

#     # Load the image and convert it into a numpy array
#     image = Image.open(io.BytesIO(file.read()))
#     image = np.array(image)

#     # Get the face embeddings
#     embeddings = embedder.embeddings([image])

#     # Save the embeddings, username, and phone number to MongoDB
#     embeddings_data = {
#         'username': username,
#         'phone_number': phone_number,
#         'embeddings': embeddings.tolist()  # Store as list in MongoDB
#     }
#     result = embeddings_collection.insert_one(embeddings_data)

#     return jsonify({'message': 'Image processed and embeddings saved.', 'id': str(result.inserted_id)})

# if __name__ == '__main__':
#     app.run(debug=True)
