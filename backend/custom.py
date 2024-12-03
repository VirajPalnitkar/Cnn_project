import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Input, BatchNormalization, ReLU, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
import tensorflow.keras.backend as K

# Step 1: Build the Embedding Model
def build_embedding_model(input_shape=(224, 224, 3), embedding_size=512):
    inputs = Input(shape=input_shape)
    
    # Convolutional layers
    x = Conv2D(64, (3, 3), padding='same', activation=None)(inputs)
    x = BatchNormalization()(x)
    x = ReLU()(x)
    x = MaxPooling2D(pool_size=(2, 2))(x)
    
    x = Conv2D(128, (3, 3), padding='same', activation=None)(x)
    x = BatchNormalization()(x)
    x = ReLU()(x)
    x = MaxPooling2D(pool_size=(2, 2))(x)
    
    x = Conv2D(256, (3, 3), padding='same', activation=None)(x)
    x = BatchNormalization()(x)
    x = ReLU()(x)
    x = MaxPooling2D(pool_size=(2, 2))(x)
    
    x = Conv2D(512, (3, 3), padding='same', activation=None)(x)
    x = BatchNormalization()(x)
    x = ReLU()(x)
    x = GlobalAveragePooling2D()(x)
    
    # Output embedding layer
    embeddings = Dense(embedding_size, activation=None, name="embedding_layer")(x)
    
    return Model(inputs, embeddings, name="EmbeddingModel")

embedding_model = build_embedding_model()
embedding_model.summary()

# Step 2: Preprocess Images
def preprocess_images(image, label):
    """Resize and normalize images."""
    image = tf.image.resize(image, (224, 224))  # Resize to 224x224
    image = image / 255.0  # Normalize to [0, 1]
    return image, label

# Load CIFAR-10 dataset
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.cifar10.load_data()

# Apply preprocessing to dataset
train_dataset = tf.data.Dataset.from_tensor_slices((x_train, y_train))
train_dataset = train_dataset.map(preprocess_images).batch(32)

# Step 3: Create Pairs for Contrastive Learning
def create_pairs(images, labels):
    """Generate positive and negative pairs for training."""
    pairs = []
    targets = []
    num_classes = np.max(labels) + 1

    # Group images by class
    digit_indices = [np.where(labels == i)[0] for i in range(num_classes)]

    for idx1 in range(len(images)):
        x1 = tf.image.resize(images[idx1], (224, 224))  # Resize to 224x224
        label = labels[idx1]
        
        # Positive pair
        idx2 = np.random.choice(digit_indices[label[0]])
        x2 = tf.image.resize(images[idx2], (224, 224))  # Resize to 224x224
        pairs.append([x1, x2])
        targets.append(1)  # Positive pair

        # Negative pair
        neg_label = np.random.randint(0, num_classes)
        while neg_label == label:
            neg_label = np.random.randint(0, num_classes)
        idx2 = np.random.choice(digit_indices[neg_label])
        x2 = tf.image.resize(images[idx2], (224, 224))  # Resize to 224x224
        pairs.append([x1, x2])
        targets.append(0)  # Negative pair

    return np.array(pairs), np.array(targets)

pairs, targets = create_pairs(x_train, y_train)

# Step 4: Define Contrastive Loss
def contrastive_loss(y_true, y_pred, margin=1.0):
    """Contrastive loss function."""
    square_pred = K.square(y_pred)
    margin_square = K.square(K.maximum(margin - y_pred, 0))
    return K.mean(y_true * square_pred + (1 - y_true) * margin_square)

# Step 5: Build Training Model
input_a = Input(shape=(224, 224, 3))
input_b = Input(shape=(224, 224, 3))

# Use the same embedding model for both inputs
embedding_a = embedding_model(input_a)
embedding_b = embedding_model(input_b)

# Compute the distance between the embeddings
distance = tf.keras.layers.Lambda(lambda tensors: K.sqrt(K.sum(K.square(tensors[0] - tensors[1]), axis=-1)))(
    [embedding_a, embedding_b]
)

# Training model
training_model = Model(inputs=[input_a, input_b], outputs=distance)
training_model.compile(optimizer=Adam(learning_rate=0.001), loss=contrastive_loss)
training_model.summary()

# Step 6: Train the Model
training_model.fit(
    [pairs[:, 0], pairs[:, 1]],  # Input: pairs of images
    targets,  # Labels: 1 (positive), 0 (negative)
    batch_size=32,
    epochs=10,
    validation_split=0.2
)

# Step 7: Save the Model
embedding_model.save("embedding_model.h5")
