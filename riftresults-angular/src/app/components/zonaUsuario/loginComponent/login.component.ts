import { Component, Inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RestnodeService } from '../../../servicios/restnode.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IRestMessage } from '../../../models/restmessage';
import { TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservice';
import { IStorageService } from '../../../models/interfacestorage';
import { loginEvent } from '../../../app.component';

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
              @Inject(TOKEN_SERVICIOSTORAGE) private storageSvc:IStorageService ){
                this.formLogin = new FormGroup({
                  email: new FormControl('', [ Validators.required, Validators.email ] ),
                  password: new FormControl('',[ Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$')] )
                });
              }

    async Login(){
      const formData = this.formLogin.value;
      console.log('DATOS RECIBIDOS PARA LOGIN...', formData);
      const _resp:IRestMessage = await this.restNodeSvc.LoginCliente(formData);
      console.log('_resp...', _resp);
      if(_resp.codigo===0){
        this.storageSvc.AlmacenarDatosCliente(_resp.datoscliente!);
        //console.log('Token sesion...', _resp.tokensesion);
        this.storageSvc.AlmacenarJWT(_resp.tokensesion!);
        //console.log('datos recuperados...', this.storageSvc.RecuperarDatosCliente());
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
