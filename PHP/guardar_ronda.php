<?php

// ======================================================
// TUTTI FRUTTI
// Archivo: guardar_ronda.php
// Guarda partida, ronda, respuestas y puntaje
// ======================================================

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


// ======================================================
// 1. RECIBIR LOS DATOS JSON
// ======================================================

$datosJSON = file_get_contents("php://input");

$datos = json_decode($datosJSON, true);


// Verificamos que hayan llegado datos
if (!$datos) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "No se recibieron datos."
    ]);

    exit;
}


// ======================================================
// 2. RECIBIR DATOS GENERALES
// ======================================================

$idPartida = $datos["id_partida"] ?? null;

$idUsuario = $_SESSION["id_usuario"]
    ?? $datos["id_usuario"]
    ?? null;

$numeroRonda = $datos["numero_ronda"] ?? 1;

$letra = strtoupper(
    trim($datos["letra"] ?? "")
);

$puntajeTotal = intval(
    $datos["puntaje"] ?? 0
);

$respuestas = $datos["respuestas"] ?? [];


// ======================================================
// 3. VALIDACIONES BÁSICAS
// ======================================================

if (!$idUsuario) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "No se pudo identificar al usuario."
    ]);

    exit;
}


if ($letra === "") {

    echo json_encode([
        "ok" => false,
        "mensaje" => "No se recibió la letra de la ronda."
    ]);

    exit;
}


if (empty($respuestas)) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "No se recibieron respuestas."
    ]);

    exit;
}


// ======================================================
// 4. EMPEZAMOS UNA TRANSACCIÓN
// ======================================================

$conexion->begin_transaction();


try {


    // ==================================================
    // 5. CREAR PARTIDA SI TODAVÍA NO EXISTE
    // ==================================================

    if (!$idPartida) {

        $estado = "en_curso";

        $sqlPartida = "
            INSERT INTO partidas
            (fecha, estado)
            VALUES
            (NOW(), ?)
        ";

        $stmtPartida = $conexion->prepare($sqlPartida);

        $stmtPartida->bind_param(
            "s",
            $estado
        );

        $stmtPartida->execute();


        // Recuperamos el ID generado
        $idPartida = $conexion->insert_id;


        // ----------------------------------------------
        // Registramos al usuario como participante
        // ----------------------------------------------

        $puntajeInicial = 0;

        $posicionInicial = 1;

        $sqlParticipante = "
            INSERT INTO participantes_partida
            (
                id_partida,
                id_usuario,
                puntaje_final,
                posicion
            )
            VALUES (?, ?, ?, ?)
        ";

        $stmtParticipante =
            $conexion->prepare($sqlParticipante);

        $stmtParticipante->bind_param(
            "iiii",
            $idPartida,
            $idUsuario,
            $puntajeInicial,
            $posicionInicial
        );

        $stmtParticipante->execute();
    }


    // ==================================================
    // 6. CREAR LA RONDA
    // ==================================================

    $sqlRonda = "
        INSERT INTO rondas
        (
            id_partida,
            numero_ronda,
            letra,
            fecha_hora_inicio,
            fecha_hora_fin
        )
        VALUES
        (
            ?,
            ?,
            ?,
            NOW(),
            NOW()
        )
    ";

    $stmtRonda = $conexion->prepare($sqlRonda);

    $stmtRonda->bind_param(
        "iis",
        $idPartida,
        $numeroRonda,
        $letra
    );

    $stmtRonda->execute();


    // Recuperamos el id_ronda
    $idRonda = $conexion->insert_id;


    // ==================================================
    // 7. RECORRER LAS RESPUESTAS
    // ==================================================

    foreach ($respuestas as $nombreCategoria => $respuesta) {


        // ----------------------------------------------
        // Buscar ID de la categoría
        // ----------------------------------------------

        $sqlCategoria = "
            SELECT id_categoria
            FROM categorias
            WHERE LOWER(nombre_categoria) = LOWER(?)
            LIMIT 1
        ";

        $stmtCategoria =
            $conexion->prepare($sqlCategoria);

        $stmtCategoria->bind_param(
            "s",
            $nombreCategoria
        );

        $stmtCategoria->execute();

        $resultadoCategoria =
            $stmtCategoria->get_result();


        // Si la categoría no existe, la ignoramos.
        if ($resultadoCategoria->num_rows === 0) {

            continue;
        }


        $categoria =
            $resultadoCategoria->fetch_assoc();

        $idCategoria =
            $categoria["id_categoria"];


        // ----------------------------------------------
        // Validar primera letra
        // ----------------------------------------------

        $respuestaLimpia = trim($respuesta);


        if ($respuestaLimpia !== "") {

            $primeraLetra =
                strtoupper(
                    mb_substr(
                        $respuestaLimpia,
                        0,
                        1,
                        "UTF-8"
                    )
                );

        } else {

            $primeraLetra = "";
        }


        // Validación simple
        $esValida =
            $primeraLetra === $letra
            ? 1
            : 0;


        // Cada respuesta válida vale 10
        $puntajeRespuesta =
            $esValida
            ? 10
            : 0;


        // ----------------------------------------------
        // Guardar respuesta
        // ----------------------------------------------

        $sqlRespuesta = "
            INSERT INTO respuestas
            (
                id_ronda,
                id_usuario,
                id_categoria,
                respuesta,
                puntaje,
                es_valida
            )
            VALUES
            (?, ?, ?, ?, ?, ?)
        ";

        $stmtRespuesta =
            $conexion->prepare($sqlRespuesta);

        $stmtRespuesta->bind_param(
            "iiisii",
            $idRonda,
            $idUsuario,
            $idCategoria,
            $respuestaLimpia,
            $puntajeRespuesta,
            $esValida
        );

        $stmtRespuesta->execute();
    }


    // ==================================================
    // 8. GUARDAR PUNTAJE DE LA RONDA
    // ==================================================

    $posicionRonda = 1;

    $sqlPuntaje = "
        INSERT INTO puntajes_ronda
        (
            id_ronda,
            id_usuario,
            puntaje_ronda,
            posicion_ronda
        )
        VALUES
        (?, ?, ?, ?)
    ";

    $stmtPuntaje =
        $conexion->prepare($sqlPuntaje);

    $stmtPuntaje->bind_param(
        "iiii",
        $idRonda,
        $idUsuario,
        $puntajeTotal,
        $posicionRonda
    );

    $stmtPuntaje->execute();


    // ==================================================
    // 9. ACTUALIZAR PUNTAJE TOTAL DE LA PARTIDA
    // ==================================================

    $sqlActualizarPuntaje = "
        UPDATE participantes_partida
        SET puntaje_final = puntaje_final + ?
        WHERE id_partida = ?
        AND id_usuario = ?
    ";

    $stmtActualizar =
        $conexion->prepare($sqlActualizarPuntaje);

    $stmtActualizar->bind_param(
        "iii",
        $puntajeTotal,
        $idPartida,
        $idUsuario
    );

    $stmtActualizar->execute();


    // ==================================================
    // 10. CONFIRMAR TODO
    // ==================================================

    $conexion->commit();


    echo json_encode([

        "ok" => true,

        "mensaje" => "Ronda guardada correctamente.",

        "id_partida" => $idPartida,

        "id_ronda" => $idRonda,

        "numero_ronda" => $numeroRonda,

        "puntaje" => $puntajeTotal

    ]);


} catch (Throwable $error) {


    // ==================================================
    // SI ALGO FALLA, CANCELAMOS TODO
    // ==================================================

    $conexion->rollback();


    echo json_encode([

        "ok" => false,

        "mensaje" => "Error al guardar la ronda.",

        "error" => $error->getMessage()

    ]);
}