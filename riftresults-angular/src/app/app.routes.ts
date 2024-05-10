import { Routes } from '@angular/router';
import { RegistroComponent } from './components/zonaUsuario/registroComponent/registro.component';
import { LoginComponent } from './components/zonaUsuario/loginComponent/login.component';
import { RegistroOKComponent } from './components/zonaUsuario/registroOKComponent/registro-ok.component';
import { CuentaActivaComponent } from './components/zonaUsuario/cuentaActivadaComponent/cuenta-activa.component';
import { InicioComponent } from './components/zonaPortal/inicioComponent/inicio.component';
import { TerminosYPrivacidadComponent } from './components/zonaPortal/terminosServiciosComponent/terminosyservicios.component';
import { CampeonesComponent } from './components/zonaPortal/campeones/campeonesComponent/campeones.component';
import { PanelClienteComponent } from './components/zonaUsuario/panelClienteComponent/panel-cliente.component';
import { accesoPerfilGuard } from './servicios_guards/acceso-perfil.guard';

export const routes: Routes = [
  {
    path: 'Cliente',
    children: [
      { path: 'Registro', component: RegistroComponent },
      { path: 'Registrook', component: RegistroOKComponent },
      { path: 'Login', component: LoginComponent },
      { path: 'ActivarCuenta/:token', component: CuentaActivaComponent },
      { path: 'PanelCliente', component: PanelClienteComponent, canActivate: [accesoPerfilGuard] } // <-- solo accesible si logueados meter guard
    ]
  },
  {
    path: 'Inicio',
    children: [
      //{ path: 'paginaInicial', component: PaginaInicialComponent },
      //{ path: 'liga', component: LigaComponent },
      //{ path: 'equipos', component: EquiposComponent },
      { path: 'Campeones', component: CampeonesComponent }
    ]
  },
    { path: '', component:InicioComponent }, //ruta raiz al arrancar! 
    { path: 'TerminosYPrivacidad', component: TerminosYPrivacidadComponent}
];
