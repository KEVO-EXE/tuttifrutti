// ======================================================
// PROYECTO: TUTTI FRUTTI
// ARCHIVO: JS/main.js
// FUNCIÓN: Controlar la página principal
// ======================================================


// ======================================================
// 1. CONFIGURACIÓN
// ======================================================

// Ruta hacia PHP.
const URL_SESION = "../PHP/verificar_sesion.php";


// ======================================================
// 2. EJECUTAR AL CARGAR LA PÁGINA
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    verificarSesion();


    // ==================================================
    // BOTÓN MODO CASUAL
    // ==================================================

    const btnModoCasual =
        document.getElementById("btnModoCasual");


    if (btnModoCasual) {

        btnModoCasual.addEventListener(
            "click",
            function () {

                // Subimos desde JS/ y entramos a HTML/.
                window.location.href = "/tuttifrutti/HTML/juego-casual.html";

            }
        );
    }

});


// ======================================================
// 3. COMPROBAR SI HAY UN USUARIO CONECTADO
// ======================================================

async function verificarSesion() {

    try {

        const respuesta = await fetch(
            URL_SESION,
            {
                credentials: "same-origin",
                cache: "no-store"
            }
        );


        if (!respuesta.ok) {

            throw new Error(
                "Error al consultar la sesión."
            );
        }


        const resultado =
            await respuesta.json();


        // ==================================================
        // ELEMENTOS DEL HTML
        // ==================================================

        const botonesAcceso =
            document.getElementById(
                "botonesAcceso"
            );


        const panelUsuario =
            document.getElementById(
                "panelUsuario"
            );


        const nombreJugador =
            document.getElementById(
                "nombreJugador"
            );


        const botonComenzar =
            document.getElementById(
                "botonComenzar"
            );


        // ==================================================
        // USUARIO CON SESIÓN ACTIVA
        // ==================================================

        if (resultado.logueado === true) {


            // Ocultamos login y registro.

            if (botonesAcceso) {

                botonesAcceso.classList.add(
                    "hidden"
                );
            }


            // Mostramos panel del usuario.

            if (panelUsuario) {

                panelUsuario.classList.remove(
                    "hidden"
                );

                panelUsuario.classList.add(
                    "flex"
                );
            }


            // Mostramos nombre del usuario.

            if (
                nombreJugador &&
                resultado.usuario
            ) {

                nombreJugador.textContent =
                    "¡Hola, " +
                    resultado.usuario.nombre +
                    "!";
            }


            // ==================================================
            // BOTÓN PRINCIPAL
            // ==================================================

            if (botonComenzar) {

                botonComenzar.textContent =
                    "🎮 Jugar Modo Casual";


                    botonComenzar.setAttribute(
                        "href",
                        "/tuttifrutti/HTML/juego-casual.html"
                    );


                botonComenzar.classList.remove(
                    "cursor-not-allowed",
                    "opacity-70"
                );
            }


        } else {


            // ==================================================
            // USUARIO SIN SESIÓN ACTIVA
            // ==================================================

            if (botonesAcceso) {

                botonesAcceso.classList.remove(
                    "hidden"
                );
            }


            if (panelUsuario) {

                panelUsuario.classList.add(
                    "hidden"
                );

                panelUsuario.classList.remove(
                    "flex"
                );
            }


            // Si no está conectado,
            // lo enviamos al registro.

            if (botonComenzar) {

                botonComenzar.textContent =
                    "🚀 Comenzar a jugar";


                botonComenzar.setAttribute(
                    "href",
                    "../HTML/registro.html"
                );


                botonComenzar.classList.remove(
                    "cursor-not-allowed",
                    "opacity-70"
                );
            }

        }


    } catch (error) {

        console.error(
            "No se pudo verificar la sesión:",
            error
        );

    }

}