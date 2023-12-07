//Convertimos el objeto en un dato de tipo String para almacenarlo en las cookies.
function citaToString(cita) {
    return JSON.stringify(cita);
}

//Convertimos el string que almacenan las cookies en el objeto Cita.
function stringToCita(str) {
    return JSON.parse(str);
}

// Función para guardar un array de objetos en una cookie
function setArrayCitasCookie(name, array, daysToExpire) {
    const expires = daysToExpire ? "; expires=" + new Date(new Date().getTime() + daysToExpire * 24 * 60 * 60 * 1000).toUTCString() : "";
    //ordenarCitas();
    document.cookie = name + "=" + citaToString(array) + expires + "; path=/";
}

// Función para obtener un array de objetos de una cookie
function getArrayCitasCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return stringToCita(cookie.substring(nameEQ.length, cookie.length));
        }
    }
    return null;
}

//Función para borrar las cookies
function borrarCookie(name) {
    // Crear una nueva fecha en el pasado
    const fechaExpiracionPasada = new Date(0);

    // Convertir la fecha a una cadena UTC para la cookie
    const cadenaFechaExpiracionPasada = fechaExpiracionPasada.toUTCString();

    // Establecer la cookie con la fecha de expiración en el pasado
    document.cookie = name + "=; expires=" + cadenaFechaExpiracionPasada + "; path=/";
}
