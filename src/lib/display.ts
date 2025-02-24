import {
  GestureRecognizer,
  DrawingUtils,
  GestureRecognizerResult,
} from "@mediapipe/tasks-vision";

export const displayLandmarks = (
  canvasCtx: CanvasRenderingContext2D,
  results: GestureRecognizerResult
) => {
  let pencil: DrawingUtils = new DrawingUtils(canvasCtx);

  // draw landmarks
  if (!results?.landmarks) return;

  results.landmarks.forEach((landmarks, index) => {
    pencil.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
      color: (index === 0) ? "red" : "blue",
      lineWidth: 5,
    });
    pencil.drawLandmarks(landmarks, {
      color: (index === 0) ? "red" : "blue",
      fillColor: "green",
      radius: 4,
    });
  });
};
