import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-registro-ok',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './registro-ok.component.html',
  styleUrl: './registro-ok.component.css'
})
export class RegistroOKComponent {
  constructor(private router:Router) {
    
  }
}
