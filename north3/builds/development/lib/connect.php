<?php

$servername = "gistest.usask.ca";
$username = "gisuser1";
$schema = "gisuser1";
$password = "Webgis1";
$db = "nsk";

$conn = new PDO("pgsql:dbname=$db;host=$servername; port=5432; user=$username; password=$password");
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// $conn->query("SET search_path TO $schema;")->fetchAll(PDO::FETCH_ASSOC);
?>
