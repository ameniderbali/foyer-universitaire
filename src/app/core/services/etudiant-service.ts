import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Etudiant } from '../models/etudiant-model';

@Injectable({ providedIn: 'root' })
export class EtudiantService {
  private readonly apiUrl = 'http://localhost:8089/foyer-universitaire/etudiant';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(this.apiUrl);
  }

  create(etudiant: Omit<Etudiant, 'idEtudiant'>): Observable<Etudiant> {
    return this.http.post<Etudiant>(this.apiUrl, etudiant);
  }

  update(etudiant: Etudiant): Observable<Etudiant> {
    return this.http.put<Etudiant>(this.apiUrl, etudiant);
  }
}
