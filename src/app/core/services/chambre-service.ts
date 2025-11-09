import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class ChambreService {
  apiUrl: string = "http://localhost:8089/foyer-universitaire/chambre";
  constructor(private http: HttpClient) {}

  getAllChambres(): Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(
      catchError((error) => {
        console.error('Error fetching chambres:', error);
        // Return an empty array in case of error
        return of([]);  // Return an empty array (or fallback) on error
      })
    );
  }	
  
  onSaveNewChambre(obj: any) {
    return this.http.post(`${this.apiUrl}`, obj);
  }

  onUpdateChambre(obj: any) {
    return this.http.put(`${this.apiUrl}`, obj);
  }

  onDeleteChambre(obj:any) {
    return this.http.delete(`${this.apiUrl}/${obj}`);
  }

}
