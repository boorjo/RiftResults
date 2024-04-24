import { ICliente } from "./cliente";

export interface IStorageService {
    //#region ...ALMACENAMIENTO EN SERVICIO SIGNAL...
    AlmacenarDatosCliente(datoscliente:ICliente|null):void;
    AlmacenarJWT(jwt:string):void;
    //#endregion

    //#region ...RECUPERACION DATOS EN SERVICIO SIGNAL...
    RecuperarDatosCliente():ICliente | null; //<---- lo podiamos hacer devolviendo valor de tipo ICliente como en blazor(uso en signals), pero con el observable aprovechamos pipe: async
    RecuperarJWT():string;
    //#endregion
    
}