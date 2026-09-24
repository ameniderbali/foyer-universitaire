import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class FoyerService {
  apiUrl: string = "http://localhost:8089/foyer-universitaire/foyer";
  
  constructor(private http: HttpClient) {}

  getAllFoyers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(
      catchError((error) => {
        console.error('Error fetching foyers:', error);
        return of([]);
      })
    );
  }

  onSaveNewFoyer(obj: any) {
    return this.http.post(`${this.apiUrl}`, obj);
  }

  onUpdateFoyer(obj: any) {
    return this.http.put(`${this.apiUrl}`, obj);
  }

  onDeleteFoyer(id: any) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}