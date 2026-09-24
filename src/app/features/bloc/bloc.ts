import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BlocModel, IBlocList } from '../../core/models/bloc-model';
import { BlocService } from '../../core/services/bloc-service';
import { ToastrService } from 'ngx-toastr'; 
@Component({
  selector: 'app-bloc',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './bloc.html',
  styleUrl: './bloc.scss',
})
export class Bloc {

	isPanelOpen = false;
	blocModelData: BlocModel = new BlocModel();
	blocList: IBlocList[] = [];

	blocForm: FormGroup = new FormGroup({
	  idBloc: new FormControl({value: "0", disabled: true}),	
	  nomBloc: new FormControl("", [Validators.required]),
	  capaciteBloc: new FormControl("", [Validators.required]),
	});
	actionMode: string = "new";

	constructor(private blocService: BlocService, private toastr: ToastrService) {
	  const isValid = this.blocForm.valid;
	  this.getAllBlocs();
	}


	getAllBlocs() {
	  this.blocService.getAllBlocs().subscribe(
	    (result: any) => {
	      this.blocList = result; // If successful, assign the data to blocList
	    },
	    (error) => {
	      alert("There was an error loading the bloc data."); // Set an error message if request fails
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

	get idBloc() {
	  return this.blocForm.get("idBloc");
	}

	get nomBloc() {
	  return this.blocForm.get("nomBloc");
	}

	get capaciteBloc() {
	  return this.blocForm.get("capaciteBloc");
	}



	onButtonEdit(data: any) {
	  this.blocModelData = data;
	  this.setActionMode("update");
	  this.fillForm();
	  this.openPanel();
	}

	onCreateNew() {
	  this.blocModelData = new BlocModel();
	  this.setActionMode("new");
	  this.fillForm();
	  this.openPanel();
	}

	fillForm() {
		this.blocForm.setValue({
		  idBloc: this.blocModelData.idBloc, 
		  nomBloc: this.blocModelData.nomBloc,
		  capaciteBloc: this.blocModelData.capaciteBloc,
		});		
	} 

	onButtonDelete(idBloc: number) {
	  const isDelete = confirm("Are you sure want to delete?");
	console.log("isDelete : " + isDelete); 
	  if (isDelete == true) {
		console.log("isDelete IN : " + isDelete); 
	    this.blocService.onDeleteBloc(idBloc).subscribe(
	      (result: any) => {          
	        this.closePanel();
	        this.getAllBlocs();
	        this.toastr.success(
	          "Bloc Data has been deleted(" + result.data.idBloc + ")"
	        );
	      },
	      (error) => {
	        this.toastr.error("There was an error delete bloc data."); // Set an error message if request fails
	      }
	    );
	  }
	}

	onSave(action: string) {
	  this.blocModelData = {
	    ...this.blocModelData,
	    ...this.blocForm.getRawValue(),
	  };
	  if (action == "new") {
	    const { idBloc, ...newBloc } = this.blocModelData;
	    this.blocService.onSaveNewBloc(newBloc).subscribe(
	      (result: any) => {
	        this.blocModelData = result?.data ?? result;
	        this.closePanel();
	        this.getAllBlocs();
	        this.toastr.success(
	          "Bloc créé avec succès!"
	        );
	      },
	      (error) => {
	        this.toastr.error("There was an error create bloc data."); // Set an error message if request fails
	      }
	    );
	  } else if (action == "update") {
	    this.blocService.onUpdateBloc(this.blocModelData).subscribe(
	      (result: any) => {
	        this.blocModelData = result?.data ?? result;
	        this.closePanel();
	        this.getAllBlocs();
	        this.toastr.success(
	          "Bloc Data has been updated(" + result.data.nomBloc + ")"
	        );
	      },
	      (error) => {
	        this.toastr.error("There was an error update bloc data."); // Set an error message if request fails
	      }
	    );
	  }
	}

	setActionMode(actionMode: string) {
	  this.actionMode = actionMode;
	}
}
