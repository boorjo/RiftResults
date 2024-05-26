import { Component, Inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RestnodeService } from '../../../servicios/restnode.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IRestMessage } from '../../../models/restmessage';
import { TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservice';
import { IStorageService } from '../../../models/interfacestorage';
import { loginEvent } from '../../../app.component';
import { ApicampeonesService } from '../../../servicios/apicampeones.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public formLogin: FormGroup;
  public msgError:string="";

  constructor(private router:Router,
              private restNodeSvc:RestnodeService,
              @Inject(TOKEN_SERVICIOSTORAGE) private storageSvc:IStorageService,
              private campeonesSvc: ApicampeonesService){
                this.formLogin = new FormGroup({
                  email: new FormControl('', [ Validators.required, Validators.email ] ),
                  password: new FormControl('',[ Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$')] )
                });
              }

  async Login(){
    const formData = this.formLogin.value;
    console.log('DATOS RECIBIDOS PARA LOGIN...', formData);

    if (!this.formLogin.valid) {
      this.msgError = "Correo o contraseña incorrectos.";
      return;
      //comprobamos q sea valido, si no lo es no envíamos a server para evitar solicitudes innecesarias
      //  y mostramos msg error x defecto
    }

    const _resp:IRestMessage = await this.restNodeSvc.LoginCliente(formData);
    console.log('_resp...', _resp);
    if(_resp.codigo===0){
      //comprobamos si hay algún id guardado en campeones y/o equipos..
      if (_resp.datoscliente!.datosLol.equiposId && _resp.datoscliente!.datosLol.equiposId.length > 0) {
        const equipos = await this.restNodeSvc.GetEquiposPorId(_resp.datoscliente!.datosLol.equiposId);
        _resp.datoscliente!.datosLol.equipos = equipos.otrosdatos;
      }
      if (_resp.datoscliente!.datosLol.campeonesId && _resp.datoscliente!.datosLol.campeonesId.length > 0) {
        const campeones = await lastValueFrom(this.campeonesSvc.getCampeonesPorId(_resp.datoscliente!.datosLol.campeonesId));
        _resp.datoscliente!.datosLol.campeones = campeones;
      }

      this.storageSvc.AlmacenarDatosCliente(_resp.datoscliente!);
      this.storageSvc.AlmacenarJWT(_resp.tokensesion!);
      this.router.navigateByUrl('/Cliente/PanelCliente');
      loginEvent.next();
    }
    else if(_resp.codigo===2){
      this.msgError=_resp.mensaje;
    }else{
      this.msgError="Correo o contraseña incorrectos."
    }
  }

}
