import { FaceEstimator, FaceEstimatorEvent } from "./libs/estimateFace";
import {
  HandEstimator,
  HandEstimatorEvent,
} from "./libs/estimatteHand";

async function runFaceWebInterface (video: HTMLVideoElement) {
  const estimator = new FaceEstimator(video, { updateTime: 1000 });
  await estimator.init();

  estimator.getEventEmitter().on(FaceEstimatorEvent.UPDATE, payload => {
    if (payload.headPitch < -15 || payload.headPitch > 15) {
      document.body.scrollTo({
        behavior: "smooth",
        top: document.body.scrollTop + payload.headPitch * 10
      });
    }
  });
}

async function runHandWebInterface (video: HTMLVideoElement) {
  const estimator = new HandEstimator(video, { updateTime: 100 });
  await estimator.init();

  const fakeCursor = document.querySelector("#fakeCursor") as any;

  estimator
    .getEventEmitter()
    .createObserver(HandEstimatorEvent.UPDATE)
    .subscribe(payload => {
      console.debug(...payload.indexFingerPoint);

      const widthCoef = window.outerWidth / video.videoWidth;
      const heightCoef = window.outerHeight / video.videoHeight;

      fakeCursor.style.left = window.outerWidth - payload.indexFingerPoint[0] * widthCoef;
      fakeCursor.style.top = payload.indexFingerPoint[1] * heightCoef;
    }
  )
}

document.addEventListener("DOMContentLoaded", async () => {

  const video = document.querySelector("video");
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return;
  }

  video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
  await video.play();

  runFaceWebInterface(video);
  runHandWebInterface(video);
});



