import { Component, Inject, OnInit, signal } from '@angular/core';
import { ICliente } from '../../../models/cliente';
import { IStorageService } from '../../../models/interfacestorage';
import { TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservice';
import { IRestMessage } from '../../../models/restmessage';
import { RestnodeService } from '../../../servicios/restnode.service';
import { IRol } from '../../../models/rol';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-panel-cliente',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
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

  constructor(
    @Inject(TOKEN_SERVICIOSTORAGE) private storageSvc: IStorageService,
    private restNodeSvc: RestnodeService
  ) {}

  async ngOnInit() {
    this.datoscliente.update(() => this.storageSvc.RecuperarDatosCliente());
    console.log('Datos cliente...', this.datoscliente());
  
    const _resp: IRestMessage = await this.restNodeSvc.RecuperarRoles();
    console.log('_resp...', _resp);
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
  

}
