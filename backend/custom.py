import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import cifar10
from tensorflow.keras.utils import to_categorical

def create_cnn_embedding_model(input_shape=(32, 32, 3), embedding_size=512):
    """
    Create a CNN model from scratch for embedding extraction.
    :param input_shape: Shape of the input image
    :param embedding_size: Size of the embedding vector
    :return: Keras Model
    """
    model = models.Sequential()

    # Convolutional layers
    model.add(layers.Conv2D(32, (3, 3), activation='relu', input_shape=input_shape))
    model.add(layers.MaxPooling2D((2, 2)))

    model.add(layers.Conv2D(64, (3, 3), activation='relu'))
    model.add(layers.MaxPooling2D((2, 2)))

    model.add(layers.Conv2D(128, (3, 3), activation='relu'))
    model.add(layers.GlobalAveragePooling2D())  # Reduces the spatial dimensions

    # Fully connected embedding layer
    model.add(layers.Dense(embedding_size, activation=None, name="embedding_layer"))

    return model

def preprocess_data(X, y):
    """
    Preprocess CIFAR-10 data.
    :param X: Input images
    :param y: Labels
    :return: Preprocessed images and one-hot encoded labels
    """
    X = X.astype('float32') / 255.0  # Normalize images to [0, 1]
    y = to_categorical(y, num_classes=10)  # One-hot encoding for classification training
    return X, y

# Load and preprocess the CIFAR-10 dataset
(X_train, y_train), (X_test, y_test) = cifar10.load_data()
X_train, y_train = preprocess_data(X_train, y_train)
X_test, y_test = preprocess_data(X_test, y_test)

# Create the model
embedding_model = create_cnn_embedding_model(input_shape=(32, 32, 3), embedding_size=512)

# Add a temporary classification head for training
classification_model = models.Sequential([
    embedding_model,
    layers.Dense(10, activation='softmax')  # Classification layer for training
])

classification_model.compile(optimizer='adam',
                              loss='categorical_crossentropy',
                              metrics=['accuracy'])

# Train the model
history = classification_model.fit(X_train, y_train, epochs=10, batch_size=64, validation_data=(X_test, y_test))

# Save the trained embedding model
embedding_model.save("cnn_embedding_model.h5")
