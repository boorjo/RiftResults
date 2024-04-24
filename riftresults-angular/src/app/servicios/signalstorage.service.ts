import { Injectable, signal } from '@angular/core';
import { IStorageService } from '../models/interfacestorage';
import { ICliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class SignalstorageService implements IStorageService {

  private clienteSignal=signal<ICliente|null>(null);
  private jwtSignal=signal<string>("");


  constructor() {}

  AlmacenarDatosCliente(datoscliente: ICliente | null): void {
    this.clienteSignal.update(()=> datoscliente);
  }

  AlmacenarJWT(jwt: string): void {
    this.jwtSignal.update(()=> jwt);
  }
  
  RecuperarDatosCliente(): ICliente | null  {
    return this.clienteSignal();
  }

  RecuperarJWT():string{
    return this.jwtSignal();
  }
}