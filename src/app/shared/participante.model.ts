export interface Participante{
    reunionId?:number;
    documento?:any;
    nombre:string;
    apellido:string;
    cargo?:string;
    sexo:string;
    institucion?:string;
    telefono?:string;
    correoElectronico?: string;
    estatus: boolean
}