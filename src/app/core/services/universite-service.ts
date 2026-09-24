import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Universite } from '../models/universite-model';

@Injectable({ providedIn: 'root' })
export class UniversiteService {
  private readonly apiUrl = 'http://localhost:8089/foyer-universitaire/universite';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Universite[]> {
    return this.http.get<Universite[]>(this.apiUrl);
  }

  create(universite: Omit<Universite, 'idUniversite'>): Observable<Universite> {
    return this.http.post<Universite>(this.apiUrl, universite);
  }

  update(universite: Universite): Observable<Universite> {
    return this.http.put<Universite>(this.apiUrl, universite);
  }
}
