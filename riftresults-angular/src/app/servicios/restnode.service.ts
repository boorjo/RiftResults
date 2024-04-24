import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICliente } from '../models/cliente';
import { IRestMessage } from '../models/restmessage';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestnodeService {
  constructor(private _httpclient: HttpClient) {}

  //#region ------ metodos para zona Cliente ----------
  public RegistrarCliente(cliente: ICliente) {
    return this._httpclient
      .post('http://localhost:3000/api/Cliente/Registro', cliente)
      .toPromise()
      .then((response: any) => {
        console.log('Respuesta del servidor:', response);
        return response;
      })
      .catch((error: any) => {
        console.error('Error al enviar la solicitud:', error);
        throw error;
      });
  }

  public async ActivarCuenta(token: string) {
    return this._httpclient
      .post('http://localhost:3000/api/Cliente/ActivarCuenta/' + token, {})
      .toPromise()
      .then((response: any) => {
        console.log('Respuesta del servidor:', response);
        return response;
      })
      .catch((error: any) => {
        console.error('Error al enviar la solicitud:', error);
        throw error;
      });
}


  public LoginCliente(credenciales: {email: string;password: string;}): Promise<IRestMessage> {
    return lastValueFrom(
      this._httpclient.post<IRestMessage>(
        'http://localhost:3000/api/Cliente/Login',
        credenciales,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
    );
  }

  //#endregion

  //#region ------ metodos para zona Portal ----------

  //#endregion
}
