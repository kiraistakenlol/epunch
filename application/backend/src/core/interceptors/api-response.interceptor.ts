import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException, HttpStatus } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from 'e-punch-common'; // Assuming ApiResponse is exported from your common package

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T | null>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T | null>> {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();

        return next
            .handle()
            .pipe(
                map(data => {
                    // If controller explicitly returned an ApiResponse, pass it through
                    // This is useful if a controller needs to set a specific error within ApiResponse manually
                    if (data instanceof ApiResponse) {
                        // Ensure status is OK if it's a manual ApiResponse that might not have set it
                        // However, if data.data is null and data.error is set, it might be an error response from controller
                        // For simplicity now, we assume if it's ApiResponse, it's shaped correctly.
                        // Consider if status should be set based on data.error presence if that pattern is used.
                        if (response.statusCode === undefined || response.statusCode === 0 || response.statusCode === 204) {
                             response.status(HttpStatus.OK);
                        }
                        return data as ApiResponse<T | null>; 
                    }

                    // For any other data, wrap it in ApiResponse
                    // NestJS default status for successful GET/POST/PUT is 200/201. We ensure OK here.
                    // If the controller set a specific success status (e.g. 201 Created), respect it.
                    if (response.statusCode < 200 || response.statusCode >= 300) {
                        response.status(HttpStatus.OK);
                    }
                    return new ApiResponse<T>(data); // data will be T, error will be null by constructor default
                }),
                catchError(error => {
                    if (error instanceof NotFoundException) {
                        response.status(HttpStatus.OK);
                        return of(new ApiResponse<T | null>(null)); // Data is null for NotFound
                    }
                    // For other errors, re-throw to be handled by GlobalHttpExceptionFilter
                    // The GlobalHttpExceptionFilter will set the appropriate HTTP status code (4xx, 5xx)
                    // and potentially a different response body structure for errors.
                    throw error;
                })
            );
    }
} 