import { ICliente } from "./cliente";

export interface IRestMessage{
    codigo: number;
    mensaje:string;
    error?:string;
    tokensesion?:string;
    datoscliente?:ICliente;
    otrosdatos?:any;
}