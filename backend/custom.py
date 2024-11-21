# import tensorflow as tf
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
# from tensorflow.keras.preprocessing.image import ImageDataGenerator
# from sklearn.datasets import fetch_lfw_people
# import matplotlib.pyplot as plt



# # Load the LFW dataset
# lfw_people = fetch_lfw_people(data_home="C:/Users/viraj/scikit_learn_data", min_faces_per_person=50, resize=0.4)

# # Extract features and labels
# X = lfw_people.images  # Grayscale face images
# y = lfw_people.target  # Target labels (individuals)

# # Normalize the pixel values to the range [0, 1]
# X = X / 255.0

# # Reshape the data for CNN input (add channel dimension)
# X = X.reshape(X.shape[0], X.shape[1], X.shape[2], 1)  # (n_samples, height, width, channels)

# # One-hot encode the labels
# from tensorflow.keras.utils import to_categorical
# y = to_categorical(y, num_classes=len(lfw_people.target_names))

# print(f"Dataset shape: {X.shape}")
# print(f"Number of classes: {len(lfw_people.target_names)}")

# from sklearn.model_selection import train_test_split

# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# print(f"Training data shape: {X_train.shape}")
# print(f"Testing data shape: {X_test.shape}")


# model = Sequential([
#     # Convolutional Layer 1
#     Conv2D(32, (3, 3), activation='relu', input_shape=(X.shape[1], X.shape[2], 1)),
#     MaxPooling2D(pool_size=(2, 2)),
    
#     # Convolutional Layer 2
#     Conv2D(64, (3, 3), activation='relu'),
#     MaxPooling2D(pool_size=(2, 2)),
    
#     # Flatten the output
#     Flatten(),
    
#     # Fully connected layer
#     Dense(128, activation='relu'),
#     Dropout(0.5),
    
#     # Output layer
#     Dense(len(lfw_people.target_names), activation='softmax')
# ])

# # Print model summary
# model.summary()


# model.compile(
#     optimizer='adam',
#     loss='categorical_crossentropy',
#     metrics=['accuracy']
# )


# history = model.fit(
#     X_train, y_train,
#     validation_data=(X_test, y_test),
#     epochs=10,
#     batch_size=32
# )

# # Evaluate the model
# test_loss, test_accuracy = model.evaluate(X_test, y_test)
# print(f"Test Accuracy: {test_accuracy * 100:.2f}%")

# model.save("face_recognition_cnn.h5")