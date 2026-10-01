// ==========================================================
// ARCHIVO: registro.js
// PROYECTO: TUTTI FRUTTI
// ==========================================================


// Buscamos el formulario de registro por su ID.
const formularioRegistro = document.getElementById("formRegistro");


// Escuchamos el evento "submit".
// Se ejecutará cuando el usuario presione el botón Registrarse.
formularioRegistro.addEventListener("submit", async function (evento) {

    // Evitamos que el formulario recargue la página.
    evento.preventDefault();


    // ======================================================
    // 1. CAPTURAMOS LOS DATOS DEL FORMULARIO
    // ======================================================

    const nombre = document.getElementById("nombre").value.trim();

    const apellido = document.getElementById("apellido").value.trim();

    const nombreUsuario =
        document.getElementById("nombre_usuario").value.trim();

    const contrasena =
        document.getElementById("contrasena").value;

    const confirmarContrasena =
        document.getElementById("confirmar_contrasena").value;


    // Lugar donde mostraremos mensajes.
    const mensaje =
        document.getElementById("mensajeRegistro");


    // ======================================================
    // 2. VALIDAR CAMPOS VACÍOS
    // ======================================================

    if (
        nombre === "" ||
        apellido === "" ||
        nombreUsuario === "" ||
        contrasena === "" ||
        confirmarContrasena === ""
    ) {

        mostrarMensaje(
            "Todos los campos son obligatorios.",
            "error"
        );

        return;
    }


    // ======================================================
    // 3. VALIDAR LONGITUD DE CONTRASEÑA
    // ======================================================

    if (contrasena.length < 6) {

        mostrarMensaje(
            "La contraseña debe tener al menos 6 caracteres.",
            "error"
        );

        return;
    }


    // ======================================================
    // 4. COMPROBAR LAS DOS CONTRASEÑAS
    // ======================================================

    if (contrasena !== confirmarContrasena) {

        mostrarMensaje(
            "Las contraseñas no coinciden.",
            "error"
        );

        return;
    }


    // ======================================================
    // 5. PREPARAMOS LOS DATOS PARA PHP
    // ======================================================

    const datos = new FormData();

    datos.append("nombre", nombre);

    datos.append("apellido", apellido);

    datos.append(
        "nombre_usuario",
        nombreUsuario
    );

    datos.append(
        "contrasena",
        contrasena
    );


    // ======================================================
    // 6. ENVIAMOS LOS DATOS A PHP
    // ======================================================

    try {

        const respuesta = await fetch(
            "php/registro.php",
            {
                method: "POST",
                body: datos
            }
        );


        // Convertimos la respuesta PHP a JSON.
        const resultado = await respuesta.json();


        // ==================================================
        // 7. PHP RESPONDIÓ CORRECTAMENTE
        // ==================================================

        if (resultado.ok) {

            mostrarMensaje(
                resultado.mensaje,
                "correcto"
            );


            // Limpiamos el formulario.
            formularioRegistro.reset();


            // Esperamos un momento antes de redirigir.
            setTimeout(function () {

                // PHP puede indicarnos a dónde ir.
                if (resultado.redirect) {

                    window.location.href =
                        resultado.redirect;

                }

            }, 1500);

        } else {

            // PHP respondió, pero ocurrió algún problema.
            mostrarMensaje(
                resultado.mensaje,
                "error"
            );

        }


    } catch (error) {

        console.error(
            "Error al registrar:",
            error
        );


        mostrarMensaje(
            "No se pudo conectar con el servidor.",
            "error"
        );

    }


    // ======================================================
    // FUNCIÓN PARA MOSTRAR MENSAJES
    // ======================================================

    function mostrarMensaje(texto, tipo) {

        // Si existe el contenedor de mensajes...
        if (mensaje) {

            mensaje.textContent = texto;


            if (tipo === "error") {

                mensaje.style.color = "red";

            } else {

                mensaje.style.color = "green";

            }

        } else {

            // Si todavía no tenemos el div de mensajes,
            // usamos alert como alternativa.
            alert(texto);

        }

    }

});