import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { RestnodeService } from '../../../servicios/restnode.service';

@Component({
  selector: 'app-cuenta-activa',
  standalone: true,
  imports: [
            RouterOutlet,
            RouterLink,
           ],
  templateUrl: './cuenta-activa.component.html',
  styleUrl: './cuenta-activa.component.css'
})
export class CuentaActivaComponent implements OnInit {
  constructor(private route: ActivatedRoute, private restSvc: RestnodeService,
              private router: Router
  ) {
    
  }
  
  ngOnInit(): void {
    this.activarCuenta();
  }

  async activarCuenta() {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      try {
        const response = await this.restSvc.ActivarCuenta(token);
        console.log('Respuesta del servidor:', response);
      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
      }
    } else {
      console.error('No se encontró el token en la URL');
    }
  }
}
