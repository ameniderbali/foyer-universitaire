import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class ChambreService {
  apiUrl: string = "http://localhost:8089/foyer-universitaire/chambre";
  constructor(private http: HttpClient) {}

  getAllChambres(): Observable<unknown> {
    return this.http.get(`${this.apiUrl}`);
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
