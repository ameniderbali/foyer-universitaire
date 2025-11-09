import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LoginService } from "../../core/services/login-service";

@Component({
  selector: "app-login",
  imports: [ReactiveFormsModule],
  templateUrl: "./login.html",
  styleUrl: "./login.css",
})
export class Login {
  userName: FormControl = new FormControl("", Validators.required);
  password: FormControl = new FormControl("", Validators.required);

  router = inject(Router);

  constructor(private toastr: ToastrService, private loginServ: LoginService) {}

  onLogin() {
    if (this.userName.invalid || this.password.invalid) {
      this.toastr.error("Username and Password are required!");
      return;
    }
    
    const apiLoginObj = {
      EmailId: this.userName.value,
      Password: this.password.value,
    };

	this.router.navigateByUrl("chambre");	
	
    /*this.loginServ.loginUser(apiLoginObj).subscribe(
      (result: any) => {
        localStorage.setItem("angularUser", result.data.userId);
        localStorage.setItem("angularToken", result.data.token);
        localStorage.setItem("angularTokenData", JSON.stringify(result.data));
        this.router.navigateByUrl("chambre");
      },
      (error) => {
        alert("Wrong credentials");
      }
    );*/
  }
}
