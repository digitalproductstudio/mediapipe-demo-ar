import { hasGetUserMedia } from "./lib/utils";
import "./main.css";

import {
  FilesetResolver,
  GestureRecognizer,
  GestureRecognizerResult
} from "@mediapipe/tasks-vision";


// declare variables
declare type RunningMode= "IMAGE" | "VIDEO";
let runningMode : RunningMode = "VIDEO";
let gestureRecognizer : GestureRecognizer | undefined;
let isWebcamRunning : boolean = false;
let lastVideoTime = -1;
let results : GestureRecognizerResult | undefined = undefined;

// declare DOM elements
const video = document.querySelector('#webcam') as HTMLVideoElement;
const canvasElement = document.querySelector('#output_canvas') as HTMLCanvasElement;
const canvasCtx = canvasElement.getContext('2d') as CanvasRenderingContext2D;
const gestureOutput = document.querySelector('#gesture_output') as HTMLDivElement;
const btnEnableWebcam = document.querySelector('#webcamButton') as HTMLButtonElement;
const ARLayers = document.querySelector('#ar-layers') as HTMLElement;

init();

async function init() {
  try {
    await hasGetUserMedia();
    console.log("User media available");

    await createGestureRecognizer();
    console.log("Gesture recognizer created");
    
    await enableWebcam();
    console.log("Webcam enabled");
  
  } catch(e) {
    console.error(e);
  }
}

async function createGestureRecognizer() {
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
async function enableWebcam() {}
async function predictWebcam() {}

async function map3DModel() {}