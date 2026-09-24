import { Etudiant } from './etudiant-model';

export interface Reservation {
  idReservation: string;
  anneeUniversitaire: string;
  estValide: boolean;
  etudiants: Etudiant[];
}
