import { ICampeon } from "./campeon";

export interface ICliente {
    nombre:     string;
    apellidos:  string;
    cuenta:     {
        email:        string,
        password:     string,
        login:        string,
        cuentaActiva: boolean,
        imagenBASE64?:string,
        premium?:     boolean
    };
    telefono?:  string;
    pais:       string;
    datosLol: {
        rolFavorito:    string;
        equipos?:       Array<string>;
        campeones?:     Array<ICampeon>;
    }
}