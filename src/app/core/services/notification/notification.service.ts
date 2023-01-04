import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private snackbarMessageSubject$: Subject<string>;

  constructor() {
    this.snackbarMessageSubject$ = new Subject<string>();
  }

  getSnackBarMessageSubject(): Subject<string>{
    return this.snackbarMessageSubject$;
  }

  updateSnackBarMessageSubject(data: string): void {
    this.snackbarMessageSubject$.next(data);
  }
}
