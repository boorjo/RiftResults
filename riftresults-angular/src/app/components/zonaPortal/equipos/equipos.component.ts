import { Component, Inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { IEquipo } from '../../../models/equipo';
import { RestnodeService } from '../../../servicios/restnode.service';
import { from } from 'rxjs';
import { IRestMessage } from '../../../models/restmessage';
import { TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservice';
import { IStorageService } from '../../../models/interfacestorage';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [],
  templateUrl: './equipos.component.html',
  styleUrl: './equipos.component.css',
})
export class EquiposComponent implements OnInit {
  equipos!: IEquipo[];
  equiposFiltrados = signal<IEquipo[]>([]);
  areas: string[] = [];
  areaSeleccionada: string = '';
  equipoSeleccionado: IEquipo | null = null;
  indiceEquipoSeleccionado: number = 0;

  constructor(private restNodeSvc: RestnodeService,
            @Inject(TOKEN_SERVICIOSTORAGE) private storageSvc:IStorageService
  ) {}

  ngOnInit(): void {
    this.loadEquipos();
  }

    async loadEquipos() {
      const _resp:IRestMessage = await this.restNodeSvc.RecuperarEquipos();
      console.log('Respuesta recuperar equipos...', _resp);
      if(_resp.codigo===0){
        this.equipos = _resp.otrosdatos!;
        this.equiposFiltrados.update(() => [...this.equipos]);
        console.log('Equipos cargados...', this.equipos);
        this.areas = [...new Set(this.equipos.map(equipo => equipo.AreaName))];
        this.areas.sort();
        console.log('Áreas cargadas...', this.areas);
      } else {
        console.log('Error al cargar los equipos...');
      }
  }


  filtrarPorArea(event: any): void {
    const areaSeleccionada = (event?.target?.value || '');
    if (areaSeleccionada !== '') {
        this.areaSeleccionada = areaSeleccionada;
        this.aplicarFiltro();
    } else {
        // Si se selecciona 'Todos', mostramos todos los equipos
        this.areaSeleccionada = '';
        this.equiposFiltrados.update(() => this.equipos);
    }
  }

  aplicarFiltro(): void {
    if (this.areaSeleccionada === '') {
        // Si no se ha seleccionado ningún área, mostramos todos los equipos
        this.equiposFiltrados.update(() => this.equipos);
    } else {
        this.equiposFiltrados.update(() => this.equipos.filter(equipo => 
            equipo.AreaName === this.areaSeleccionada
        ));
        console.log('Equipos filtrados por área... ', this.areaSeleccionada, this.equiposFiltrados());
    }
  }

  mostrarDetalleEquipo(equipo: IEquipo): void {
    this.equipoSeleccionado = equipo;
    this.indiceEquipoSeleccionado = this.equiposFiltrados().indexOf(equipo);
  }

  mostrarEquipoAnterior(): void {
    if (this.indiceEquipoSeleccionado > 0) {
      this.indiceEquipoSeleccionado--;
      this.mostrarDetalleEquipo(this.equiposFiltrados()[this.indiceEquipoSeleccionado]);
    }
  }

  mostrarEquipoSiguiente(): void {
    if (this.indiceEquipoSeleccionado < this.equiposFiltrados().length - 1) {
      this.indiceEquipoSeleccionado++;
      this.mostrarDetalleEquipo(this.equiposFiltrados()[this.indiceEquipoSeleccionado]);
    }
  }
}
