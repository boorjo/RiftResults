// import { HttpClient } from '@angular/common/http';
// import { Injectable, signal } from '@angular/core';
// import { ICampeon, ICampeonAPI } from '../models/campeon';
// import { Signal } from '@angular/core'; // Importa Signal

// @Injectable({
//   providedIn: 'root'
// })
// export class ApicampeonesService {

//   private apiUrl = 'https://ddragon.leagueoflegends.com/cdn/12.4.1/data/en_US/champion.json';
//   private campeones!: Signal<ICampeon[]>; // Almacena los campeones una vez obtenidos

//   constructor(private _httpclient: HttpClient) {
//     this.getAPICampeones();
//   }

//   async getAPICampeones(): Promise<void> {
//     const data = signal(await this._httpclient.get<ICampeonAPI>(this.apiUrl));
//     // Almacena los campeones en la variable campeones una vez obtenidos los datos de la API a través de la señal
//     this.campeones = signal<ICampeon[]>(data);

    
//   }

//   // Método para obtener los campeones
//   getCampeones(): Signal<ICampeon[]> {
//     return this.campeones;
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICampeon, ICampeonAPI } from '../models/campeon';

@Injectable({
  providedIn: 'root'
})
export class ApicampeonesService {

  //private apiUrl = 'https://ddragon.leagueoflegends.com/cdn/12.4.1/data/en_US/champion.json';
  private apiUrl = 'https://ddragon.leagueoflegends.com/cdn/12.4.1/data/es_ES/champion.json';

  constructor(private _httpclient: HttpClient) { }

  getAPICampeones(): Observable<ICampeon[]> {
    return this._httpclient.get<ICampeonAPI>(this.apiUrl).pipe(
      map(data => {
        // Mapeamos los campeones y establecemos la URL de la imagen desde el campo 'image.full'
        return Object.values(data.data).map((campeon: ICampeon) => {
          campeon.image.full = `https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/${campeon.image.full}`;
          return campeon;
        });
      })
    );
  }

  getCampeonesPorId(ids: string[]): Observable<ICampeon[]>{ //la id es = que el name en la API.
    return this.getAPICampeones().pipe(
      map(campeones => campeones.filter(campeon => ids.includes(campeon.name)))
    );
  }

}
