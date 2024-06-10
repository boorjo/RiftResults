import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICliente } from '../models/cliente';
import { IRestMessage } from '../models/restmessage';
import { lastValueFrom } from 'rxjs';
import { IPublicacion } from '../models/publicacion';

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

  public RecuperarRoles(){
    return lastValueFrom(
      this._httpclient.get<IRestMessage>(
        'http://localhost:3000/api/Cliente/RecuperarRoles',
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
    );
  }

  public ModificarPerfil(datos: ICliente) {
    return lastValueFrom(
      this._httpclient.post<IRestMessage>(
        'http://localhost:3000/api/Cliente/ModificarPerfil', datos,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
    );
  }

  public CambiarPassword(datos: {idcliente: string; password: string;}){
    return lastValueFrom(
      this._httpclient.post<IRestMessage>(
        'http://localhost:3000/api/Cliente/CambiarPassword', datos,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
    );
  }

  public ObtenerUsuario(id: string){
    return lastValueFrom(
      this._httpclient.get<IRestMessage>(
        `http://localhost:3000/api/Cliente/ObtenerUsuario/${id}`,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
    );
  }

  //#endregion

  //#region ------ metodos para zona Portal ----------

  public RecuperarEquipos(){
    return lastValueFrom(
      this._httpclient.get<IRestMessage>(
        'http://localhost:3000/api/Portal/RecuperarEquipos',
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
    );
  }

  public GetEquiposPorId(ids: number[]){
    return lastValueFrom(
      this._httpclient.post<IRestMessage>(
        'http://localhost:3000/api/Portal/GetEquiposPorId',
         ids,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
    );
  }

  public AddEquipoFavorito(idcliente: string, idequipo: number){
    return lastValueFrom(
      this._httpclient.post<IRestMessage>(
        'http://localhost:3000/api/Portal/AddEquipoFavorito', {idcliente, idequipo},
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
    );
  }

  public EliminarEquipoFavorito(idcliente: string, idequipo: number){
    return lastValueFrom(
      this._httpclient.post<IRestMessage>(
        'http://localhost:3000/api/Portal/EliminarEquipoFavorito', {idcliente, idequipo},
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
    );
  }

  public AddCampeonFavorito(idcliente: string, idcampeon: string){
    return lastValueFrom(
      this._httpclient.post<IRestMessage>(
        'http://localhost:3000/api/Portal/AddCampeonFavorito', {idcliente, idcampeon},
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
    );
  }

  public EliminarCampeonFavorito(idcliente: string, idcampeon: string){
    return lastValueFrom(
      this._httpclient.post<IRestMessage>(
        'http://localhost:3000/api/Portal/EliminarCampeonFavorito', {idcliente, idcampeon},
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
    );
  }

      //#region ------ metodos para FORO ----------
      public guardarPublicacion(publicacion: IPublicacion){
            return lastValueFrom(
              this._httpclient.post<IRestMessage>(
                'http://localhost:3000/api/Portal/Foro/GuardarPublicacion', publicacion,
                {
                  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
                }
              )
            );
      }

      public obtenerPublicaciones(categoria: string = 'todo') {
          return lastValueFrom(
              this._httpclient.get<IRestMessage>(
                  `http://localhost:3000/api/Portal/Foro/ObtenerPublicaciones?categoria=${categoria}`,
                  {
                      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
                  }
              )
          );
      }
      public recuperarPublicacion(id: string) {
        return lastValueFrom(
          this._httpclient.get<IRestMessage>(
            `http://localhost:3000/api/Portal/Foro/ObtenerPublicacion/${id}`,
            {
              headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            }
          )
        );
      }
      public publicarComentario(publicacionId: string, publicacion: any){
        const body = {
          publicacionId: publicacionId,
          comentario: publicacion
        };
        return lastValueFrom(
          this._httpclient.post<IRestMessage>(
            'http://localhost:3000/api/Portal/Foro/PublicarComentario',
            body,
            {
              headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            }
          )
        );
      }
      //#endregion

  //#endregion
  //#region ------ metodos para zona ADMIN ----------
  public RecuperarUsuarios(){
    return lastValueFrom(
      this._httpclient.get<IRestMessage>(
        'http://localhost:3000/api/Admin/RecuperarUsuarios',
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
    );
  }
  public EliminarUsuario(id: string){
    return lastValueFrom(
      this._httpclient.post<IRestMessage>(
        `http://localhost:3000/api/Admin/EliminarUsuario/${id}`,
        { idusuario: id },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
    );
  }
  public EditarUsuario(usuario: ICliente){
    return lastValueFrom(
      this._httpclient.post<IRestMessage>(
        'http://localhost:3000/api/Admin/EditarUsuario',
        usuario,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
    );
  }
  //#endregion
}
