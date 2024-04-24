//para mapear directamente los datos de la API a un obj ts
export interface ICampeonAPI {
    type: string;
    format: string;
    version: string;
    data: {
      [key: string]: ICampeon;
    };
  }

  export interface ICampeon {
    //mismos nombres q en API para no liarme
    name:       string;
    title:      string;
    blurb:      string; //descripcion del pj/lore
    tags:       Array<string>; //rol, p.e. fighter, tank...
    stats:      {
      hp:             number,
      mp:             number,
      movespeed:      number,
      armor:          number,
      attackrange:    number,
      attackdamage:   number,
      attackspeed:    number,
    };
    image: {
      full: string; // mapeamos tal cual de la API para poder obtenerla en español, evitar problemas de espacios, símbolos ('), etc..
    };
  }
