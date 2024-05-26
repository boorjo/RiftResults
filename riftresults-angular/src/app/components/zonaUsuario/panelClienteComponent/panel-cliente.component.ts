import { Component, Inject, OnInit, signal } from '@angular/core';
import { ICliente } from '../../../models/cliente';
import { IStorageService } from '../../../models/interfacestorage';
import { TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservice';
import { IRestMessage } from '../../../models/restmessage';
import { RestnodeService } from '../../../servicios/restnode.service';
import { IRol } from '../../../models/rol';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { compareToValidator } from '../../../validators/compareTo';
import { IEquipo } from '../../../models/equipo';
import { ICampeon } from '../../../models/campeon';

@Component({
  selector: 'app-panel-cliente',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './panel-cliente.component.html',
  styleUrl: './panel-cliente.component.css',
})
export class PanelClienteComponent implements OnInit {
  public datoscliente = signal<ICliente | null>(null);
  public roles: IRol[] = [];
  public rolJugador?: IRol;

  public msgUpdate : string = "";
  public colorMsg : string = "";
  public imgSrc : string = "";
  private _fichImagen!: File;

  public formPassword: FormGroup;

  constructor(
    @Inject(TOKEN_SERVICIOSTORAGE) private storageSvc: IStorageService,
    private restNodeSvc: RestnodeService,

  ) {
    this.formPassword = new FormGroup({
      passwordActual: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$')]),
      repassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$'), compareToValidator('password')])
    });
  }

  async ngOnInit() {
    this.datoscliente.update(() => this.storageSvc.RecuperarDatosCliente());
    //console.log('Datos cliente...', this.datoscliente());
    const _resp: IRestMessage = await this.restNodeSvc.RecuperarRoles();
    //console.log('_resp...', _resp);
    if (_resp.codigo === 0) {
      this.roles = _resp.otrosdatos!;
      this.rolJugador = this.roles.find(
        (rol) => rol.nombre === this.datoscliente()?.datosLol?.rol
      );
      this.imgSrc = this.datoscliente()?.cuenta.imagenAvatarBASE64 || "";
    } else {
      console.log('Error al recuperar roles...');
    }
  }

  public PrevisualizarImagen(inputimagen: any) {
    this._fichImagen = inputimagen.files[0] as File;
    let _lector: FileReader = new FileReader();
  
    _lector.addEventListener('load', ev => {
      console.log(ev.target!.result);
      this.imgSrc = ev.target!.result as string;
      if (this.datoscliente()) {
        this.datoscliente()!.cuenta!.imagenAvatarBASE64 = this.imgSrc;
      }
    });
    _lector.readAsDataURL(this._fichImagen);
  }

  public EliminarImg(){
    this.imgSrc = "";
    this.datoscliente()!.cuenta!.imagenAvatarBASE64="";
  }

  async ModificarPerfil(){
    const _resp = await this.restNodeSvc.ModificarPerfil(this.datoscliente()!);
    console.log('Modificando cliente...', this.datoscliente());
    console.log('Respuesta al modificar...', _resp);
    this.msgUpdate = _resp.mensaje;
    this.colorMsg = _resp.codigo === 0 ? 'text-success' : 'text-danger';
  }

  async CambiarPassword(){
    console.log('Cambiando password...');
    //primero hacer un login para comprobar q la password actual sea correcta, despues cambiarla
    const credenciales = {email: this.datoscliente()!.cuenta.email, password: this.formPassword.value.passwordActual};
    const _resp = await this.restNodeSvc.LoginCliente(credenciales);
    console.log('Respuesta al "login"...', _resp);
    if(_resp.codigo===0){
      //cambiar password
      const idcliente = this.datoscliente()!._id || "";
      const datos = {idcliente: idcliente, password: this.formPassword.value.password};
      const _resp2 = await this.restNodeSvc.CambiarPassword(datos);
      console.log('Respuesta al cambiar password...', _resp2);
      this.msgUpdate = _resp2.mensaje;
      this.colorMsg = _resp2.codigo === 0 ? 'text-success' : 'text-danger';
    }else{
      this.msgUpdate = _resp.mensaje;
      this.colorMsg = 'text-danger';
    }
  }

  eliminarCampeon(campeon: ICampeon): void {
    const indexCampeon = this.datoscliente()?.datosLol?.campeones?.findIndex(c => c.name === campeon.name);
    const indexCampeonId = this.datoscliente()?.datosLol?.campeonesId?.indexOf(campeon.name);
    if (indexCampeon !== undefined && indexCampeon > -1) {
      this.datoscliente()?.datosLol?.campeones?.splice(indexCampeon, 1);
    }
    if (indexCampeonId !== undefined && indexCampeonId > -1) {
      this.datoscliente()?.datosLol?.campeonesId?.splice(indexCampeonId, 1);
      console.log('datoscliente tras borrar campeon...', this.datoscliente());
    }
}

eliminarEquipo(equipo: IEquipo): void {
    const indexEquipo = this.datoscliente()?.datosLol?.equipos?.findIndex(e => e.TeamId === equipo.TeamId);
    const indexEquipoId = this.datoscliente()?.datosLol?.equiposId?.indexOf(equipo.TeamId);
    if (indexEquipo !== undefined && indexEquipo > -1) {
      this.datoscliente()?.datosLol?.equipos?.splice(indexEquipo, 1);
    }
    if (indexEquipoId !== undefined && indexEquipoId > -1) {
      this.datoscliente()?.datosLol?.equiposId?.splice(indexEquipoId, 1);
      console.log('datoscliente tras borrar equipo...', this.datoscliente());
    }
}


}
