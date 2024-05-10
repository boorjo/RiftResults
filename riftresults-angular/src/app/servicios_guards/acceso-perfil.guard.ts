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

    const datos = this.datoscliente();

    console.log('datos en guard...', datos);

    // Verificar si datos es null o undefined
    if (datos == null) {
      return this.router.createUrlTree(['/Cliente/Login']); // Redirigir al login si no hay datos de cliente
    }
    // Comprobar si los datos son de tipo ICliente
    if (typeof datos === 'object' && datos !== null && 'cuenta' in datos) {
      // Verificar si el email no es null ni una cadena vacía
      return datos.cuenta.email && datos.cuenta.email.trim() !== '' ? true : this.router.createUrlTree(['/Cliente/Login']);
    }
    return this.router.createUrlTree(['/Cliente/Login']);
  }
}
