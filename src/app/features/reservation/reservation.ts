import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Etudiant } from '../../core/models/etudiant-model';
import { Reservation } from '../../core/models/reservation-model';
import { EtudiantService } from '../../core/services/etudiant-service';
import { ReservationService } from '../../core/services/reservation-service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page">
      <div class="heading"><h2>Réservations</h2><button (click)="startCreate()">Ajouter</button></div>
      <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
      <table *ngIf="reservations.length" class="table table-bordered">
        <thead><tr><th>ID</th><th>Année universitaire</th><th>Valide</th><th>Etudiants</th><th>Actions</th></tr></thead>
        <tbody><tr *ngFor="let reservation of reservations">
          <td>{{ reservation.idReservation }}</td><td>{{ reservation.anneeUniversitaire | date:'short' }}</td><td>{{ reservation.estValide ? 'Oui' : 'Non' }}</td>
          <td>{{ reservation.etudiants.length }}</td><td><button (click)="startEdit(reservation)">Modifier</button></td>
        </tr></tbody>
      </table>
      <p *ngIf="!loading && !reservations.length">Aucune réservation retournée par l'API.</p>
      <form *ngIf="formVisible" [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <label>Année universitaire <input type="datetime-local" formControlName="anneeUniversitaire"></label>
        <label><input type="checkbox" formControlName="estValide"> Valide</label>
        <fieldset><legend>Etudiants</legend><label *ngFor="let etudiant of etudiants"><input type="checkbox" [checked]="selectedIds.has(etudiant.idEtudiant)" (change)="toggleStudent(etudiant)">{{ etudiant.nomEtudiant }} {{ etudiant.prenomEtudiant }}</label><p *ngIf="!etudiants.length">Aucun étudiant disponible.</p></fieldset>
        <div><button type="submit" [disabled]="form.invalid">{{ editing ? 'Modifier' : 'Ajouter' }}</button><button type="button" (click)="formVisible = false">Annuler</button></div>
      </form>
    </section>
  `,
  styleUrl: './reservation.css',
})
export class ReservationComponent {
  reservations: Reservation[] = [];
  etudiants: Etudiant[] = [];
  selectedIds = new Set<number>();
  formVisible = false;
  editing = false;
  loading = false;
  errorMessage = '';
  form = new FormGroup({ idReservation: new FormControl(''), anneeUniversitaire: new FormControl('', Validators.required), estValide: new FormControl(false) });

  constructor(private readonly service: ReservationService, private readonly etudiantService: EtudiantService, private readonly toastr: ToastrService) { this.load(); this.etudiantService.getAll().subscribe({ next: value => this.etudiants = value, error: error => this.handleError(error) }); }
  load() { this.loading = true; this.service.getAll().subscribe({ next: value => { this.reservations = value; this.loading = false; }, error: error => this.handleError(error) }); }
  startCreate() { this.editing = false; this.selectedIds.clear(); this.form.reset({ idReservation: '', anneeUniversitaire: '', estValide: false }); this.formVisible = true; }
  startEdit(value: Reservation) { this.editing = true; this.selectedIds = new Set(value.etudiants.map(etudiant => etudiant.idEtudiant)); this.form.patchValue({ ...value, anneeUniversitaire: value.anneeUniversitaire?.slice(0, 16) }); this.formVisible = true; }
  toggleStudent(etudiant: Etudiant) { this.selectedIds.has(etudiant.idEtudiant) ? this.selectedIds.delete(etudiant.idEtudiant) : this.selectedIds.add(etudiant.idEtudiant); }
  save() {
    const value = this.form.getRawValue();
    const etudiants = this.etudiants.filter(etudiant => this.selectedIds.has(etudiant.idEtudiant));
    const payload = { anneeUniversitaire: value.anneeUniversitaire!, estValide: value.estValide!, etudiants };
    const request = this.editing
      ? this.service.update({ idReservation: value.idReservation!, ...payload })
      : this.service.create({ idReservation: crypto.randomUUID(), ...payload });
    request.subscribe({ next: () => { this.formVisible = false; this.toastr.success('Réservation enregistrée.'); this.load(); }, error: error => this.handleError(error) });
  }
  private handleError(error: unknown) { this.loading = false; console.error(error); this.errorMessage = 'Impossible de communiquer avec l\'API réservation.'; this.toastr.error(this.errorMessage); }
}
