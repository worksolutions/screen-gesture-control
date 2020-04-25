import * as facemesh from "@tensorflow-models/facemesh";
import { FaceMesh } from "@tensorflow-models/facemesh";
import { EventEmitter } from "events";
import { ITypedEventEmitter } from "./TypedEventEmitter";
import { Observable } from "rxjs";
import { HandEstimatorEvent, HandEstimatorEventsMap } from "./estimatteHand";

export class FaceEstimator {
  private video: HTMLVideoElement;
  private model: FaceMesh;
  private eventEmitter: TypedEventEmitter;

  private updateTime: number = 1000;

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

export enum FaceEstimatorEvent {
  LOAD = "load",
  UPDATE = "update",
}

export interface IUpdateInfo {
  headPitch: number;
}

export interface FaceEstimatorEventsMap {
  [FaceEstimatorEvent.LOAD]: any;
  [FaceEstimatorEvent.UPDATE]: IUpdateInfo;
}

export class TypedEventEmitter implements ITypedEventEmitter {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(0);
  }

  emit = <TYPE extends FaceEstimatorEvent>(
    type: TYPE,
    payload: FaceEstimatorEventsMap[TYPE]
  ) => {
    this.eventEmitter.emit(type, payload);
  };

  removeListener<TYPE extends FaceEstimatorEvent>(
    event: TYPE,
    handler: (payload: FaceEstimatorEventsMap[TYPE]) => void
  ) {
    this.eventEmitter.removeListener(event, handler);
  }

  public on<TYPE extends FaceEstimatorEvent>(
    type: TYPE,
    handler: (payload: FaceEstimatorEventsMap[TYPE]) => void
  ) {
    this.eventEmitter.addListener(type, handler);
  }

  public createObserver<TYPE extends FaceEstimatorEvent>(
    type: TYPE
  ): Observable<FaceEstimatorEventsMap[TYPE]> {
    return new Observable<FaceEstimatorEventsMap[TYPE]>((observer) =>
      this.on(type, (data) => observer.next(data))
    );
  }
}
