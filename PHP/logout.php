<?php
// FUNCIÓN: Cerrar sesión

// Iniciamos la sesión.
session_start();

// ======================================================
// 1. VACIAR VARIABLES DE SESIÓN
// ======================================================

$_SESSION = [];

// ======================================================
// 2. ELIMINAR LA COOKIE DE SESIÓN
// ======================================================

if (ini_get("session.use_cookies")) {

    $parametros = session_get_cookie_params();

    setcookie(

        session_name(),
        "",
        time() - 42000,

        $parametros["path"],
        $parametros["domain"],
        $parametros["secure"],
        $parametros["httponly"]
    );
}

// ======================================================
// 3. DESTRUIR LA SESIÓN
// ======================================================
session_destroy();

// ======================================================
// 4. REDIRIGIR AL LOGIN
// ======================================================

// Ruta corregida:
// PHP/logout.php → ../HTML/login.html

header("Location: ../HTML/login.html");
exit;
?>