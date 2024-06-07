import { Component, ElementRef, Inject, ViewChild, signal } from '@angular/core';
import { RestnodeService } from '../../../servicios/restnode.service';
import { SignalstorageService } from '../../../servicios/signalstorage.service';
import { ICliente } from '../../../models/cliente';
import { TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservice';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IPublicacion } from '../../../models/publicacion';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './foro.component.html',
  styleUrl: './foro.component.css'
})
export class ForoComponent {
  @ViewChild('modalExitoRef') modalExitoRef: ElementRef | undefined;

  public categoriaSeleccionada = signal<string>('todo');
  public datoscliente = signal<ICliente | null>(null); //datos del cliente logueado
  public titulo = signal<string>('');
  public contenido = signal<string>('');
  public formPublicacion: FormGroup;
  public publicacion: IPublicacion | null = null;
  public publicaciones = signal<Array<IPublicacion>>([]);

  constructor(private restNodeSvc: RestnodeService,
              @Inject(TOKEN_SERVICIOSTORAGE) storageSvc:SignalstorageService ) {
    this.datoscliente.update(() => storageSvc.RecuperarDatosCliente());
    console.log('datos cliente...', this.datoscliente());
    this.obtenerPublicacionesPorCategoria("todo");
    this.formPublicacion = new FormGroup({
      titulo: new FormControl(this.titulo(), [Validators.required, Validators.minLength(3)]),
      contenido: new FormControl(this.contenido(), [Validators.required, Validators.minLength(20)]),
      categoria: new FormControl(this.categoriaSeleccionada(), Validators.required)
    });
  }

  cambiarCategoria(categoria: string) {
    this.categoriaSeleccionada.update(() => categoria);
    this.obtenerPublicacionesPorCategoria(categoria);
}

  publicarPost() {
    console.log('Datos publicación... ', this.formPublicacion.value);

    if (this.formPublicacion.valid) {
        this.publicacion = {
        titulo: this.formPublicacion.value.titulo,
        contenido: this.formPublicacion.value.contenido,
        categoria: this.formPublicacion.value.categoria,
        usuarioId: this.datoscliente()?._id || '',
        fecha: new Date(),
        comentarios : []
      };
      this.restNodeSvc.guardarPublicacion(this.publicacion).then(res => {
        console.log('Publicación a guardar...', this.publicacion);
        if(res.codigo === 0) {
          console.log('Publicación guardada con éxito:', res);
          //haz que aqui se muestre la ventana modal obtenida en la variable modalExitoRef
          this.formPublicacion.reset();
          if (this.modalExitoRef) {
            const modalExitoElement = this.modalExitoRef.nativeElement;
            //$(modalExitoElement).modal('show');
          }
        }else{
          console.log('Ha habido un error al guardar la publicación...', res.mensaje);
        }

      }).catch((error: any) => {
        console.error('Error al guardar la publicación:', error);
      });
    } else {
      console.log('FORMULARIO NO VALIDOOO!');
    }
  }

  obtenerPublicacionesPorCategoria(categoria: string) {
    this.restNodeSvc.obtenerPublicaciones(categoria).then(response => {
      // Asumiendo que response.otrosdatos contiene un array de publicaciones
      this.publicaciones.update(() => response.otrosdatos);
      console.log('Publicaciones actualizadas:', this.publicaciones());
    }).catch(error => {
      console.error('Error al obtener publicaciones:', error);
    });
  }

}
