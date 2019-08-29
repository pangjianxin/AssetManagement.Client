import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  action = '确定';
  constructor(private snackbar: MatSnackBar) { }
  success(message: string, action: string = this.action) {
    this.snackbar.open(message, action, {
      duration: 3000,
      panelClass: ['alertSuccess']
    });
  }
  failure(message: string, action: string = this.action) {
    this.snackbar.open(message, action, {
      duration: 3000,
      panelClass: ['alertFailure']
    });
  }
  warn(message: string, action: string = this.action) {
    this.snackbar.open(message, action, {
      duration: 3000,
      panelClass: ['alertWarn']
    });
  }
}
