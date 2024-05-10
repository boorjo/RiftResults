import { ICampeon } from "./campeon";

export interface ICliente {
    nombre:     string;
    apellidos:  string;
    cuenta:     {
        email:                  string,
        password:               string,
        login:                  string,
        cuentaActiva:           boolean,
        imagenAvatarBASE64?:    string,
        premium?:               boolean,
        esAdmin?:               boolean
    };
    telefono?:  string;
    pais:       string;
    datosLol: {
        rol:    string;
        equipos?:       Array<string>;
        campeones?:     Array<ICampeon>;
    }
}