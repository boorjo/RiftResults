import { Component, Inject, signal } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { ICliente } from './models/cliente';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IStorageService } from './models/interfacestorage';
import { TOKEN_SERVICIOSTORAGE } from './servicios/injectiontokenstorageservice';


// subject q emitira evento cada vez q se haga login/logout
export const loginEvent = new Subject<void>();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public datoscliente = signal<ICliente | null>(null);
  public jwt = signal<string>("");
  private loginSubscription: Subscription;
  public esAdmin = signal<boolean>(false);
  public isMenuOpen = signal<boolean>(false);

  constructor(private router:Router,
              @Inject(TOKEN_SERVICIOSTORAGE) private storageSvc:IStorageService){
    //buscar en storage si está logeado cliente para poner su valor
    // Suscribirse al evento de login
    this.loginSubscription = loginEvent.subscribe(() => {
      this.datoscliente.update(() => this.storageSvc.RecuperarDatosCliente());
      console.log('Datos cliente...', this.datoscliente());
      this.jwt.update(() => this.storageSvc.RecuperarJWT());
      this.esAdmin.update(() => this.datoscliente()?.cuenta?.esAdmin || false);
      console.log('Es admin: ', this.esAdmin());
      //console.log('token recuperado...', this.jwt());
    });

  }

  CerrarSesion(){
    this.storageSvc.AlmacenarDatosCliente(null);
    this.storageSvc.AlmacenarJWT("");
    this.esAdmin.update(() => false); //aseguramos de que no se quede como admin sin sesion
    console.log('Sesión cerrada...');
    loginEvent.next(); //para q se refresque la vista!
    this.router.navigate(['/Cliente/Login']);
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
  //funcion cambiar isMenuOpen a lo contrario que esté
  toggleMenu(){
    this.isMenuOpen.update((prev) => !prev);
    console.log('Menu abierto: ', this.isMenuOpen());
  }
}
