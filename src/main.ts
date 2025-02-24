import { Scene } from "./AR/Scene";
import { Model } from "./AR/Model";
import { displayLandmarks } from "./lib/display";
import { hasGetUserMedia } from "./lib/utils";
import "./main.css";

import {
  FilesetResolver,
  GestureRecognizer,
  GestureRecognizerResult
} from "@mediapipe/tasks-vision";
import * as THREE from "three";


// declare variables
declare type RunningMode= "IMAGE" | "VIDEO";
let runningMode : RunningMode = "VIDEO";
let gestureRecognizer : GestureRecognizer | undefined;
let isWebcamRunning : boolean = false;
let results : GestureRecognizerResult | undefined = undefined;


let SCENE : Scene


// declare DOM elements
const video = document.querySelector('#webcam') as HTMLVideoElement;
const canvasElement = document.querySelector('#output_canvas') as HTMLCanvasElement;
const canvasCtx = canvasElement.getContext('2d') as CanvasRenderingContext2D;
const ARLayers = document.querySelector('#ar-layers') as HTMLElement;

init();

/**
 * Initializes the application by performing the following steps:
 * 1. Checks if the browser supports the getUserMedia API.
 * 2. Creates a gesture recognizer.
 * 3. Enables the webcam.
 * 4. Creates the scene for rendering.
 * 5. Starts the webcam prediction loop.
 * 
 * Logs the progress of each step to the console.
 * Catches and logs any errors that occur during initialization.
 * 
 * @async
 * @function init
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function init() : Promise<void> {
  try {
    await hasGetUserMedia();
    console.log("User media available");

    await createGestureRecognizer();
    console.log("Gesture recognizer created");
    
    await enableWebcam();
    console.log("Webcam enabled");

    await createScene();
    console.log("Scene created");
  
    await predictWebcam();

  } catch(e) {
    console.error(e);
  }
}


/**
 * Asynchronously creates a 3D scene with predefined models and adds them to the scene.
 * 
 * This function initializes a new `Scene` object with the dimensions of the provided video element
 * and a specified set of AR layers. It then creates two 3D models (`bottleabeer` and `TOKTOK`) with
 * their respective file paths, scales, positions, and orientations. These models are subsequently
 * added to the scene.
 * 
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when the scene and models have been successfully created and added.
 */
async function createScene() : Promise<void> {
  SCENE = new Scene(video.videoWidth, video.videoHeight, ARLayers);

  let bottleabeer = new Model(
    "beer_bottle/scene.gltf",
    new THREE.Vector3(0.02, 0.02, 0.02),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0),
    "Right"
  );

  let TOKTOK = new Model(
    "birbs/scene.gltf",
    new THREE.Vector3(0.005, 0.005, 0.005),
    new THREE.Vector3(0.5, 0, 0),
    new THREE.Vector3(0, 0, 0),
    "Left"
  );

  SCENE.add3DModel(bottleabeer);
  SCENE.add3DModel(TOKTOK);

}

/**
 * Asynchronously creates a new gesture recognizer using the MediaPipe library.
 * 
 * This function loads the MediaPipe gesture recognizer web assembly file using the `FilesetResolver`
 * and creates a new `GestureRecognizer` object with the specified options. The recognizer is configured
 * to detect gestures from two hands and run in the specified mode. The recognizer is then stored in the
 * `gestureRecognizer` variable.
 * 
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when the gesture recognizer has been successfully created.
 */
async function createGestureRecognizer() : Promise<void> {
  // Load the MediaPipe gesture recognizer
  // It is a web assembly file, so we need to load it using the FilesetResolver
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );

  gestureRecognizer = await GestureRecognizer.createFromOptions(
    vision,
    {
      numHands: 2,
      runningMode: runningMode,
      baseOptions: {
        delegate: "GPU",
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      }
    }
  )

}

/**
 * Asynchronously enables the webcam and starts the prediction loop.
 * 
 * This function toggles the `isWebcamRunning` flag to enable the webcam and starts the webcam video stream.
 * It then waits for the video to load and sets the dimensions of the canvas element to match the video dimensions.
 * The function then starts the webcam prediction loop using `requestAnimationFrame` to continuously predict gestures
 * from the webcam video
 * 
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when the webcam is successfully enabled and the prediction loop has started.
 */
async function enableWebcam() : Promise<void> {
  isWebcamRunning = !isWebcamRunning;
  if(!video) return;

  const videoOptions = {
    video: true,
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30, max: 60 }
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(videoOptions);
    video.srcObject = stream;

    await new Promise<void>((resolve) => {
      video.addEventListener('loadeddata', () => {
        canvasElement.width = video.videoWidth;
        canvasElement.height = video.videoHeight;
        console.log(`Video dimensions: ${video.videoWidth} x ${video.videoHeight}`);
        resolve();
      });
    });
  } 
  catch(e) {
    console.error(e);
  }
}

/**
 * Asynchronously predicts gestures from the webcam video stream and renders the 3D models.
 * 
 * This function continuously predicts gestures from the webcam video stream using the gesture recognizer
 * and updates the 3D models based on the detected landmarks. It clears the canvas, displays the landmarks,
 * and renders the 3D models for each hand detected in the video stream. The function then requests the next
 * animation frame to continue the prediction loop.
 * 
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when the prediction loop has completed.
 */
async function predictWebcam() : Promise<void> {
  if(!video) return;

  // check when last predicted
  const now = Date.now();
  results = gestureRecognizer?.recognizeForVideo(video, now);

  // clear the canvas, so we can draw the new results
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // update the dimensions of the canvas
  canvasElement.style.height = `${video.videoHeight}px`;
  canvasElement.style.width = `${video.videoWidth}px`;

  if(results) {
    // display landmarks
    displayLandmarks(canvasCtx, results);
    
    // render models, based on the landmarks
    renderModels(results);
  }

  // by restoring the canvas, we can draw the results
  canvasCtx.restore();

  // rerun prediction, when all logic is done inside this method
  if(isWebcamRunning) {
    window.requestAnimationFrame(predictWebcam);
    SCENE.render();
  }
}

/**
 * Renders the 3D models based on the detected landmarks from the gesture recognizer results.
 * 
 * This function iterates over each set of landmarks and handedness in the gesture recognizer results and
 * checks if a corresponding 3D model exists for the detected hand. If a model is found, the function toggles
 * the model's visibility and maps the 3D model to the detected landmarks by setting the position, rotation,
 * and scale of the model. If no hand is detected, the function hides the model.
 * 
 * @function
 * @param {GestureRecognizerResult} results - The gesture recognizer results containing the detected landmarks and handedness.
 */
function renderModels(results: GestureRecognizerResult) {
  // iterate over every landmark array
  results.landmarks.forEach((landmarks, index) => {
    // get hand of this landmark array
    const handedness = results.handedness[index][0];
    const hand = handedness.displayName;

    // check if we have a model that corresponds to this hand (e.g. no model needed for Left)
    const model = SCENE.models.find((model) => model.getHand() === hand);

    // position, rotate and scale the model to the hand
    if(model) {
      model.toggleVisibility(true);
      map3DModel(landmarks, model);
    }      
  });

  // hide the model when no hand is detected
  toggleVisibility(results);
}

/**
 * Toggles the visibility of the 3D models based on the detected hands in the gesture recognizer results.
 * 
 * This function iterates over each 3D model in the scene and checks if the model corresponds to a detected hand
 * in the gesture recognizer results. If the model does not correspond to a detected hand, the function hides the model.
 * 
 * @function
 * @param {GestureRecognizerResult | undefined} results - The gesture recognizer results containing the detected hands.
 */
function toggleVisibility(results : GestureRecognizerResult | undefined) {
  SCENE.models.forEach((model) => {
    const handIndex = results?.handedness.findIndex(
      (handedness) => handedness[0].displayName === model.getHand()
    );
    if (handIndex === -1) {
      model.toggleVisibility(false);
    }
  });
}

/**
 * Maps the 3D model to the detected landmarks by setting the position, rotation, and scale of the model.
 * 
 * This function maps the 3D model to the detected landmarks by normalizing the x, y, and z values of the landmarks
 * and calculating the position, rotation, and scale of the model based on the detected hand. The function sets the
 * position of the model based on the palm base landmark, the rotation based on the angle between the index finger and
 * the thumb, and the scale based on the distance between the index finger and the thumb.
 * 
 * @function
 * @param {Array<{ x: number, y: number, z: number }>} landmarks - The detected landmarks for the hand.
 * @param {Model} model - The 3D model to map to the detected landmarks.
 */
async function map3DModel(
  landmarks : { x: number, y: number, z: number }[],
  model : Model
) {
  const palmBase = landmarks[0];
  const indexFinger = landmarks[8];
  const thumb = landmarks[4];

  // position
  // by normalizing the x, y and z values, we can map them to the 3D space
  let mX = (palmBase.x - 0.5) * 2;
  let mY = -(palmBase.y - 0.5) * 2;
  let mZ = -palmBase.z * 2;
  model.setPosition(mX, mY, mZ);

  // rotation calculation
  // calculate the angle between the index finger and the thumb
  const midX = (indexFinger.x + thumb.x) / 2;
  const midY = (indexFinger.y + thumb.y) / 2;
  const dX = midX - palmBase.x;
  const dY = midY - palmBase.y;
  const angle = -Math.atan2(dY, dX) - Math.PI / 2;
  // set rotation
  model.setRotation(0, 0, angle);

  // scale
  const scale = Math.sqrt(dX * dX + dY * dY) * 0.05;
  model.setScale(scale, scale, scale);
}