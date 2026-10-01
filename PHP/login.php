<?php
// FUNCIÓN: Iniciar sesión de usuarios

// Iniciamos la sesión PHP.
session_start();

// Indicamos que responderemos en formato JSON.
header("Content-Type: application/json; charset=utf-8");


// ======================================================
// 1. COMPROBAR EL MÉTODO POST
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
// 2. RECIBIR LOS DATOS DEL LOGIN
// ======================================================

$nombreUsuario = trim($_POST["nombre_usuario"] ?? "");
$contrasena = $_POST["contrasena"] ?? "";


// ======================================================
// 3. VALIDAR CAMPOS
// ======================================================

if ($nombreUsuario === "" || $contrasena === "") {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Ingresá usuario y contraseña."
    ]);
    exit;
}

// ======================================================
// 4. CONECTAR A MYSQL
// ======================================================

try {
    require_once __DIR__ . "/conexion.php";

    // ==================================================
    // 5. BUSCAR EL USUARIO Y SU ROL
    // ==================================================

    $consulta = $conexion->prepare(

        "SELECT u.id_usuario,u.nombre,u.apellido,u.nombre_usuario,u.contrasena,u.id_rol,r.nombre_rol
         FROM usuarios AS u INNER JOIN roles AS r ON u.id_rol = r.id_rol  WHERE u.nombre_usuario = :nombre_usuario
         LIMIT 1"
    );

    $consulta->execute([":nombre_usuario" => $nombreUsuario]);
    $usuario = $consulta->fetch();

    // ==================================================
    // 6. COMPROBAR USUARIO Y CONTRASEÑA
    // ==================================================

    if (!$usuario || !password_verify($contrasena, $usuario["contrasena"])
    ) {
        echo json_encode(["ok" => false,"mensaje" => "Usuario o contraseña incorrectos."]);
        exit;
    }

    // ==================================================
    // 7. CREAR LA SESIÓN
    // ==================================================

    // Regeneramos el identificador por seguridad.
    session_regenerate_id(true);

    // Guardamos los datos necesarios del jugador.
    $_SESSION["id_usuario"] = $usuario["id_usuario"];
    $_SESSION["nombre"] = $usuario["nombre"];
    $_SESSION["apellido"] = $usuario["apellido"];
    $_SESSION["nombre_usuario"] = $usuario["nombre_usuario"];
    $_SESSION["id_rol"] = $usuario["id_rol"];
    $_SESSION["nombre_rol"] = $usuario["nombre_rol"];

    // ==================================================
    // 8. DEVOLVER RESPUESTA A AUTH.JS
    // ==================================================

    echo json_encode([
        "ok" => true,
        "mensaje" => "¡Inicio de sesión correcto!",
        "redirect" => "index.html"
    ]);

} catch (Throwable $error) {
    // Registramos el error sin mostrar información interna.
    error_log($error->getMessage());
    http_response_code(500);
    echo json_encode(["ok" => false, "mensaje" => "Ocurrió un error al iniciar sesión."]);
}
?>