import { ICampeon } from "./campeon";
import { IEquipo } from "./equipo";

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
        equipos?:       Array<IEquipo>;
        campeones?:     Array<ICampeon>;
        equiposId?:     Array<number>;
        campeonesId?:   Array<string>;
    }
    _id:       string;
}