import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Universite } from '../../core/models/universite-model';
import { UniversiteService } from '../../core/services/universite-service';

@Component({
  selector: 'app-universite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page">
      <div class="heading"><h2>Universités</h2><button (click)="startCreate()">Ajouter</button></div>
      <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
      <table *ngIf="universites.length" class="table table-bordered">
        <thead><tr><th>ID</th><th>Nom</th><th>Adresse</th><th>Actions</th></tr></thead>
        <tbody><tr *ngFor="let universite of universites">
          <td>{{ universite.idUniversite }}</td><td>{{ universite.nomUniversite }}</td><td>{{ universite.adresse }}</td>
          <td><button (click)="startEdit(universite)">Modifier</button></td>
        </tr></tbody>
      </table>
      <p *ngIf="!loading && !universites.length">Aucune université retournée par l'API.</p>
      <form *ngIf="formVisible" [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <label>Nom <input formControlName="nomUniversite"></label>
        <label>Adresse <input formControlName="adresse"></label>
        <div><button type="submit" [disabled]="form.invalid">{{ editing ? 'Modifier' : 'Ajouter' }}</button><button type="button" (click)="formVisible = false">Annuler</button></div>
      </form>
    </section>
  `,
  styleUrl: './universite.css',
})
export class UniversiteComponent {
  universites: Universite[] = [];
  formVisible = false;
  editing = false;
  loading = false;
  errorMessage = '';
  form = new FormGroup({ idUniversite: new FormControl(0), nomUniversite: new FormControl('', Validators.required), adresse: new FormControl('', Validators.required) });

  constructor(private readonly service: UniversiteService, private readonly toastr: ToastrService) { this.load(); }
  load() { this.loading = true; this.service.getAll().subscribe({ next: value => { this.universites = value; this.loading = false; }, error: error => this.handleError(error) }); }
  startCreate() { this.editing = false; this.form.reset({ idUniversite: 0, nomUniversite: '', adresse: '' }); this.formVisible = true; }
  startEdit(value: Universite) { this.editing = true; this.form.patchValue(value); this.formVisible = true; }
  save() {
    const value = this.form.getRawValue();
    const request = this.editing
      ? this.service.update({ idUniversite: value.idUniversite!, nomUniversite: value.nomUniversite!, adresse: value.adresse!, foyer: null })
      : this.service.create({ nomUniversite: value.nomUniversite!, adresse: value.adresse!, foyer: null });
    request.subscribe({ next: () => { this.formVisible = false; this.toastr.success('Université enregistrée.'); this.load(); }, error: error => this.handleError(error) });
  }
  private handleError(error: unknown) { this.loading = false; console.error(error); this.errorMessage = 'Impossible de communiquer avec l\'API université.'; this.toastr.error(this.errorMessage); }
}
