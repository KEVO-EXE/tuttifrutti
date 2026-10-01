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
// 2. CAPTURAMOS LOS CAMPOS DEL JUEGO
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
// 3. VARIABLES GENERALES DEL JUEGO
// ======================================================

let letraSeleccionada = "";

let rondaActual = 1;

let tiempoRestante = 90;

let intervaloTiempo = null;

let juegoActivo = false;


// Guardamos el ID de la partida actual.
// Al comenzar será null.
// PHP creará la partida en la primera ronda.
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
// 5. GENERAR UNA LETRA ALEATORIA
// ======================================================

function generarLetra() {

    const posicionAleatoria = Math.floor(
        Math.random() * letras.length
    );

    letraSeleccionada = letras[posicionAleatoria];

    letraActual.textContent = letraSeleccionada;
}


// ======================================================
// 6. ACTIVAR LOS CAMPOS
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
// 7. DESACTIVAR LOS CAMPOS
// ======================================================

function desactivarCampos() {

    campos.forEach(function (campo) {

        campo.disabled = true;
    });
}


// ======================================================
// 8. ACTUALIZAR EL TEMPORIZADOR
// ======================================================

function actualizarTemporizador() {

    let minutos = Math.floor(tiempoRestante / 60);

    let segundos = tiempoRestante % 60;


    minutos = String(minutos).padStart(2, "0");

    segundos = String(segundos).padStart(2, "0");


    temporizador.textContent = `${minutos}:${segundos}`;
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


        // Si el tiempo llega a cero,
        // termina automáticamente la ronda.
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
// 11. INICIAR UNA NUEVA RONDA
// ======================================================

function iniciarRonda() {

    // Evita iniciar dos rondas al mismo tiempo.
    if (juegoActivo) {

        return;
    }


    juegoActivo = true;


    // Generamos una nueva letra.
    generarLetra();


    // Mostramos el número de ronda.
    numeroRonda.textContent = rondaActual;


    // Activamos los campos.
    activarCampos();


    // Activamos el botón terminar.
    btnTerminar.disabled = false;


    // Desactivamos temporalmente el botón iniciar.
    btnIniciar.disabled = true;


    // Ocultamos el resultado anterior.
    resultadoRonda.classList.add("hidden");


    // Mostramos mensaje.
    mensajeEstado.textContent =
        `Ronda iniciada. Escribí palabras con la letra ${letraSeleccionada}.`;


    // Iniciamos el reloj.
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


    // Campo vacío.
    if (texto === "") {

        return false;
    }


    // Comprobamos que empiece con la letra seleccionada.
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

            // Primera versión:
            // cada respuesta correcta vale 10 puntos.

            puntos += 10;
        }

    });


    return puntos;
}


// ======================================================
// 15. MARCAR RESPUESTAS
// ======================================================

function mostrarValidacionCampos() {

    campos.forEach(function (campo) {

        const respuestaCorrecta =
            validarRespuesta(campo.value);


        // Eliminamos marcas anteriores.
        campo.classList.remove(
            "ring-4",
            "ring-green-400",
            "ring-red-400"
        );


        if (respuestaCorrecta) {

            // Respuesta correcta.
            campo.classList.add(
                "ring-4",
                "ring-green-400"
            );

        } else {

            // Respuesta incorrecta o vacía.
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

    // Preparamos toda la información que enviaremos a PHP.
    const datosRonda = {

        // La primera vez será null.
        // PHP creará una nueva partida.
        id_partida: idPartida,


        // ==================================================
        // TEMPORAL PARA LA PRUEBA
        // ==================================================
        // Después lo reemplazaremos por el usuario
        // que inició sesión.
        id_usuario: 1,


        numero_ronda: rondaActual,

        letra: letraSeleccionada,

        puntaje: puntos,


        // Respuestas ingresadas por el jugador.
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
            "php/guardar_ronda.php",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(datosRonda)
            }
        );


        // ==================================================
        // VERIFICAMOS RESPUESTA HTTP
        // ==================================================

        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP: ${respuesta.status}`
            );
        }


        // Convertimos la respuesta PHP en objeto JavaScript.
        const resultado = await respuesta.json();


        console.log(
            "Respuesta PHP:",
            resultado
        );


        // ==================================================
        // SI PHP GUARDÓ CORRECTAMENTE
        // ==================================================

        if (resultado.ok) {

            // Guardamos el ID de la partida.
            // Las próximas rondas usarán esta misma partida.
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


            // PHP respondió, pero informó un error.
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


        // ==================================================
        // ERROR DE CONEXIÓN O RESPUESTA
        // ==================================================

        console.error(
            "Error de comunicación con PHP:",
            error
        );


        mensajeEstado.textContent =
            "No se pudo guardar la ronda en el servidor.";
    }
}


// ======================================================
// 17. TERMINAR LA RONDA
// ======================================================

async function terminarRonda() {

    // Evitamos finalizar dos veces.
    if (!juegoActivo) {

        return;
    }


    juegoActivo = false;


    // Detenemos el reloj.
    detenerTemporizador();


    // Desactivamos los campos.
    desactivarCampos();


    // Desactivamos botón terminar.
    btnTerminar.disabled = true;


    // Validamos visualmente las respuestas.
    mostrarValidacionCampos();


    // Calculamos el puntaje.
    const puntos = calcularPuntaje();


    // Mostramos puntaje.
    puntajeRonda.textContent = puntos;


    // Mostramos el cuadro de resultados.
    resultadoRonda.classList.remove("hidden");


    // ==================================================
    // GUARDAMOS EN MYSQL
    // ==================================================

    await guardarRonda(puntos);


    // Cambiamos texto del botón.
    btnIniciar.textContent =
        "▶ Siguiente ronda";


    // Volvemos a habilitarlo.
    btnIniciar.disabled = false;


    // Aumentamos la ronda.
    rondaActual++;
}


// ======================================================
// 18. EVENTO BOTÓN INICIAR
// ======================================================

btnIniciar.addEventListener(
    "click",
    function () {

        iniciarRonda();
    }
);


// ======================================================
// 19. EVENTO BOTÓN TUTTI FRUTTI
// ======================================================

btnTerminar.addEventListener(
    "click",
    function () {

        terminarRonda();
    }
);


// ======================================================
// 20. EVITAR QUE ENTER ENVÍE EL FORMULARIO
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
