import { Component, Inject, OnInit, signal } from '@angular/core';
import { IPublicacion } from '../../../models/publicacion';
import { RestnodeService } from '../../../servicios/restnode.service';
import { IRestMessage } from '../../../models/restmessage';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ICliente } from '../../../models/cliente';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservice';
import { SignalstorageService } from '../../../servicios/signalstorage.service';

@Component({
  selector: 'app-publicacion',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [DatePipe],
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.css']
})
export class PublicacionComponent implements OnInit {

  publicacion: IPublicacion | null = null;
  usuario: ICliente | null = null;
  formComentario = new FormGroup({
    comentario: new FormControl('', Validators.required),
  });

  public datoscliente = signal<ICliente | null>(null);
  public msg: string = "";
  public id: string | null = "";

  constructor(private route: ActivatedRoute,
              private restSvc: RestnodeService,
              protected router: Router,
              protected datePipe: DatePipe,
              @Inject(TOKEN_SERVICIOSTORAGE) storageSvc: SignalstorageService) {
    this.datoscliente.update(() => storageSvc.RecuperarDatosCliente());
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id !== null) {
        this.cargarPublicacion(this.id);
      }
    });
  }

  async cargarPublicacion(id: string | null) {
    if (id) {
      try {
        const _resp: IRestMessage = await this.restSvc.recuperarPublicacion(id);
        this.publicacion = _resp.otrosdatos;
        const responseUsuario = await this.restSvc.ObtenerUsuario(this.publicacion!.usuarioId);
        this.usuario = responseUsuario.otrosdatos;
        console.log('Publicación obtenida:', this.publicacion);
        console.log('Usuario obtenido:', this.usuario);
        for (const comentario of this.publicacion!.comentarios) {
          console.log('obteniendo comentarios...', comentario);
          const responseAutorComentario = await this.restSvc.ObtenerUsuario(comentario.autorId);
          comentario.autor = responseAutorComentario.otrosdatos;
          console.log('Obteniendo autor...', comentario.autor);
        }
        console.log('Comentarios cargados...', this.publicacion?.comentarios)
      } catch (error) {
        console.error('Error al obtener la publicación:', error);
      }
    } else {
      console.error('No se encontró el ID en la URL');
    }
  }

  publicarComentario() {
    if (this.formComentario.valid) {
      const comentario = this.formComentario.value.comentario;
      if (this.datoscliente()?.nombre && this.publicacion && this.publicacion._id) {
        const login = this.datoscliente()?.cuenta.login;
        if (login) {
          const comentarioNuevo = {
            autorId: this.datoscliente()?._id || '',
            fecha: new Date(),
            contenido: comentario,
          };
          const publicacionId = this.publicacion._id;
          this.restSvc.publicarComentario(publicacionId, comentarioNuevo).then(res => {
            if (res.codigo === 0) {
              this.formComentario.reset();
              this.cargarPublicacion(publicacionId);
            } else {
              console.error('Error al publicar el comentario:', res.mensaje);
            }
          }).catch(error => {
            console.error('Error al publicar el comentario:', error);
          });
        }
      } else {
        this.msg = "Inicia sesión para comentar.";
      }
    } else {
      this.msg = "Escribe un comentario.";
    }
  }
}
