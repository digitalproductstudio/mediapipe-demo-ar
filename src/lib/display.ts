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
      color: (index === 0) ? "#00FF00" : "#00FFFF",
      lineWidth: 5,
    });
    pencil.drawLandmarks(landmarks, {
      color: (index === 0) ? "#FF0000" : "#FFFF00",
      fillColor: "green",
      radius: 4,
    });
  });
};
