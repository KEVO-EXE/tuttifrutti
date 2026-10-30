
// ======================================================
// PROYECTO: TUTTI FRUTTI
// ARCHIVO: JS/auth.js
// FUNCIONES: Registro e inicio de sesión
// ======================================================


// ======================================================
// 1. RUTAS DEL BACKEND
// ======================================================

// Las rutas se resuelven desde la página HTML.
//
// HTML/registro.html → ../PHP/registro.php
// HTML/login.html    → ../PHP/login.php

const API = {

    registro: "/PHP/registro.php",

    login: "/PHP/login.php"

};


// ======================================================
// 2. DETECTAR LOS FORMULARIOS
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    const formularioRegistro =
        document.getElementById("formRegistro");

    const formularioLogin =
        document.getElementById("formLogin");


    // Si existe el registro, activamos su evento.

    if (formularioRegistro) {

        formularioRegistro.addEventListener(
            "submit",
            registrarUsuario
        );

    }


    // Si existe el login, activamos su evento.

    if (formularioLogin) {

        formularioLogin.addEventListener(
            "submit",
            iniciarSesion
        );

    }

});


// ======================================================
// 3. FUNCIÓN GENERAL PARA MOSTRAR MENSAJES
// ======================================================

function mostrarMensaje(idElemento, texto, correcto = false) {

    const elemento = document.getElementById(idElemento);

    if (!elemento) {

        console.log(texto);

        return;

    }

    elemento.textContent = texto;

    elemento.style.color = correcto
        ? "#4ade80"
        : "#f87171";

}


// ======================================================
// 4. ENVIAR DATOS A PHP
// ======================================================

async function enviarDatos(url, datos) {

    const respuesta = await fetch(url, {

        method: "POST",

        body: datos,

        credentials: "same-origin"

    });


    // Intentamos interpretar el JSON enviado por PHP.

    const resultado = await respuesta.json();


    if (!respuesta.ok) {

        throw new Error(
            resultado.mensaje || "Error del servidor."
        );

    }


    return resultado;

}


// ======================================================
// 5. REGISTRO DE USUARIOS
// ======================================================

async function registrarUsuario(evento) {

    evento.preventDefault();


    // Capturamos el formulario.

    const formulario = evento.currentTarget;


    // Capturamos los campos.

    const nombre =
        document.getElementById("nombre").value.trim();

    const apellido =
        document.getElementById("apellido").value.trim();

    const nombreUsuario =
        document.getElementById("nombre_usuario").value.trim();

    const contrasena =
        document.getElementById("contrasena").value;

    const confirmarContrasena =
        document.getElementById("confirmar_contrasena").value;


    // ==================================================
    // VALIDAR CAMPOS
    // ==================================================

    if (
        !nombre ||
        !apellido ||
        !nombreUsuario ||
        !contrasena ||
        !confirmarContrasena
    ) {

        mostrarMensaje(
            "mensajeRegistro",
            "Todos los campos son obligatorios."
        );

        return;

    }


    if (contrasena.length < 6) {

        mostrarMensaje(
            "mensajeRegistro",
            "La contraseña debe tener al menos 6 caracteres."
        );

        return;

    }


    if (contrasena !== confirmarContrasena) {

        mostrarMensaje(
            "mensajeRegistro",
            "Las contraseñas no coinciden."
        );

        return;

    }


    // ==================================================
    // PREPARAR DATOS
    // ==================================================

    const datos = new FormData();

    datos.append("nombre", nombre);

    datos.append("apellido", apellido);

    datos.append("nombre_usuario", nombreUsuario);

    datos.append("contrasena", contrasena);


    // Deshabilitamos el botón durante la petición.

    const boton = formulario.querySelector(
        'button[type="submit"]'
    );

    if (boton) boton.disabled = true;


    // ==================================================
    // ENVIAR A REGISTRO.PHP
    // ==================================================

    try {

        const resultado = await enviarDatos(
            API.registro,
            datos
        );


        if (resultado.ok) {

            mostrarMensaje(
                "mensajeRegistro",
                resultado.mensaje,
                true
            );


            formulario.reset();


            // Redirigimos al login.
            // La ruta se interpreta desde la página HTML.

            setTimeout(function () {

                window.location.href =
                    resultado.redirect || "/HTML/login.html";

            }, 1200);

        } else {

            mostrarMensaje(
                "mensajeRegistro",
                resultado.mensaje
            );

        }


    } catch (error) {

        console.error("Error de registro:", error);


        mostrarMensaje(
            "mensajeRegistro",
            "No se pudo completar el registro. Revisá PHP y MySQL."
        );

    } finally {

        if (boton) boton.disabled = false;

    }

}


// ======================================================
// 6. INICIO DE SESIÓN
// ======================================================

async function iniciarSesion(evento) {

    evento.preventDefault();


    const formulario = evento.currentTarget;


    // Capturamos los datos del login.

    const nombreUsuario =
        document.getElementById("login_nombre_usuario")
            .value.trim();

    const contrasena =
        document.getElementById("login_contrasena").value;


    // ==================================================
    // VALIDACIÓN
    // ==================================================

    if (!nombreUsuario || !contrasena) {

        mostrarMensaje(
            "mensajeLogin",
            "Ingresá usuario y contraseña."
        );

        return;

    }


    // ==================================================
    // PREPARAR DATOS
    // ==================================================

    const datos = new FormData();

    datos.append("nombre_usuario", nombreUsuario);

    datos.append("contrasena", contrasena);


    const boton = formulario.querySelector(
        'button[type="submit"]'
    );

    if (boton) boton.disabled = true;


    // ==================================================
    // ENVIAR A LOGIN.PHP
    // ==================================================

    try {

        const resultado = await enviarDatos(
            API.login,
            datos
        );


        if (resultado.ok) {

            mostrarMensaje(
                "mensajeLogin",
                resultado.mensaje,
                true
            );


            // PHP ya creó la sesión.
            // Volvemos a la página principal.

            setTimeout(function () {

                window.location.href =
                    resultado.redirect || "/HTML/index.html";

            }, 800);

        } else {

            mostrarMensaje(
                "mensajeLogin",
                resultado.mensaje
            );

        }


    } catch (error) {

        console.error("Error de login:", error);


        mostrarMensaje(
            "mensajeLogin",
            "No se pudo iniciar sesión. Revisá el servidor."
        );

    } finally {

        if (boton) boton.disabled = false;

    }

}