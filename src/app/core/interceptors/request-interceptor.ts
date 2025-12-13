import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { catchError, map, of, throwError } from "rxjs";

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(event => event),
    catchError((err: HttpErrorResponse) => {
      switch (err.status) {
        case 404:
          return throwError(() => err.message)
        default:
          break;
      }

      return throwError(() => err)
    })
  );
}