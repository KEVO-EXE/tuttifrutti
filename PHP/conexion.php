<?php

// CONFIGURACION al Servidor de MySQL. Como estamos trabajando con XAMPP usamos localhost.
$servidor = "localhost";
// Nombre de nuestra base de datos.
$baseDatos = "tuttifrutti_juego";
// Usuario por defecto de MySQL en XAMPP.
$usuario = "root";
// Normalmente XAMPP no tiene contraseña para root.
$contrasena = "";

try {

    // Creamos la conexión utilizando PDO.
    $conexion = new PDO(
        "mysql:host=$servidor;dbname=$baseDatos;charset=utf8mb4",
        $usuario,
        $contrasena
    );

    // Configuramos PDO para que nos muestre los errores.
    $conexion->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

} catch (PDOException $error) {
    // Si ocurre un error, detenemos el programa.
    die("Error de conexión: " . $error->getMessage());
}

?>