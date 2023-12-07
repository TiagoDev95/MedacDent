//Función para validar todos los campos del formulario
function validacion(event, crear, index){
    //Evitamos que se envíe el fomrulario hasta comprobar los datos
    event.preventDefault();
    let nombre = document.getElementById("name");
    let apellidos = document.getElementById("surname");
    let dni = document.getElementById("document");
    let numero = document.getElementById("number");
    let email = document.getElementById("email");
    let nacimiento = document.getElementById("birth");
    let observaciones = document.getElementById("observations");
    let cita = document.getElementById("cita");

    let mensaje = "";
    //Realizamos la validación de cada uno de los elementos introducidos en el formulario:
    if(!validarNombreApellidos(nombre.value)){
        mensaje += "Nombre incorrecto\n";
        //Realizamos los cambios necesarios para mostrar el error en pantalla
        nombre.setAttribute("class", "inline fail");
        document.getElementById("nameSpan").textContent = "*El nombre no es válido";
    }
    else{
        //Realizamos los cambios necesarios para mostrar que el dato es correcto
        nombre.setAttribute("class", "inline correcto");
        document.getElementById("nameSpan").textContent = "";
    }

    if(!validarNombreApellidos(apellidos.value)){
        mensaje += "Apellidos incorrectos\n";
        apellidos.setAttribute("class", "inline fail");
        document.getElementById("surnameSpan").textContent = "*Los Apellidos no son válidos";
    }
    else{
        apellidos.setAttribute("class", "inline correcto");
        document.getElementById("surnameSpan").textContent = "";
    }

    if(!validarDni(dni.value)){
        mensaje += "DNI/NIE incorrecto\n";
        dni.setAttribute("class", "inline fail");
        document.getElementById("documentSpan").textContent = "*DNI/NIE no válido";
    }
    else{
        dni.setAttribute("class", "inline correcto");
        document.getElementById("documentSpan").textContent = "";
    }

    if(!validarNumero(numero.value)){
        mensaje += "Número de teléfono no válido\n";
        numero.setAttribute("class", "inline fail");
        document.getElementById("numberSpan").textContent = "*Número no válido (debe empezar por 6-7-8-9";    
    }
    else{
        numero.setAttribute("class", "inline correcto");
        document.getElementById("numberSpan").textContent = "";    
    }

    if(!validarEmail(email.value)){
        mensaje += "Email no válido\n";
        //document.getElementById("email").setAttribute("class", "fail");
    }
    else{
        email.setAttribute("class", "inline correcto");
    }

    if(!validarNacimiento(nacimiento.value)){
        mensaje += "Fecha de nacimiento no válida\n";
        nacimiento.setAttribute("class", "failDate");
        document.getElementById("birthSpan").textContent = "*Fecha de Nacimiento no válida";
    }
    else{
        nacimiento.setAttribute("class", "rightDate");
        document.getElementById("birthSpan").textContent = "";
    }

    if(!validarCita(cita.value)){
        mensaje += "Fecha de cita no válida\n";
        cita.setAttribute("class", "failDate");
        document.getElementById("citaSpan").textContent = "*La fecha de la cita no es válida. Horario: Luneas-Viernes (09:00-19:00)";
    }
    else{
        cita.setAttribute("class", "rightDate");
        document.getElementById("citaSpan").textContent = "";
    }
    //console.log(mensaje);

    //Si no existen errores (los errores se van almacenando en un mensaje con cada uno de los campos no válidos)
    if(mensaje === ""){

        let newId = new Date().getTime();
        let citas = []
        let nuevaCita = new Cita(newId, nombre.value, apellidos.value, dni.value, numero.value, email.value, nacimiento.value, observaciones.value, cita.value);
        //Si no habían citas almacenadas, el array contiene solo la nueva cita, sino, se añade al array de citas
        if(getArrayCitasCookie("listadoCitas") === null){
            citas = [nuevaCita];
        }
        else{
            citas = getArrayCitasCookie("listadoCitas");
            if(crear){
                citas.push(nuevaCita);
            }
            else{
                citas[index] = nuevaCita;
            }
        }

        //Ordenamos las citas por orden de cercanía de la fecha de la cita
        citas.sort(function(a, b){
            a = new Date(Date.parse(a.cita)).getTime();
            b = new Date(Date.parse(b.cita)).getTime();
            //console.log(a);
            //console.log(b);
            return a-b;
        });
        setArrayCitasCookie("listadoCitas", citas, 30); //Almacenamos citas en cookies
        //console.log(citas);
        citaCreada(true);
    }
}

//Validación del Nombre y Apellidos (mismo procedimiento)
function validarNombreApellidos(nombre){
    //Eliminamos los espacios y comprobamos si todos los elementos son letras (con o sin tilde)
    nombre = nombre.toLowerCase().replaceAll(" ", "");
    if(nombre.length == 0){
        return false;
    }
    for(let i = 0; i < nombre.length; i++){
        //Si el nombre no es una letra minúscula, incluyendo las vocales con tilde, el nombre no es válido
        if((nombre.charCodeAt(i) < 97 || nombre.charCodeAt(i) > 122) && (nombre.charCodeAt(i) != 225 && nombre.charCodeAt(i) != 233 && nombre.charCodeAt(i) != 237 && nombre.charCodeAt(i) != 243 && nombre.charCodeAt(i) != 250)){
            return false;
        }
    }

    return true;
}

//Validación del DNI
function validarDni(dni){
    //Comprobamos la longitud del DNI, que debe ser de 9
    if(dni.length != 9){
        return false;
    }
    
    //Si es un NIE el primer caracter es un X, Y, Z; se sutituye por 0, 1, 2 respectivamente
    if(dni.charAt(0).toUpperCase() == 'X'){
        dni = dni.replace(dni.charAt(0), '0');
    }

    if(dni.charAt(0).toUpperCase() == 'Y'){
        dni = dni.replace(dni.charAt(0), '1');
    }

    if(dni.charAt(0).toUpperCase() == 'Z'){
        dni = dni.replace(dni.charAt(0), '2');
    }

    /*Después de sustituir la letra por su correspondiente en el caso del NIE
     comprobamos si todos los elementos excepto el último son dígitos*/
    let numeroDni = "";
    let i = 0;
    while(i < dni.length-1){
        if(dni.charCodeAt(i) >= 48 && dni.charCodeAt(i) <= 57){
            numeroDni+=dni.charAt(i);
        }
        else{
            return false;
        }
        i++;
    }

    //Comprobamos que la letra del DNI corresponde con la asignada a ese número de DNI/NIE
    let letraDni = "TRWAGMYFPDXBNJZSQVHLCKE";
    let letraCorrecta = letraDni.charAt((Number(numeroDni)%23));
    if(dni.charAt(dni.length-1).toUpperCase() != letraCorrecta){
        return false;
    }
    return true;
}

//Validación del número de teléfono
function validarNumero(numero){
    //El número debe tener 9 dígitos
    if(numero.length != 9){
        return false;
    }

    //Los números en España empiezan por 6, 7, 8 ó 9. Si no es así, el número es incorrecto
    let numeroInicial = Number(numero.charAt(0));
    if(numeroInicial != 6 && numeroInicial != 7 && numeroInicial != 8 && numeroInicial != 9){
        return false;
    }

    for(let i = 1; i < numero.length; i++){
        if(numero.charCodeAt(i) <= 48 && numero.charCodeAt(i)>=57){
            return false;
        }
    }

    return true;
}

//Validación del email
function validarEmail(email){
    /*if(!email.contains('@')){
        return false;
    }

    else{
        return true;
    }*/
    console.log(typeof(email));
    return true;
}

//Validación de fecha de Nacimiento
function validarNacimiento(nacimiento){
    //Creamos una fecha a través de los datos de fecha de nacimiento intropducidos en el input
    let fecha = new Date(Date.parse(nacimiento));
    let hoy = new Date();

    //Si la fecha es superior a hoy, la persona no ha nacido
    if(fecha > hoy){
        return false;
    }
    else{
        return true;
    }
}


//Validación de fecha de cita
function validarCita(cita){
    //Creamos el objeto Date de la fecha introducida en el input de la cita
    let fecha = new Date(Date.parse(cita));
    let hoy = new Date();

    //Si la cita se elige el sábado(6) o el domingo(0) no es posible crear la cita
    console.log(fecha.getDay());
    if(fecha.getDay() === 0 || fecha.getDay()===6){
        return false;
    }

    //Si la fecha es anterior al día actual o es hoy, no es posible crear la cita
    if(fecha <= hoy){
        return false;
    }

    //Si la hora de la cita no es entre las 9:00 y las 19:00 no se puede crear la cita
    let hora = fecha.getHours();
    if(hora >= 19 || hora <9){
        return false;
    }
    
    return true;
}