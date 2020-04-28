import { filter, map } from "rxjs/operators";

import { FaceEstimator } from "./libs/EstimateFace";
import { FaceEstimatorEvent } from "./libs/EstimateFace/eventEmitter";
import { HandEstimator } from "./libs/EstimatteHand";
import { HandEstimatorEvent } from "./libs/EstimatteHand/eventEmitter";
import { HandCursor } from "./libs/EstimatteHand/features/handCursor";

import { interpolation2dPoints } from "./libs/math/extrapolation";

import { Position2D } from "./libs/types/math";

async function runFaceWebInterface(video: HTMLVideoElement) {
  const estimator = new FaceEstimator(video, { updateTime: 1000 });
  await estimator.init();

  estimator
    .getEventEmitter()
    .createObserverOn(FaceEstimatorEvent.UPDATE)
    .pipe(
      filter((payload) => payload.headPitch < -15 || payload.headPitch > 15)
    )
    .subscribe((payload) => {
      document.body.scrollTo({
        behavior: "smooth",
        top: document.body.scrollTop + payload.headPitch * 10,
      });
    });
}

async function runHandWebInterface(video: HTMLVideoElement) {
  const estimator = new HandEstimator(video, { updateTime: 100 });
  await estimator.init();

  const cursor = new HandCursor();
  const interpolation = interpolation2dPoints(5);

  estimator
    .getEventEmitter()
    .createObserverOn(HandEstimatorEvent.UPDATE)
    .pipe(
      map((handEvent) =>
        interpolation(
          handEvent.indexFingerPoint[0],
          handEvent.indexFingerPoint[1]
        )
      ),
      filter(Boolean),
      map((point: Position2D) => ({
        x: window.outerWidth - (window.outerWidth / video.videoWidth) * point.x,
        y: (window.outerHeight / video.videoHeight) * point.y,
      }))
    )
    .subscribe((point: Position2D) => cursor.move(point));

  const gestureContainer = document.querySelector("#gesture");
  estimator
    .getEventEmitter()
    .createObserverOn(HandEstimatorEvent.GESTURE_UPDATE)
    .subscribe((gesture) => {
      gestureContainer.innerHTML = gesture.gestureType;
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  const video = document.querySelector("video");
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return;
  }
  video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
  await video.play();

  runFaceWebInterface(video);
  runHandWebInterface(video);
});
