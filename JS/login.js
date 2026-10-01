// ==========================================================
// ARCHIVO: login.js
// PROYECTO: TUTTI FRUTTI
// ==========================================================


// Buscamos el formulario de inicio de sesión.
const formularioLogin =
    document.getElementById("formLogin");


// Escuchamos cuando el usuario intenta iniciar sesión.
formularioLogin.addEventListener(
    "submit",
    async function (evento) {

        // Evitamos que la página se recargue.
        evento.preventDefault();


        // ==================================================
        // 1. CAPTURAMOS LOS DATOS
        // ==================================================

        const nombreUsuario =
            document
                .getElementById("login_nombre_usuario")
                .value
                .trim();


        const contrasena =
            document
                .getElementById("login_contrasena")
                .value;


        const mensaje =
            document.getElementById("mensajeLogin");


        // ==================================================
        // 2. VALIDAMOS
        // ==================================================

        if (
            nombreUsuario === "" ||
            contrasena === ""
        ) {

            mostrarMensaje(
                "Ingrese usuario y contraseña.",
                "error"
            );

            return;
        }


        // ==================================================
        // 3. PREPARAMOS LOS DATOS
        // ==================================================

        const datos = new FormData();

        datos.append(
            "nombre_usuario",
            nombreUsuario
        );

        datos.append(
            "contrasena",
            contrasena
        );


        // ==================================================
        // 4. ENVIAMOS LOS DATOS A PHP
        // ==================================================

        try {

            const respuesta = await fetch(
                "php/login.php",
                {
                    method: "POST",
                    body: datos
                }
            );


            // Transformamos la respuesta PHP en JSON.
            const resultado =
                await respuesta.json();


            // ==================================================
            // 5. LOGIN CORRECTO
            // ==================================================

            if (resultado.ok) {

                mostrarMensaje(
                    resultado.mensaje,
                    "correcto"
                );


                // PHP nos indicará la página de destino.
                setTimeout(function () {

                    if (resultado.redirect) {

                        window.location.href =
                            resultado.redirect;

                    }

                }, 800);

            } else {

                // Usuario o contraseña incorrectos.
                mostrarMensaje(
                    resultado.mensaje,
                    "error"
                );

            }


        } catch (error) {

            console.error(
                "Error durante el login:",
                error
            );


            mostrarMensaje(
                "No se pudo conectar con el servidor.",
                "error"
            );

        }


        // ==================================================
        // FUNCIÓN PARA MOSTRAR MENSAJES
        // ==================================================

        function mostrarMensaje(texto, tipo) {

            if (mensaje) {

                mensaje.textContent = texto;


                if (tipo === "error") {

                    mensaje.style.color = "red";

                } else {

                    mensaje.style.color = "green";

                }

            } else {

                alert(texto);

            }

        }

    }
);