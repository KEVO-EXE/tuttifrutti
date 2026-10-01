
<?php

// ======================================================
// PROYECTO: TUTTI FRUTTI
// ARCHIVO: verificar_sesion.php
// FUNCIÓN: Consultar el estado de la sesión
// ======================================================


// Iniciamos la sesión.
session_start();


// Devolvemos los datos en formato JSON.
header("Content-Type: application/json; charset=utf-8");


// Evitamos almacenar en caché esta respuesta.
header("Cache-Control: no-store, no-cache, must-revalidate");


// ======================================================
// 1. VERIFICAR SI EXISTE UNA SESIÓN ACTIVA
// ======================================================

if (isset($_SESSION["id_usuario"])) {


    // ==================================================
    // 2. USUARIO CONECTADO
    // ==================================================

    echo json_encode([

        "logueado" => true,

        "usuario" => [

            "id_usuario" => $_SESSION["id_usuario"],

            "nombre" => $_SESSION["nombre"],

            "apellido" => $_SESSION["apellido"],

            "nombre_usuario" => $_SESSION["nombre_usuario"],

            "id_rol" => $_SESSION["id_rol"],

            "rol" => $_SESSION["nombre_rol"]

        ]

    ]);


} else {


    // ==================================================
    // 3. USUARIO NO CONECTADO
    // ==================================================

    echo json_encode([

        "logueado" => false

    ]);

}

?>