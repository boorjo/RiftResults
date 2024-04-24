import { Component, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ICampeon } from '../../../../../models/campeon';
import { ApicampeonesService } from '../../../../../servicios/apicampeones.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-campeones',
  standalone: true,
  imports: [],
  templateUrl: './campeones.component.html',
  styleUrl: './campeones.component.css',
})
export class CampeonesComponent implements OnInit {
  campeones!: ICampeon[];
  campeonesFiltrados = signal<ICampeon[]>([]);
  rolSeleccionado: string = '';
  campeonSeleccionado: ICampeon | null = null;
  indiceCampeonSeleccionado: number = 0;
  radarChart: any;

  @ViewChild('radarCanvas') radarCanvas: any;

  constructor(private campeonesSvc: ApicampeonesService) {}

  ngOnInit(): void {
    this.loadCampeones();
  }

  loadCampeones(): void {
    this.campeonesSvc.getAPICampeones().subscribe(
      (campeones: ICampeon[]) => {
        this.campeones = campeones;
        console.log('Campeones cargados...', this.campeones);
        this.campeonesFiltrados.update(() => this.campeones);
      },
      (error: any) => {
        console.log('Error al cargar los campeones... ', error);
      }
    );
  }

  filtrarPorRol(event: any): void {
    const rolSeleccionado = (event?.target?.value || '').toLowerCase();
    if (rolSeleccionado !== '') {
        this.rolSeleccionado = rolSeleccionado;
        this.aplicarFiltro();
    } else {
        // Si se selecciona 'Todos', mostramos todos los campeones
        this.rolSeleccionado = '';
        this.campeonesFiltrados.update(() => this.campeones);
    }
  }

  aplicarFiltro(): void {
    if (this.rolSeleccionado === '') {
        // Si no se ha seleccionado ningún rol, mostramos todos los campeones
        this.campeonesFiltrados.update(() => this.campeones);
    } else {
        this.campeonesFiltrados.update(() => this.campeones.filter(campeon => 
            campeon.tags.some(tag => tag.toLowerCase() === this.rolSeleccionado)
        ));
        console.log('Campeones filtrados por rol... ', this.rolSeleccionado, this.campeonesFiltrados());
    }
  }

  mostrarDetalleCampeon(campeon: ICampeon): void {
    this.campeonSeleccionado = campeon;
    this.indiceCampeonSeleccionado = this.campeonesFiltrados().indexOf(campeon);
    this.actualizarGrafica();
  }

  mostrarCampeonAnterior(): void {
    if (this.indiceCampeonSeleccionado > 0) {
      this.indiceCampeonSeleccionado--;
      this.mostrarDetalleCampeon(this.campeonesFiltrados()[this.indiceCampeonSeleccionado]);
    }
  }

  mostrarCampeonSiguiente(): void {
    if (this.indiceCampeonSeleccionado < this.campeonesFiltrados().length - 1) {
      this.indiceCampeonSeleccionado++;
      this.mostrarDetalleCampeon(this.campeonesFiltrados()[this.indiceCampeonSeleccionado]);
    }
  }

  actualizarGrafica(): void {
    const stats = this.campeonSeleccionado?.stats;
    const labels = ['HP', 'MP', 'Vel. Movimiento', 'Armadura', 'Rango', 'Daño', 'Vel. Ataque'];
    const data = [
      stats?.hp, 
      stats?.mp, 
      stats?.movespeed, 
      (stats?.armor ?? 0) * 10, 
      stats?.attackrange, 
      (stats?.attackdamage ?? 0) * 5, // Multiplica el daño por 5
      (stats?.attackspeed ?? 0) * 500  // Multiplica la velocidad de ataque por 500
    ];

    // Obtén los valores máximos y mínimos para cada estadística
    // multiplicamos * 5 y 500 para que se vean mejor en la chart
    const maxValues: { [key: string]: number } = {};
    const minValues: { [key: string]: number } = {};
    for (const champion of this.campeones) {
      for (const label of labels) {
        let value = champion.stats[label as keyof typeof champion.stats];
        if (label === 'Daño') {
          value *= 5; // Multiplica el daño por 5
        } else if (label === 'Velocidad de Ataque') {
          value *= 500; // Multiplica la velocidad de ataque por 500
        }
        if (!(label in maxValues) || value > maxValues[label]) {
          maxValues[label] = value;
        }
        if (!(label in minValues) || value < minValues[label]) {
          minValues[label] = value;
        }
      }
    }
  
    if (this.radarChart) {
      this.radarChart.data.labels = labels;
      this.radarChart.data.datasets[0].data = data;
      this.radarChart.update();
    } else {
      this.radarChart = new Chart(this.radarCanvas.nativeElement, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Estadísticas',
            data: data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            r: {
              suggestedMin: Math.min(...Object.values<number>(minValues)), // Usa el valor mínimo de todas las estadísticas
              suggestedMax: Math.max(...Object.values<number>(maxValues)), // Usa el valor máximo de todas las estadísticas
              ticks: {
                display: false,
                stepSize: 20
              }
            }
          }
        }
      });
    }
  }
  
}
