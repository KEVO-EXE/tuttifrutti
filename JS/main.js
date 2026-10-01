
// ======================================================
// PROYECTO: TUTTI FRUTTI
// ARCHIVO: JS/main.js
// FUNCIÓN: Controlar la página principal
// ======================================================


// ======================================================
// 1. CONFIGURACIÓN
// ======================================================

// Ruta corregida desde HTML/ hacia PHP/.

const URL_SESION = "../PHP/verificar_sesion.php";


// ======================================================
// 2. EJECUTAR AL CARGAR LA PÁGINA
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    verificarSesion();

});

// ======================================================
// BOTÓN MODO CASUAL
// ======================================================

const btnModoCasual = document.getElementById("btnModoCasual");

if (btnModoCasual) {

    btnModoCasual.addEventListener("click", function () {

        window.location.href = "/JS/juego-casual.html";

    });

}

// ======================================================
// 3. COMPROBAR SI HAY UN USUARIO CONECTADO
// ======================================================

async function verificarSesion() {

    try {

        const respuesta = await fetch(URL_SESION, {

            credentials: "same-origin",

            cache: "no-store"

        });


        if (!respuesta.ok) {

            throw new Error("Error al consultar la sesión.");

        }


        const resultado = await respuesta.json();


        // Capturamos los elementos HTML.

        const botonesAcceso =
            document.getElementById("botonesAcceso");

        const panelUsuario =
            document.getElementById("panelUsuario");

        const nombreJugador =
            document.getElementById("nombreJugador");

        const botonComenzar =
            document.getElementById("botonComenzar");


        // ==================================================
        // USUARIO CON SESIÓN ACTIVA
        // ==================================================

        if (resultado.logueado === true) {

            // Ocultamos los botones de login y registro.

            if (botonesAcceso) {

                botonesAcceso.classList.add("hidden");

            }


            // Mostramos el panel del usuario.

            if (panelUsuario) {

                panelUsuario.classList.remove("hidden");

                panelUsuario.classList.add("flex");

            }


            // Mostramos el nombre.

            if (nombreJugador) {

                nombreJugador.textContent =
                    "¡Hola, " + resultado.usuario.nombre + "!";

            }


            // El juego todavía está pendiente de implementar.

            if (botonComenzar) {

                botonComenzar.textContent = "🎮 Próximamente";

                botonComenzar.removeAttribute("href");

                botonComenzar.classList.add(
                    "cursor-not-allowed",
                    "opacity-70"
                );

            }

        } else {

            // ==================================================
            // USUARIO SIN SESIÓN ACTIVA
            // ==================================================

            if (botonesAcceso) {

                botonesAcceso.classList.remove("hidden");

            }


            if (panelUsuario) {

                panelUsuario.classList.add("hidden");

                panelUsuario.classList.remove("flex");

            }

        }


    } catch (error) {

        console.error(
            "No se pudo verificar la sesión:",
            error
        );

    }

}