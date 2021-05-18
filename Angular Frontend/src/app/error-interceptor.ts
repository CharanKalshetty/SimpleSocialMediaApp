import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorIntercepptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req:HttpRequest<any>, next:HttpHandler) {

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse)=>{
        let errorMessage = "An unknown error occured"
        if (err.error.error.message) {
          errorMessage = err.error.error.message;
        }
        this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
        return throwError(err);
      })
    );
  }
}
