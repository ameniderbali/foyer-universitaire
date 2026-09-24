import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Etudiant } from '../../core/models/etudiant-model';
import { EtudiantService } from '../../core/services/etudiant-service';

@Component({
  selector: 'app-etudiant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page">
      <div class="heading"><h2>Etudiants</h2><button (click)="startCreate()">Ajouter</button></div>
      <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
      <table *ngIf="etudiants.length" class="table table-bordered">
        <thead><tr><th>ID</th><th>Nom</th><th>Prénom</th><th>CIN</th><th>Ecole</th><th>Date de naissance</th><th>Actions</th></tr></thead>
        <tbody><tr *ngFor="let etudiant of etudiants">
          <td>{{ etudiant.idEtudiant }}</td><td>{{ etudiant.nomEtudiant }}</td><td>{{ etudiant.prenomEtudiant }}</td>
          <td>{{ etudiant.cinEtudiant }}</td><td>{{ etudiant.ecole }}</td><td>{{ etudiant.dateNaissance | date:'shortDate' }}</td>
          <td><button (click)="startEdit(etudiant)">Modifier</button></td>
        </tr></tbody>
      </table>
      <p *ngIf="!loading && !etudiants.length">Aucun étudiant retourné par l'API.</p>
      <form *ngIf="formVisible" [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <label>Nom <input formControlName="nomEtudiant"></label>
        <label>Prénom <input formControlName="prenomEtudiant"></label>
        <label>CIN <input type="number" formControlName="cinEtudiant"></label>
        <label>Ecole <input formControlName="ecole"></label>
        <label>Date de naissance <input type="datetime-local" formControlName="dateNaissance"></label>
        <div><button type="submit" [disabled]="form.invalid">{{ editing ? 'Modifier' : 'Ajouter' }}</button><button type="button" (click)="formVisible = false">Annuler</button></div>
      </form>
    </section>
  `,
  styleUrl: './etudiant.css',
})
export class EtudiantComponent {
  etudiants: Etudiant[] = [];
  formVisible = false;
  editing = false;
  loading = false;
  errorMessage = '';
  form = new FormGroup({
    idEtudiant: new FormControl(0),
    nomEtudiant: new FormControl('', Validators.required),
    prenomEtudiant: new FormControl('', Validators.required),
    cinEtudiant: new FormControl<number | null>(null, Validators.required),
    ecole: new FormControl('', Validators.required),
    dateNaissance: new FormControl('', Validators.required),
  });

  constructor(private readonly service: EtudiantService, private readonly toastr: ToastrService) { this.load(); }

  load() { this.loading = true; this.service.getAll().subscribe({ next: value => { this.etudiants = value; this.loading = false; }, error: error => this.handleError(error) }); }
  startCreate() { this.editing = false; this.form.reset({ idEtudiant: 0, nomEtudiant: '', prenomEtudiant: '', cinEtudiant: null, ecole: '', dateNaissance: '' }); this.formVisible = true; }
  startEdit(value: Etudiant) { this.editing = true; this.form.patchValue({ ...value, dateNaissance: value.dateNaissance?.slice(0, 16) }); this.formVisible = true; }
  save() {
    const value = this.form.getRawValue();
    const payload = { nomEtudiant: value.nomEtudiant!, prenomEtudiant: value.prenomEtudiant!, cinEtudiant: value.cinEtudiant!, ecole: value.ecole!, dateNaissance: value.dateNaissance! };
    const request = this.editing ? this.service.update({ idEtudiant: value.idEtudiant!, ...payload }) : this.service.create(payload);
    request.subscribe({ next: () => { this.formVisible = false; this.toastr.success('Etudiant enregistré.'); this.load(); }, error: error => this.handleError(error) });
  }
  private handleError(error: unknown) { this.loading = false; console.error(error); this.errorMessage = 'Impossible de communiquer avec l\'API étudiant.'; this.toastr.error(this.errorMessage); }
}
