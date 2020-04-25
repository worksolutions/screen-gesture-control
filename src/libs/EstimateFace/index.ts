import * as facemesh from "@tensorflow-models/facemesh";
import { FaceMesh } from "@tensorflow-models/facemesh";

import { FaceEstimatorEvent, TypedEventEmitter } from "./eventEmitter";

export class FaceEstimator {
  private readonly video: HTMLVideoElement;
  private model: FaceMesh;
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
    this.model = await facemesh.load();
    this.eventEmitter.emit(FaceEstimatorEvent.LOAD, null);
    setInterval(this.eventLoop, this.updateTime);
  }

  public getEventEmitter = () => this.eventEmitter;

  eventLoop = async () => {
    const faces = (await this.model.estimateFaces(this.video)) as any;

    const topMesh = faces[0].mesh[10];
    const bottomMesh = faces[0].mesh[6];
    const headPitch = bottomMesh[2] - topMesh[2];

    this.eventEmitter.emit(FaceEstimatorEvent.UPDATE, {
      headPitch,
    });
  };
}
