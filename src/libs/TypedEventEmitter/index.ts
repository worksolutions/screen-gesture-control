import { EventEmitter } from "events";
import { HandEstimatorEvent, HandEstimatorEventsMap } from "../estimatteHand";
import { Observable } from "rxjs";
import { FaceEstimatorEvent, FaceEstimatorEventsMap } from "../estimateFace";

export interface ITypedEventEmitter {
  emit: (type: string, payload: any) => void;
  removeListener: (event: any, handler: (payload: any) => void) => void;
  on: (event: string, handler: (payload: any) => void) => void;
  createObserver (type: any): Observable<any>
}
