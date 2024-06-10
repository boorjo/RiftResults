import { ICliente } from "./cliente";

export interface IPublicacion {
    publicacionId?: string;
    _id?:           string;
    titulo:         string;
    contenido:      string;
    categoria:      string;
    usuarioId:      string;
    fecha:          Date;
    comentarios:    {
        autorId:     string;
        fecha:       Date;
        contenido:   string;
        autor:     ICliente;
    }[];
    usuario?:       ICliente;
}