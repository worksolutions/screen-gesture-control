import { EventEmitter } from "events";
import { Observable } from "rxjs";

import { ITypedEventEmitter } from "../TypedEventEmitter";
import { V3 } from "../types/math";

export enum HandEstimatorEvent {
  LOAD = "load",
  UPDATE = "update",
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

  public createObserverOn<TYPE extends HandEstimatorEvent>(
    type: TYPE
  ): Observable<HandEstimatorEventsMap[TYPE]> {
    return new Observable<HandEstimatorEventsMap[TYPE]>((observer) => {
      this.on(type, (data) => observer.next(data));
    });
  }
}
