import * as handtrack from "@tensorflow-models/handpose";
import { HandPose } from "@tensorflow-models/handpose";
import { EventEmitter } from "events";
import { ITypedEventEmitter } from "./TypedEventEmitter";
import { Observable } from "rxjs";

type V3 = [number, number, number];

export class HandEstimator {
  private video: HTMLVideoElement;
  private model: HandPose;
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
    this.model = await handtrack.load();
    this.eventEmitter.emit(HandEstimatorEvent.LOAD, null);
    setInterval(this.eventLoop, this.updateTime);
  }

  public getEventEmitter = () => this.eventEmitter;

  eventLoop = async () => {
    const [hand] = (await this.model.estimateHands(this.video)) as any;

    if (!hand) return;
    const indexFinger = hand.annotations.indexFinger as V3[];

    // console.log(indexFinger);
    this.eventEmitter.emit(HandEstimatorEvent.UPDATE, {
      indexFingerPoint: indexFinger[3],
    });
  };
}

export enum HandEstimatorEvent {
  LOAD = "load",
  UPDATE = "update",
}

export interface IUpdateInfo {
  headPitch: number;
}

export interface HandEstimatorEventsMap {
  [HandEstimatorEvent.LOAD]: any;
  [HandEstimatorEvent.UPDATE]: {
    indexFingerPoint: V3;
  };
}

export class TypedEventEmitter implements ITypedEventEmitter {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(0);
  }

  emit = <TYPE extends HandEstimatorEvent>(
    type: TYPE,
    payload: HandEstimatorEventsMap[TYPE]
  ) => {
    this.eventEmitter.emit(type, payload);
  };

  removeListener<TYPE extends HandEstimatorEvent>(
    event: TYPE,
    handler: (payload: HandEstimatorEventsMap[TYPE]) => void
  ) {
    this.eventEmitter.removeListener(event, handler);
  }

  public on<TYPE extends HandEstimatorEvent>(
    type: TYPE,
    handler: (payload: HandEstimatorEventsMap[TYPE]) => void
  ) {
    this.eventEmitter.addListener(type, handler);
  }

  public createObserver<TYPE extends HandEstimatorEvent>(
    type: TYPE
  ): Observable<HandEstimatorEventsMap[TYPE]> {
    const that = this;
    return new Observable<HandEstimatorEventsMap[TYPE]>((observer) => {
      this.on(type, (data) => observer.next(data));
    });
  }
}
