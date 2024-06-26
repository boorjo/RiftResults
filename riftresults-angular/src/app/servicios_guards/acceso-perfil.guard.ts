import { Inject, Injectable, signal } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TOKEN_SERVICIOSTORAGE } from '../servicios/injectiontokenstorageservice';
import { IStorageService } from '../models/interfacestorage';
import { ICliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class accesoPerfilGuard implements CanActivate {

  public datoscliente = signal<ICliente | null>(null);

  constructor(@Inject(TOKEN_SERVICIOSTORAGE) private storageSvc:IStorageService,
              private router:Router){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {

    this.datoscliente.update(() => this.storageSvc.RecuperarDatosCliente());
      this.datoscliente()?.cuenta.esAdmin
    const datos = this.datoscliente();

    console.log('datos en guard...', datos);

    if (datos == null) {
      return this.router.createUrlTree(['/Cliente/Login']);
    }
    if (typeof datos === 'object' && datos !== null && 'cuenta' in datos) {
      return datos.cuenta.email && datos.cuenta.email.trim() !== '' ? true : this.router.createUrlTree(['/Cliente/Login']);
    }
    return this.router.createUrlTree(['/Cliente/Login']);
  }
}
