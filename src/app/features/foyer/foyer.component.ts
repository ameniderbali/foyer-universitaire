import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FoyerModel, IFoyerList } from '../../core/models/foyer-model';
import { FoyerService } from '../../core/services/foyer-service.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: "app-foyer",
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./foyer.component.html",
  styleUrl: "./foyer.component.css",
})
export class Foyer {
  isPanelOpen = false;
  foyerModelData: FoyerModel = new FoyerModel();
  foyerList: IFoyerList[] = [];

  foyerForm: FormGroup = new FormGroup({
    idFoyer: new FormControl({ value: "0", disabled: true }),
    nomFoyer: new FormControl("", [Validators.required, Validators.minLength(3)]),
    capaciteFoyer: new FormControl("", [Validators.required]),
  });
  actionMode: string = "new";

  constructor(private foyerService: FoyerService, private toastr: ToastrService) {
    this.getAllFoyers();
  }

  getAllFoyers() {
    this.foyerService.getAllFoyers().subscribe(
      (result: any) => {
        this.foyerList = result;
      },
      (error) => {
        alert("There was an error loading the foyer data.");
      }
    );
  }

  openPanel() { this.isPanelOpen = true; }
  closePanel() { this.isPanelOpen = false; }

  get idFoyer() { return this.foyerForm.get("idFoyer"); }
  get nomFoyer() { return this.foyerForm.get("nomFoyer"); }
  get capaciteFoyer() { return this.foyerForm.get("capaciteFoyer"); }

  onButtonEdit(data: any) {
    this.foyerModelData = data;
    this.setActionMode("update");
    this.fillForm();
    this.openPanel();
  }

  onCreateNew() {
    this.foyerModelData = new FoyerModel();
    this.setActionMode("new");
    this.fillForm();
    this.openPanel();
  }

  fillForm() {
    this.foyerForm.setValue({
      idFoyer: this.foyerModelData.idFoyer,
      nomFoyer: this.foyerModelData.nomFoyer,
      capaciteFoyer: this.foyerModelData.capaciteFoyer,
    });
  }

  onButtonDelete(idFoyer: number) {
    const isDelete = confirm("Are you sure want to delete?");
    if (isDelete) {
      this.foyerService.onDeleteFoyer(idFoyer).subscribe(
        (result: any) => {
          this.closePanel();
          this.getAllFoyers();
          this.toastr.success("Foyer supprimé avec succès!");
        },
        (error) => {
          this.toastr.error("Erreur lors de la suppression du foyer.");
        }
      );
    }
  }

  onSave(action: string) {
     console.log("onSave called", action, this.foyerForm.getRawValue());
  this.foyerModelData = {
    ...this.foyerModelData,
    ...this.foyerForm.getRawValue(),
  };
  
  if (action == "new") {
    const { idFoyer, blocs, ...newFoyer } = this.foyerModelData;
    this.foyerService.onSaveNewFoyer(newFoyer).subscribe(
      (result: any) => {
        this.closePanel();
        this.getAllFoyers();
        this.toastr.success("Foyer créé avec succès!");
      },
      (error) => {
        this.toastr.error("Erreur lors de la création du foyer.");
      }
    );
  } else if (action == "update") {
    this.foyerService.onUpdateFoyer(this.foyerModelData).subscribe(
      (result: any) => {
        this.closePanel();
        this.getAllFoyers();
        this.toastr.success("Foyer modifié avec succès!");
      },
      (error) => {
        this.toastr.error("Erreur lors de la modification du foyer.");
      }
    );
  }
}

  setActionMode(actionMode: string) {
    this.actionMode = actionMode;
  }
}