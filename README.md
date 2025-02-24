# AR on Hands Project

This project demonstrates the use of augmented reality (AR) on hand tracking using MediaPipe and Three.js. The project uses the MediaPipe Hands model to detect hand landmarks and then renders a 3D model on top of the hand using Three.js. The 3D model is adjusted based on the detected hand movements, allowing for interactive AR experiences.

## Features

- Hand tracking using MediaPipe's Gesture Recognizer.
- Rendering of 3D models on detected hand landmarks using Three.js.
- Real-time webcam input for hand gesture recognition.
- Dynamic adjustment of 3D model position and rotation based on hand movements.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/digitalproductstudio/mediapipe-ar-hands
    ```
2. Navigate to the project directory:
    ```sh
    cd ar-on-hands
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the development server:
    ```sh
    npm start
    ```
2. Open your browser and navigate to `http://localhost:5173`.

## How It Works

1. **Hand Tracking**: The project uses MediaPipe's Gesture Recognizer to detect hand landmarks from the webcam feed.
2. **3D Rendering**: Three.js is used to render a 3D model on top of the detected hand landmarks.
3. **Real-time Updates**: The position and rotation of the 3D model are dynamically updated based on the hand's movements.

## Code Overview

### Main Components

#### `main.ts`
This is the entry point of the application. It initializes the webcam, sets up the gesture recognizer, and manages the main loop for rendering the 3D models based on hand tracking data.

#### `Scene.ts`
This file defines the `Scene` class, which sets up the Three.js scene, including the camera, renderer, and lighting. It also manages the addition and rendering of 3D models.

#### `Model.ts`
This file defines the `Model` class, which handles loading and manipulating 3D models using Three.js. It includes methods for setting the position, rotation, and scale of the models, as well as showing and hiding them.

#### `utils.ts`
This file contains utility functions, such as `hasGetUserMedia`, which checks if the browser supports accessing the webcam.

### File Structure

```
/src
    ├── AR
    │   ├── Model.ts
    │   └── Scene.ts
    ├── lib
    │   └── utils.ts
    ├── main.ts
    └── main.css
```
## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.