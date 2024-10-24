from keras_facenet import FaceNet

# Instantiate the FaceNet model
embedder = FaceNet()

# Load and preprocess an image
image_path = 'path_to_image.jpg'
embeddings = embedder.embeddings([image_path])

# Get the embeddings of the face in the image
print(embeddings)
