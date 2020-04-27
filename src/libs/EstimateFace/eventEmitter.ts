import { Observable } from "rxjs";
import { EventEmitter } from "events";

import { ITypedEventEmitter } from "../TypedEventEmitter";

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

  public createObserverOn<TYPE extends FaceEstimatorEvent>(
    type: TYPE
  ): Observable<FaceEstimatorEventsMap[TYPE]> {
    return new Observable<FaceEstimatorEventsMap[TYPE]>((observer) =>
      this.on(type, (data) => observer.next(data))
    );
  }
}
