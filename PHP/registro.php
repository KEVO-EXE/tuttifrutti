
<?php

// ======================================================
// PROYECTO: TUTTI FRUTTI
// ARCHIVO: registro.php
// FUNCIÓN: Registrar nuevos usuarios en MySQL
// ======================================================


// Indicamos que devolveremos una respuesta JSON.
header("Content-Type: application/json; charset=utf-8");


// ======================================================
// 1. COMPROBAR QUE LA PETICIÓN SEA POST
// ======================================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([

        "ok" => false,

        "mensaje" => "Método no permitido."

    ]);

    exit;

}


// ======================================================
// 2. RECIBIR LOS DATOS DESDE AUTH.JS
// ======================================================

$nombre = trim($_POST["nombre"] ?? "");

$apellido = trim($_POST["apellido"] ?? "");

$nombreUsuario = trim($_POST["nombre_usuario"] ?? "");

$contrasena = $_POST["contrasena"] ?? "";


// ======================================================
// 3. VALIDAR CAMPOS OBLIGATORIOS
// ======================================================

if (
    $nombre === "" ||
    $apellido === "" ||
    $nombreUsuario === "" ||
    $contrasena === ""
) {

    echo json_encode([

        "ok" => false,

        "mensaje" => "Todos los campos son obligatorios."

    ]);

    exit;

}


// ======================================================
// 4. VALIDAR CONTRASEÑA
// ======================================================

if (strlen($contrasena) < 6) {

    echo json_encode([

        "ok" => false,

        "mensaje" => "La contraseña debe tener al menos 6 caracteres."

    ]);

    exit;

}


// ======================================================
// 5. VALIDAR LONGITUD DE LOS DATOS
// ======================================================

if (
    mb_strlen($nombre) > 80 ||
    mb_strlen($apellido) > 80 ||
    mb_strlen($nombreUsuario) > 90
) {

    echo json_encode([

        "ok" => false,

        "mensaje" => "Uno de los campos supera la longitud permitida."

    ]);

    exit;

}


// ======================================================
// 6. CONECTAR CON LA BASE DE DATOS
// ======================================================

try {

    require_once __DIR__ . "/conexion.php";


    // ==================================================
    // 7. VERIFICAR SI YA EXISTE EL USUARIO
    // ==================================================

    $consulta = $conexion->prepare(

        "SELECT id_usuario
         FROM usuarios
         WHERE nombre_usuario = :nombre_usuario
         LIMIT 1"

    );


    $consulta->execute([

        ":nombre_usuario" => $nombreUsuario

    ]);


    $usuarioExistente = $consulta->fetch();


    if ($usuarioExistente) {

        echo json_encode([

            "ok" => false,

            "mensaje" => "Ese nombre de usuario ya está registrado."

        ]);

        exit;

    }


    // ==================================================
    // 8. BUSCAR EL ROL JUGADOR
    // ==================================================

    $consultaRol = $conexion->prepare(

        "SELECT id_rol
         FROM roles
         WHERE nombre_rol = :nombre_rol
         LIMIT 1"

    );


    $consultaRol->execute([

        ":nombre_rol" => "Jugador"

    ]);


    $rol = $consultaRol->fetch();


    if (!$rol) {

        echo json_encode([

            "ok" => false,

            "mensaje" => "No existe el rol Jugador en la base de datos."

        ]);

        exit;

    }


    // ==================================================
    // 9. PROTEGER LA CONTRASEÑA
    // ==================================================

    $contrasenaHash = password_hash(

        $contrasena,

        PASSWORD_DEFAULT

    );


    // ==================================================
    // 10. INSERTAR EL USUARIO EN MYSQL
    // ==================================================

    $consulta = $conexion->prepare(

        "INSERT INTO usuarios
        (
            nombre,
            apellido,
            nombre_usuario,
            contrasena,
            id_rol
        )

        VALUES
        (
            :nombre,
            :apellido,
            :nombre_usuario,
            :contrasena,
            :id_rol
        )"

    );


    $consulta->execute([

        ":nombre" => $nombre,

        ":apellido" => $apellido,

        ":nombre_usuario" => $nombreUsuario,

        ":contrasena" => $contrasenaHash,

        ":id_rol" => $rol["id_rol"]

    ]);


    // ==================================================
    // 11. RESPONDER A JAVASCRIPT
    // ==================================================

    echo json_encode([

        "ok" => true,

        "mensaje" => "¡Usuario registrado correctamente!",

        "redirect" => "login.html"

    ]);


} catch (PDOException $error) {

    // Registramos el error internamente.
    error_log($error->getMessage());


    // Código de error por integridad, por ejemplo
    // un usuario duplicado.

    if ($error->getCode() == "23000") {

        echo json_encode([

            "ok" => false,

            "mensaje" => "El usuario ya existe o contiene datos inválidos."

        ]);

    } else {

        http_response_code(500);

        echo json_encode([

            "ok" => false,

            "mensaje" => "Ocurrió un error al registrar el usuario."

        ]);

    }


} catch (Throwable $error) {

    error_log($error->getMessage());

    http_response_code(500);

    echo json_encode([

        "ok" => false,

        "mensaje" => "Error interno del servidor."

    ]);

}

?>