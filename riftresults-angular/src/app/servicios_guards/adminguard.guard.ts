// admin-access.guard.ts
import { Inject, Injectable, signal } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TOKEN_SERVICIOSTORAGE } from '../servicios/injectiontokenstorageservice';
import { IStorageService } from '../models/interfacestorage';
import { ICliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class AdminAccessGuard implements CanActivate {

  public datoscliente = signal<ICliente | null>(null);

  constructor(@Inject(TOKEN_SERVICIOSTORAGE) private storageSvc:IStorageService,
              private router:Router){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {

    this.datoscliente.update(() => this.storageSvc.RecuperarDatosCliente());
    const datos = this.datoscliente();

    console.log('datos en guard...', datos);

    if (datos == null || !datos.cuenta.esAdmin) {
      return this.router.createUrlTree(['/Cliente/Login']);
    }
    return true;
  }
}
