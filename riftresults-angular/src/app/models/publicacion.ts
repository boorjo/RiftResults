export interface IPublicacion {
    _id?:           string;
    titulo:         string;
    contenido:      string;
    categoria:      string;
    usuarioId:      string;
    fecha:          Date;
    comentarios:    Array<IPublicacion>;
}