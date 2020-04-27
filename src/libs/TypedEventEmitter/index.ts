import { Observable } from "rxjs";

export interface ITypedEventEmitter {
  emit: (type: string, payload: any) => void;
  removeListener: (event: any, handler: (payload: any) => void) => void;
  on: (event: string, handler: (payload: any) => void) => void;
  createObserverOn(type: any): Observable<any>;
}
