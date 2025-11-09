import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: "app-layout",
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterModule],
  templateUrl: "./layout.html",
  styleUrl: "./layout.css",
})
export class Layout {}
