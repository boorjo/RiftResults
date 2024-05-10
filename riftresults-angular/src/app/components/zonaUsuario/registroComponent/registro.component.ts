import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { compareToValidator } from '../../../validators/compareTo';
import { RestnodeService } from '../../../servicios/restnode.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { IRol } from '../../../models/rol';
import { IRestMessage } from '../../../models/restmessage';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  public formRegistro: FormGroup;
  public msgError: string="";
  public roles: IRol[] = [];

  constructor(private restNodeSvc:RestnodeService,
              private router:Router){
    this.formRegistro = new FormGroup({
      nombre: new FormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(50) ]  ),
      apellidos: new FormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(200) ]),
      login: new FormControl('',[ Validators.required,Validators.minLength(3),Validators.maxLength(25) ]),
      email: new FormControl('', [ Validators.required, Validators.email ] ), //<---- validador asincrono para comprobar q no exista ya el email
      password: new FormControl('',[ Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$')] ),
      repassword: new FormControl('',[ Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$'), compareToValidator('password') ]),
      telefono: new FormControl('', Validators.pattern('^[0-9]{9}$')),
      pais: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      rol: new FormControl('', [Validators.required, Validators.minLength(1)]),
      equipo: new FormControl('', Validators.maxLength(50))
      }
    );
  }

  async ngOnInit() {
    const _resp:IRestMessage = await this.restNodeSvc.RecuperarRoles();
    console.log('_resp...', _resp);
    if(_resp.codigo===0){
      this.roles = _resp.otrosdatos!;
    } 
    else {
      this.msgError="Error al recuperar roles."
    }
  }

  RegistrarUsuario(){
    const formData = this.formRegistro.value;
    console.log('DATOS RECIBIDOS PARA REGISTRO...', formData);
    this.restNodeSvc.RegistrarCliente(formData)
    .then(respuesta => {
      console.log('Respuesta del servidor..', respuesta);
      if (respuesta.codigo === 0) {
        // REGISTRO OK --> redirigir a la página de RegistroOK
        this.router.navigate(['/Cliente/Registrook']);
      } else if (respuesta.codigo === 1) {
        this.msgError=respuesta.mensaje;
        console.error('Error en el registro:', respuesta.mensaje);
        // Puedes mostrar este mensaje en un componente o utilizar una biblioteca de notificaciones
      } else if (respuesta.codigo === 2) {
        this.msgError=respuesta.mensaje;
      } else {
        // Manejar otros casos según sea necesario
        this.msgError=respuesta.mensaje;
        console.error('Respuesta inesperada del servidor:', respuesta);
      }
    })
    .catch(error => {
      // Manejar errores de la solicitud
      console.error('Error en la solicitud:', error);
      // Puedes mostrar un mensaje de error al usuario o realizar alguna otra acción
    });

  }
}


