import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ChambreModel, IChambreList } from '../../core/models/chambre-model';
import { ChambreService } from '../../core/services/chambre-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-chambre",
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./chambre.html",
  styleUrl: "./chambre.css",
})
export class Chambre {
  isPanelOpen = false;
  chambreModelData: ChambreModel = new ChambreModel();
  chambreList: IChambreList[] = [];
  
  chambreForm: FormGroup = new FormGroup({
	idChambre: new FormControl({value: "0", disabled: true}),	
    numeroChambre: new FormControl("", [Validators.required]),
    typeC: new FormControl("", [Validators.required, Validators.minLength(3)]),
  });
  actionMode: string = "new";

  constructor(private chambreService: ChambreService, private toastr: ToastrService) {
    const isValid = this.chambreForm.valid;
    this.getAllChambres();
  }


  getAllChambres() {
    this.chambreService.getAllChambres().subscribe(
      (result: any) => {
        const chambres = Array.isArray(result)
          ? result
          : result?.data ?? result?.content ?? result?.chambres ?? [];

        this.chambreList = chambres.map((chambre: any) => ({
          idChambre: chambre.idChambre ?? chambre.id_chambre,
          numeroChambre: chambre.numeroChambre ?? chambre.numero_chambre,
          typeC: chambre.typeC ?? chambre.typec ?? chambre.type_c,
        }));
      },
      (error) => {
        console.error("Erreur lors du chargement des chambres:", error);
        this.chambreList = [];
        this.toastr.error("Impossible de charger les chambres. Vérifiez que l'API est démarrée.");
      }
    );
  }
  openPanel() {
    this.isPanelOpen = true;
  }

  closePanel() {
    this.isPanelOpen = false;
  }

  numberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // Allow empty value to let 'required' validator handle it
    if (value === null || value === "") return null;

    const number = Number(value);

    if (isNaN(number)) {
      return { notANumber: true };
    }

    if (!Number.isInteger(number)) {
      return { notInteger: true };
    }

    if (number <= 0) {
      return { notPositive: true };
    }

    return null; // Valid
  }

  get idChambre() {
    return this.chambreForm.get("idChambre");
  }

  get numeroChambre() {
    return this.chambreForm.get("numeroChambre");
  }

  get typeC() {
    return this.chambreForm.get("typeC");
  }



  onButtonEdit(data: any) {
    this.chambreModelData = data;
    this.setActionMode("update");
    this.fillForm();
    this.openPanel();
  }

  onCreateNew() {
    this.chambreModelData = new ChambreModel();
    this.setActionMode("new");
    this.fillForm();
    this.openPanel();
  }

  fillForm() {
		this.chambreForm.setValue({
		  idChambre: this.chambreModelData.idChambre, 
		  numeroChambre: this.chambreModelData.numeroChambre,
		  typeC: this.chambreModelData.typeC,
		});		
	} 

  onButtonDelete(idChambre: number) {
    const isDelete = confirm("Are you sure want to delete?");
	console.log("isDelete : " + isDelete); 
    if (isDelete == true) {
		console.log("isDelete IN : " + isDelete); 
      this.chambreService.onDeleteChambre(idChambre).subscribe(
        (result: any) => {          
          this.closePanel();
          this.getAllChambres();
          this.toastr.success(
            "Chambre Data has been deleted(" + result.data.idChambre + ")"
          );
        },
        (error) => {
          this.toastr.error("There was an error delete chambre data."); // Set an error message if request fails
        }
      );
    }
  }

  onSave(action: string) {
    this.chambreModelData = {
      ...this.chambreModelData,
      ...this.chambreForm.getRawValue(),
    };
    if (action == "new") {
      const { idChambre, ...newChambre } = this.chambreModelData;
      this.chambreService.onSaveNewChambre(newChambre).subscribe(
        (result: any) => {
          this.chambreModelData = result?.data ?? result;
          this.closePanel();
          this.getAllChambres();
          this.toastr.success(
            "Chambre créée avec succès!"
          );
        },
        (error) => {
          this.toastr.error("There was an error create chambre data."); // Set an error message if request fails
        }
      );
    } else if (action == "update") {
      this.chambreService.onUpdateChambre(this.chambreModelData).subscribe(
        (result: any) => {
          this.chambreModelData = result?.data ?? result;
          this.closePanel();
          this.getAllChambres();
          this.toastr.success(
            "Chambre Data has been updated(" + result.data.numeroChambre + ")"
          );
        },
        (error) => {
          this.toastr.error("There was an error update chambre data."); // Set an error message if request fails
        }
      );
    }
  }

  setActionMode(actionMode: string) {
    this.actionMode = actionMode;
  }
}
