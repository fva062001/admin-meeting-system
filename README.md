# RegistroReunionFront

Este proyecto fue creado en [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.

## Comandos para desarrollo

Correr comando **`npm i`** para instalar los modulos necesarios para correr el proyecto, en el caso de que de error, correr el comando **`npm i --force`** para deshabilitar las protecciones del proyecto y poder instalar los modulos necesarios

Correr **`ng build`** para armar el proyecto. 

Correr comando **`npm start`** para servidor de desarrollo. Ir a **`http://localhost:4200/`** para visualizacion del proyecto.


## Conexiones

Este proyecto se conecta con el API del back-office del mismo, por medio de los servicios empleados en **`./src/app/app.service.ts`** el cual consta de los siguientes metodos:

- **`getReunion(id_reunion:number)`:** Este metodo recibe como parametro el jwt de la reunion al recibirlo, este hace un GET Request al Back-Office para luego recibir la informacion de la reunion listada en la pantalla principal del componente.
- **`postEmpleado(id:number,id_reunion:number,body:Object)`:** Este metodo recibe tambien el jwt de la reunion y al mismo tiempo recibe el id del empleado por medio del formulario correspondiente, tambien se manda un body requerido por el Back-Office y manda un POST Request al Back-Office en el cual se conecta con el API del PAI para mandar un status y luego mandar por medio de la interfaz la respuesta recibida por medio del status.
- **`postPersona(id_reunion:number,body:Participante)`:** Este metodo utiliza el jwt de la reunion y a su vez manda por medio del body la informacion correspondiente a la persona haciendo un POST Request al Back-Office que a su vez se comunica con el API del sistema de gestion de usuarios para luego mandar un status y posteriormente con ese status presentapor medio de la interfaz de usuario la respuesta recibida.

## Funcionamiento del Front

Primeramente el usuario cuando entra al lobby (Pagina que muestra la informacion de la reunion), hace un GET Request por medio del metodo **`getReunion()`** en el **`ngOnInit()`**; si la reunion no existe, automaticamente la persona no podra hacer absolutamente nada y lo unico que vera es el template que especifica que no se ha encontrado la reunion, en el caso contrario podra proceder con los siguientes pasos.

Luego de lo anterior, pasamos a la plantilla en el cual a la persona se le da la opcion de elegir si es empleado o no, en el caso de que sea empleado, se le mandara a la plantilla del empleado en el cual el usuario podra poner su codigo de empleado, el cual tiene validacion para evitar problemas al momento de hacer el POST Request, luego de que el empleado ponga su codigo, se hara un POST Request por medio del metodo **'postEmpleado()'** si el status fue que no se encontro o error, automaticamente recibira una notificacion diciendo que hubo un error y le hara un reset al formulario para poder recibir datos nuevamente; en el caso contrario, luego de hacer el Request y se haya registrado al empleado exitosamente, se mostrata una notificacion de que hubo exito al registrar al empleado y lo mandara a la plantilla de agradecimiento donde no podra hacer mas nada.

En el caso de una persona externa, sigue los mismos pasos que el empleado, lo unico que cambia es que el validador de numero de telefono fue implementado con una expresion regular y que el POST Request en este caso es por medio del metodo **'postPersona()'** y luego de esto cumple las mismas funciones que con el empleado.
