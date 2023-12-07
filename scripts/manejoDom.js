//Función para borrar el contenido del HTML y crear el HTML con el formulario:
function crearCita(crear, index){
    //Creamos una nueva sección que será igualmente la sección principal pero que contiene un formulario:
    let nuevaSection = document.createElement("section");
    nuevaSection.setAttribute("id", "main");
    nuevaSection.setAttribute("class", "formPage");
    let actualSection = document.getElementById("main");
    let cuerpo = document.getElementById("documento");
    //Creamos el formulario y sus atributos
    let formulario = document.createElement("form");
    formulario.setAttribute("id", "citaForm");
    formulario.setAttribute("onsubmit", "validacion(event, "+ crear + ", " + index + ")");
    formulario.setAttribute("onreset", "resetearForm()");
    cuerpo.replaceChild(nuevaSection, actualSection); //Reemplazamos el contenido anterior por el formulario
    nuevaSection.appendChild(formulario);

    //Añadimos todo el contenido del formulario con atributos preparados para CSS:
    formulario.innerHTML = '<fieldset id="personalData">'
                        + '<legend>Datos personales</legend>'
                        + '<div class="datos"><div class="inputSize"><div class="datos">'
                        + '<label for="name" class="short">Nombre:</label>'
                        + '<input id="name" name="name" class="inline" required>'
                        + '</div>'
                        + '<span id="nameSpan"></span>'
                        + '</div>'
                        + '<div class="inputSize"><div class="datos">'
                        + '<label for="surname" class="short">Apellidos:</label>'
                        + '<input id="surname" name="surname" class="inline" required>'
                        + '</div>'
                        + '<span id="surnameSpan"></span>'
                        + '</div></div>'
                        + '<div class="inputSize"><div class="datos">'
                        + '<label for="document" class="short">DNI/NIE:</label>'
                        + '<input id="document" name="document" class="inline" required>'
                        + '</div>'
                        + '<span id="documentSpan"></span>'
                        + '</div>'
                        + '<div class="datos"><div class="inputSize"><div class="datos">'
                        + '<label for="number" class="short">Teléfono:</label>'
                        + '<input id="number" name="number" type="number" class="inline" required>'
                        + '</div>'
                        + '<span id="numberSpan"></span>'
                        + '</div>'
                        + '<div class="inputSize"><div class="datos">'
                        + '<label for="email">Correo electrónico:</label>'
                        + '<input id="email" name="email" type="email" class="inline">'
                        + '</div>'
                        + '<span id="emailSpan"></span>'
                        + '</div></div>'
                        + '<label for="birth">Fecha de nacimiento:</label>'
                        + '<input id="birth" name="born" type="date" required>'
                        + '<span id="birthSpan"></span>'
                        + '<label for="observations">Obersvaciones:</label>'
                        + '<textarea id="observations" name="observations"></textarea>'
                        + '</fieldset>'
                        + '<fieldset>'
                        + '<legend>Cita</legend>'
                        + '<label for="cita">Fecha de la cita:</label>'
                        + '<input id="cita" name="cita" type="datetime-local" required>'
                        + '<span id="citaSpan"></span>'
                        + '</fieldset>'
                        + '<input type="submit" class="formBTTS">'
                        + '<input type="reset" class="formBTTS">';

    //Añadimos botón de regreso al menú principal
    nuevaSection.innerHTML += '<button id="cancelBtn" onclick="menuPrincipal()">Cancelar</button>';
}


//Función para volver al contenido inicial:
function menuPrincipal(){
    let nuevaSection = document.createElement("section");
    nuevaSection.setAttribute("id", "main");
    nuevaSection.setAttribute("class", "main");
    let actualSection = document.getElementById("main");
    let cuerpo = document.getElementById("documento");
    cuerpo.replaceChild(nuevaSection, actualSection);
    nuevaSection.innerHTML = '<button id="cita" class="mainButton" onclick="crearCita(true)">Nueva cita</button>'
                            + '<button id="lista" class="mainButton" onclick="tablaCitas()">Listado de citas</button>';
}

//Creamos una ventana flotante indicando que la cita ha sido creada o eliminada
function citaCreada(crearModificar){
    //Cuando se abra el <dialog>, el resto del documento se hace más opaco
    let principal = document.getElementById("main");
    document.getElementById("documento").setAttribute("class", "fondoOscuro");

    let ventanaFlotante = document.createElement("dialog");
    ventanaFlotante.setAttribute("id", "ventanaFlotante");

    let titulo = document.createElement("h1");
    titulo.setAttribute("id", "dialogTitle");
    titulo.innerText = "Información:";

    let parrafo = document.createElement("p");
    if(crearModificar){
        parrafo.innerText = "La cita ha sido creada correctamente";
    }
    else{
        parrafo.innerText = "La cita ha sido eliminada";
    }

    let botonAceptar = document.createElement("button");
    botonAceptar.setAttribute("id", "dialogBtn");
    botonAceptar.setAttribute("onclick", "closeDialog(" + crearModificar + ")");
    botonAceptar.innerText = "Aceptar";

    ventanaFlotante.appendChild(titulo);
    ventanaFlotante.appendChild(parrafo);
    ventanaFlotante.appendChild(botonAceptar);
    principal.appendChild(ventanaFlotante);
    ventanaFlotante.showModal();

}

//Función para cerrar el cuadro de diálogo
function closeDialog(crearModificar) {
    document.getElementById("documento").removeAttribute("class");
    //Si estamos creando o modificando una cita, enviamos el formulario
    if(crearModificar){
        document.getElementById("citaForm").submit();
    }
    let ventana = document.getElementById("ventanaFlotante");
    ventana.remove();
}


//Función para crear el contenido de la tabla que contiene la lista de citas
function tablaCitas(){
    //Creamos nueva sección que sustituirá a la actual
    let nuevaSection = document.createElement("section");
    nuevaSection.setAttribute("id", "main");
    nuevaSection.setAttribute("class", "tablaCitas");

    let actualSection = document.getElementById("main");
    
    //Creamos la tabla
    let tabla = document.createElement("table");
    tabla.setAttribute("id", "tabla");
    let titulo = document.createElement("caption");
    titulo.innerText = "Lista de citas";
    tabla.appendChild(titulo);

    //Obtenemos las citas a través de las cookies
    citas = getArrayCitasCookie("listadoCitas");

    let tablaVacia = true;
    //Si no hay citas, se añade una única fila que indica que no hay citas registradas
    if(citas === null){
        let filaUnica = document.createElement("tr");
        filaUnica.innerText = "No hay ninguna cita registrada.";
        tabla.appendChild(filaUnica);
    }
    else{
        mostrarCitas(citas, tabla);
        tablaVacia = false;
    }

    nuevaSection.appendChild(tabla); //Añadimos la tabla a la nueva sección
    
    //Si la tabla contiene citas, se añaden los botones para modificar y eliminar las citas
    if(!tablaVacia){
        tablaButtons(nuevaSection);
    }
    
    //Se añade un botón a la sección para volver al menú principal
    let backButton = document.createElement("button");
    backButton.setAttribute("class", "mainButton");
    backButton.setAttribute("onclick", "menuPrincipal()");
    backButton.innerText = "Regresar";
    nuevaSection.appendChild(backButton);
    let cuerpo = document.getElementById("documento");
    cuerpo.replaceChild(nuevaSection, actualSection); //Reemplazamos secciones


    //Si la tabla no está vacía controlamos sobre que fila se hace click para luego modificar o eliminar
    if(!tablaVacia){
        //Controlamos si se hace click sobre alguna fila (cita) para activar la opción de modificar o eliminar esa cita
        const filas = document.getElementsByTagName("tr");
        let filaActivada;
        let botones = document.getElementsByClassName("tablaBts");
        for (let i = 0; i < filas.length; i++) {
            filas[i].addEventListener('click', function(event) {
                //let idFilaActivada = filas[i].getAttribute("id");            
                botones[0].disabled = false;
                botones[1].disabled = false;
                //console.log(idFilaActivada);
                filas[i].setAttribute("class", "filaSelected");
                for(let j = 0; j < filas.length; j++){
                    if(i != j){
                        if(filas[j].getAttribute("class") == "filaSelected"){
                            filas[j].setAttribute("class", "filaNotSelected");
                        }
                    }
                }
                filaActivada = filas[i];
                console.log(filaActivada);
                event.stopPropagation();
            });
        }

        //Controlamos si se hace clcik en una elemento distinto a la fila activada para desactivar la opción de modificar o eliminar
        nuevaSection.addEventListener("click", function(){
            if(filaActivada != undefined){
                if(filaActivada.getAttribute("class") == "filaSelected"){
                    filaActivada.setAttribute("class", "filaNotSelected");

                    //Compruebo si los botones están definidos (si no lo compruebo, si doy click en el botón de regresar, provoca un error)
                    if(botones[0] != undefined){
                        botones[0].disabled = true;
                        botones[1].disabled = true;
                    }
                }
            }
        })

        //Esperamos click sobre los botones de modificar o eliminar
        botones[0].addEventListener("click", function(event){
            event.stopPropagation();
            modificarCita(citas, filaActivada.getAttribute("id").split("_")[1]);
        });

        botones[1].addEventListener("click", function(event){
            event.stopPropagation();
            eliminarCita(citas, filaActivada.getAttribute("id").split("_")[1]);               
        });
    }
}


//Función que recorre las cookies y registra las citas en la tabla
function mostrarCitas(citas, tabla){

    console.log(citas);
    let iteracion = 0;
    let cuerpoTabla = document.createElement("tbody");

    citas.forEach(element => {
        let fila = document.createElement("tr");

        for (const [key, value] of Object.entries(element)) {
            //console.log(`${key} ${value}`);
            let clave = key.toUpperCase();
            let valor = value;
            let columna = document.createElement("td");
            if(key == "id"){
                columna.innerText = iteracion+1;
            }
            else{
            columna.innerText = clave + ": " + valor;
            }
            fila.appendChild(columna);
        }
        
        fila.setAttribute("id", "fila_".concat(iteracion));
        fila.setAttribute("class", "filaNotSelected");
        //fila.setAttribute("onclick", "actuar(fila_"+iteracion+", citas)");
        iteracion++;
        cuerpoTabla.appendChild(fila);
    });
    tabla.appendChild(cuerpoTabla);

}

//Función para crear los botones de eliminar y modificar cuando la tabla tiene contenido
function tablaButtons(seccion){
    let buttonsDiv = document.createElement("div");
    buttonsDiv.setAttribute("id", "tablaBtsDiv");
    let modificarButton = document.createElement("button");
    let eliminarButton = document.createElement("button");
    modificarButton.setAttribute("class", "tablaBts");
    modificarButton.setAttribute("id", "modificarBtn");

    eliminarButton.setAttribute("class", "tablaBts");
    modificarButton.disabled = true;
    eliminarButton.disabled = true;
    modificarButton.innerText = "Modificar";
    eliminarButton.innerText = "Eliminar"
    buttonsDiv.appendChild(modificarButton);
    buttonsDiv.appendChild(eliminarButton);
    seccion.appendChild(buttonsDiv);
}


//Función para modificar una cita
function modificarCita(citas, index){
    /*Para modificar la cita, accederemos al formulario de creación de la cita
    con los datos ya introducidos para cambiar el que se quiera modificar*/
    crearCita(false, index);
    let nombreInput = document.getElementById("name");
    nombreInput.value = citas[index].nombre;
    let apellidosInput = document.getElementById("surname");
    apellidosInput.value = citas[index].apellidos;
    let dniInput = document.getElementById("document");
    dniInput.value = citas[index].dni;
    let numberInput = document.getElementById("number");
    numberInput.value = citas[index].numero;
    let emailInput = document.getElementById("email");
    emailInput.value = citas[index].email;
    let birthInput = document.getElementById("birth");
    birthInput.value = citas[index].nacimiento;
    let observacionesInput = document.getElementById("observations");
    observacionesInput.value = citas[index].observaciones;
    let fechaInput = document.getElementById("cita");
    fechaInput.value = citas[index].cita;
}


//Función para eliminar cita
function eliminarCita(citas, index){
    //Eliminamos 1 citadesde el index indicado
    citas.splice(index, 1);
    
    //Actualizamos cookies
    setArrayCitasCookie("listadoCitas", citas, 100);
    
    //Si no hay citas, eliminamos las cookies
    if(citas.length == 0){
        borrarCookie("listadoCitas");
    }
    tablaCitas();       //Mostramos nuevamente el listado de citas
    citaCreada(false);  //Mostramos un <dialog> Con el mensaje "Cita eliminada"
}


//Función para resetear el formulario
function resetearForm(){
    /*Obtenemos el input para resetear estilos y el span donde se incluye 
    el texto si ha habido un error, para volver a dejarlo vacío*/
    let nombreInput = document.getElementById("name");
    nombreInput.setAttribute("class", "inline");
    let nombreSpan = document.getElementById("nameSpan");
    nombreSpan.textContent = "";

    let apellidosInput = document.getElementById("surname");
    apellidosInput.setAttribute("class", "inline");
    let apellidosSpan = document.getElementById("surnameSpan");
    apellidosSpan.textContent = "";

    let dniInput = document.getElementById("document");
    dniInput.setAttribute("class", "inline");
    let dniSpan = document.getElementById("documentSpan");
    dniSpan.textContent = "";

    let numberInput = document.getElementById("number");
    numberInput.setAttribute("class", "inline");
    let numberSpan = document.getElementById("numberSpan");
    numberSpan.textContent = "";

    let emailInput = document.getElementById("email");
    emailInput.setAttribute("class", "inline");
    let emailSpan = document.getElementById("emailSpan");
    emailSpan.textContent = "";

    let birthInput = document.getElementById("birth");
    birthInput.removeAttribute("class");
    let birthSpan = document.getElementById("birthSpan");
    birthSpan.textContent = "";

    let fechaInput = document.getElementById("cita");
    fechaInput.removeAttribute("class");
    let citaSpan = document.getElementById("citaSpan");
    citaSpan.textContent = "";
}