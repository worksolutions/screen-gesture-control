import * as handtrack from "@tensorflow-models/handpose";
import { HandPose } from "@tensorflow-models/handpose";

import { HandEstimatorEvent, TypedEventEmitter } from "./eventEmitter";
import { understandGesture } from "./gestureUnderstanding";
import { V3 } from "../../types/math";

export class HandEstimator {
  private readonly video: HTMLVideoElement;
  private model: HandPose;
  private readonly eventEmitter: TypedEventEmitter;

  private readonly updateTime: number = 1000;

  constructor(video: HTMLVideoElement, options?: { updateTime: number }) {
    this.video = video;
    if (options) {
      options.updateTime = this.updateTime = options.updateTime;
    }
    this.eventEmitter = new TypedEventEmitter();
  }

  public async init() {
    this.model = await handtrack.load();
    this.eventEmitter.emit(HandEstimatorEvent.LOAD, null);
    setInterval(this.eventLoop, this.updateTime);
  }

  public getEventEmitter = () => this.eventEmitter;

  eventLoop = async () => {
    const [hand] = (await this.model.estimateHands(this.video)) as any;
    if (!hand) return;

    const gesture = understandGesture(hand.annotations);
    console.log("gesture", gesture);

    const indexFinger = hand.annotations.indexFinger as V3[];
    this.eventEmitter.emit(HandEstimatorEvent.UPDATE, {
      indexFingerPoint: indexFinger[3],
    });
  };
}
