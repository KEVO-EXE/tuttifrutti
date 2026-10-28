// ======================================================
// TUTTI FRUTTI - MODO CASUAL
// Archivo: casual.js
// ======================================================


// ======================================================
// 1. CAPTURAMOS LOS ELEMENTOS DEL HTML
// ======================================================

const letraActual = document.getElementById("letraActual");
const numeroRonda = document.getElementById("numeroRonda");
const temporizador = document.getElementById("temporizador");

const btnIniciar = document.getElementById("btnIniciar");
const btnTerminar = document.getElementById("btnTerminar");

const mensajeEstado = document.getElementById("mensajeEstado");

const resultadoRonda = document.getElementById("resultadoRonda");
const puntajeRonda = document.getElementById("puntajeRonda");

const formJuego = document.getElementById("formJuego");


// ======================================================
// 2. CAMPOS DEL JUEGO
// ======================================================

const campos = [
    document.getElementById("nombre"),
    document.getElementById("apellido"),
    document.getElementById("objeto"),
    document.getElementById("color"),
    document.getElementById("ciudad"),
    document.getElementById("pais")
];


// ======================================================
// 3. VARIABLES GENERALES
// ======================================================

let letraSeleccionada = "";

let rondaActual = 1;

let tiempoRestante = 90;

let intervaloTiempo = null;

let juegoActivo = false;


// ID de la partida actual.
// Al principio todavía no existe.
let idPartida = null;


// ======================================================
// 4. LETRAS DISPONIBLES
// ======================================================

const letras = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "L",
    "M",
    "N",
    "O",
    "P",
    "R",
    "S",
    "T",
    "V"
];


// ======================================================
// 5. GENERAR LETRA ALEATORIA
// ======================================================

function generarLetra() {

    const posicionAleatoria = Math.floor(
        Math.random() * letras.length
    );

    letraSeleccionada = letras[posicionAleatoria];

    letraActual.textContent = letraSeleccionada;
}


// ======================================================
// 6. ACTIVAR CAMPOS
// ======================================================

function activarCampos() {

    campos.forEach(function (campo) {

        campo.disabled = false;

        campo.value = "";

        campo.classList.remove(
            "ring-4",
            "ring-green-400",
            "ring-red-400"
        );
    });


    // Colocamos el cursor en el primer campo.
    campos[0].focus();
}


// ======================================================
// 7. DESACTIVAR CAMPOS
// ======================================================

function desactivarCampos() {

    campos.forEach(function (campo) {

        campo.disabled = true;

    });
}


// ======================================================
// 8. ACTUALIZAR TEMPORIZADOR
// ======================================================

function actualizarTemporizador() {

    let minutos = Math.floor(tiempoRestante / 60);

    let segundos = tiempoRestante % 60;


    minutos = String(minutos).padStart(2, "0");

    segundos = String(segundos).padStart(2, "0");


    temporizador.textContent =
        `${minutos}:${segundos}`;
}


// ======================================================
// 9. INICIAR TEMPORIZADOR
// ======================================================

function iniciarTemporizador() {

    tiempoRestante = 90;

    actualizarTemporizador();


    intervaloTiempo = setInterval(function () {

        tiempoRestante--;

        actualizarTemporizador();


        if (tiempoRestante <= 0) {

            terminarRonda();

        }

    }, 1000);
}


// ======================================================
// 10. DETENER TEMPORIZADOR
// ======================================================

function detenerTemporizador() {

    clearInterval(intervaloTiempo);

    intervaloTiempo = null;
}


// ======================================================
// 11. INICIAR RONDA
// ======================================================

function iniciarRonda() {

    // Evita iniciar dos rondas al mismo tiempo.
    if (juegoActivo) {

        return;
    }


    juegoActivo = true;


    // Generamos la letra.
    generarLetra();


    // Mostramos número de ronda.
    numeroRonda.textContent = rondaActual;


    // Activamos campos.
    activarCampos();


    // Activamos botón terminar.
    btnTerminar.disabled = false;


    // Bloqueamos botón iniciar.
    btnIniciar.disabled = true;


    // Ocultamos resultado anterior.
    resultadoRonda.classList.add("hidden");


    mensajeEstado.textContent =
        `Ronda iniciada. Escribí palabras con la letra ${letraSeleccionada}.`;


    // Iniciamos reloj.
    iniciarTemporizador();
}


// ======================================================
// 12. NORMALIZAR TEXTO
// ======================================================

function normalizarTexto(texto) {

    return texto
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
}


// ======================================================
// 13. VALIDAR RESPUESTA
// ======================================================

function validarRespuesta(respuesta) {

    const texto = normalizarTexto(respuesta);


    if (texto === "") {

        return false;
    }


    return texto.charAt(0) === letraSeleccionada;
}


// ======================================================
// 14. CALCULAR PUNTAJE
// ======================================================

function calcularPuntaje() {

    let puntos = 0;


    campos.forEach(function (campo) {

        const respuesta = campo.value;


        if (validarRespuesta(respuesta)) {

            // Cada respuesta correcta vale 10 puntos.
            puntos += 10;

        }

    });


    return puntos;
}


// ======================================================
// 15. MOSTRAR VALIDACIÓN VISUAL
// ======================================================

function mostrarValidacionCampos() {

    campos.forEach(function (campo) {

        const respuestaCorrecta =
            validarRespuesta(campo.value);


        campo.classList.remove(
            "ring-4",
            "ring-green-400",
            "ring-red-400"
        );


        if (respuestaCorrecta) {

            campo.classList.add(
                "ring-4",
                "ring-green-400"
            );

        } else {

            campo.classList.add(
                "ring-4",
                "ring-red-400"
            );

        }

    });
}


// ======================================================
// 16. GUARDAR RONDA EN MYSQL
// ======================================================

async function guardarRonda(puntos) {

    const datosRonda = {

        id_partida: idPartida,


        // TEMPORAL
        // Después lo tomaremos desde la sesión.
        id_usuario: 1,


        numero_ronda: rondaActual,

        letra: letraSeleccionada,

        puntaje: puntos,


        respuestas: {

            Nombre:
                document.getElementById("nombre").value,

            Apellido:
                document.getElementById("apellido").value,

            Objeto:
                document.getElementById("objeto").value,

            Color:
                document.getElementById("color").value,

            Ciudad:
                document.getElementById("ciudad").value,

            País:
                document.getElementById("pais").value
        }
    };


    try {

        mensajeEstado.textContent =
            "Guardando ronda...";


            const respuesta = await fetch(
                "/PHP/guardar_ronda.php",
                {
                    method: "POST",
            
                    headers: {
                        "Content-Type": "application/json"
                    },
            
                    body: JSON.stringify(datosRonda)
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP: ${respuesta.status}`
            );
        }


        const resultado =
            await respuesta.json();


        console.log(
            "Respuesta PHP:",
            resultado
        );


        if (resultado.ok) {

            // Guardamos el ID de la partida.
            idPartida = resultado.id_partida;


            console.log(
                "ID Partida:",
                resultado.id_partida
            );


            console.log(
                "ID Ronda:",
                resultado.id_ronda
            );


            mensajeEstado.textContent =
                `Ronda guardada correctamente. Obtuviste ${puntos} puntos.`;


        } else {

            mensajeEstado.textContent =
                "La ronda terminó, pero hubo un problema al guardarla.";


            console.error(
                "Mensaje PHP:",
                resultado.mensaje
            );


            if (resultado.error) {

                console.error(
                    "Detalle:",
                    resultado.error
                );

            }

        }


    } catch (error) {

        console.error(
            "Error de comunicación con PHP:",
            error
        );


        mensajeEstado.textContent =
            "No se pudo guardar la ronda en el servidor.";

    }
}


// ======================================================
// 17. TERMINAR RONDA
// ======================================================

async function terminarRonda() {

    // Evitamos terminar dos veces.
    if (!juegoActivo) {

        return;
    }


    juegoActivo = false;


    // Detenemos reloj.
    detenerTemporizador();


    // Bloqueamos campos.
    desactivarCampos();


    // Desactivamos botón terminar.
    btnTerminar.disabled = true;


    // Mostramos colores de validación.
    mostrarValidacionCampos();


    // Calculamos puntaje.
    const puntos = calcularPuntaje();


    // Mostramos puntaje.
    puntajeRonda.textContent = puntos;


    // Mostramos panel de resultado.
    resultadoRonda.classList.remove("hidden");


    // Guardamos en MySQL.
    await guardarRonda(puntos);


    // Preparamos siguiente ronda.
    btnIniciar.textContent =
        "▶ Siguiente ronda";


    btnIniciar.disabled = false;


    rondaActual++;
}


// ======================================================
// 18. BOTÓN INICIAR
// ======================================================

btnIniciar.addEventListener(
    "click",
    function () {

        iniciarRonda();

    }
);


// ======================================================
// 19. BOTÓN TUTTI FRUTTI
// ======================================================

btnTerminar.addEventListener(
    "click",
    function () {

        terminarRonda();

    }
);


// ======================================================
// 20. EVITAR ENVÍO DEL FORMULARIO
// ======================================================

formJuego.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();

    }
);


// ======================================================
// 21. ESTADO INICIAL
// ======================================================

numeroRonda.textContent = rondaActual;

temporizador.textContent = "01:30";

mensajeEstado.textContent =
    'Presioná "Iniciar ronda" para comenzar.';