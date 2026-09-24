import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class BlocService {
  apiUrl: string = "http://localhost:8089/foyer-universitaire/bloc";
  constructor(private http: HttpClient) {}

  getAllBlocs(): Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(
      catchError((error) => {
        console.error('Error fetching blocs:', error);
        // Return an empty array in case of error
        return of([]);  // Return an empty array (or fallback) on error
      })
    );
  }	
  
  onSaveNewBloc(obj: any) {
    return this.http.post(`${this.apiUrl}`, obj);
  }

  onUpdateBloc(obj: any) {
    return this.http.put(`${this.apiUrl}`, obj);
  }

  onDeleteBloc(obj:any) {
    return this.http.delete(`${this.apiUrl}/${obj}`);
  }


}
