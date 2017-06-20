<?php

require_once("connect.php");

$query_output = './cache/';
$table = "north_points_benben";
if(!file_exists($query_output)) mkdir($query_output, 0777, true);

try{
	$target = $query_output . "geo.query";
	if(file_exists($target)){
		header('Content-Type: application/json');
		echo file_get_contents($target);
		return;
	}

	$sql = "SELECT uid_join as id,place_and_region as name,type,icon,round(cast(ST_XMax(ST_Transform(geom,4326)) as numeric),5) as lng, round(cast(ST_YMax(ST_Transform(geom,4326)) as numeric),5) as lat FROM ${schema}.$table ORDER BY id";

	$sql_res = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

	$res = json_encode($sql_res);
	file_put_contents($target, $res); // cache the result
	header('Content-Type: application/json');
	print $res;
}
catch(PDOException $e)
{
      echo "Error: " . $e->getMessage();
}
?>
