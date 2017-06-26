<?php
date_default_timezone_set('America/Regina');

require_once("connect.php");
require_once("func_svg.php");

ini_set('display_errors', 'On');

$cached_folder = './cache/';
if(!file_exists($cached_folder)) mkdir($cached_folder, 0777, true);

// load the config json file
$config_global = 0;
$spatial_table = '';

/*  ---- TEST LINK ----
	http://gistest.usask.ca/git/imm3/lib/get_meta.php?f=meta
*/

function _updateConfig($config){

	global $conn, $schema, $config_global;

	// if this is an associative array
	if(count(array_filter(array_keys($config), 'is_string')) > 0){

		if(array_key_exists('server',$config)){

			$table1 = $config["server"]["table1"];
			$table1_id = $config["server"]["table1_id"];

			/* update year */
			$sql = "select count(0) as n from information_schema.columns WHERE table_schema = '$schema' AND table_name = '$table1' AND column_name = 'year'";
			try{
				$year_col = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC)[0];
			}catch(PDOException $e){
			  return "Error: " . $e->getMessage();
			}

			if($year_col["n"] == 1){

				$sql = "select distinct year from $table1 order by year";
				$years = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
				$years_arr = [];
				foreach ($years as $year) {
					$years_arr[] = (string) $year["year"];
				}

				// updateConfigById($config_global,$config["id"], "year", implode(", ", $years_arr));
				updateConfigById($config_global,$config["id"], "year", $years_arr);

			}else{
				throw new Exception("Illegal schema for table [$table1]");
			}
		}
		if(array_key_exists('children',$config)){
			$cs = $config['children'];
			for ($i=0; $i < count($cs); $i++) {
				_updateConfig($cs[$i]);
			}
		}
	}else{ // this is a sequential array
		for ($i=0; $i < count($config); $i++) {
			_updateConfig($config[$i]);
		}
	}
}

function updateConfig(){

	global $cached_folder, $config_global;
	$config_global = json_decode(file_get_contents("meta.js"), true);
	_updateConfig($config_global);

		// servrer's copy
	$target = $cached_folder . "meta.json";
	$res = json_encode($config_global);
	file_put_contents($target, $res); // cache the result

	geneteSpiders(); // cache the spiders

	return $res;
}

function geneteSpiders(){
	global $cached_folder, $conn, $schema, $config_global;
	$conf = findId($config_global, "config");
	$table2_id = $conf["table2"];
	$table2_pk = $conf["table2_pk"];
	$table_fk = $conf["table2_fk"];

	if(array_key_exists("table2_where", $conf)){
		$where = null;
		if($conf["table2_where"]){
			$where = $conf["table2_where"];
		}
	}
	//
	// $sql = "select distinct $table2_pk as id from $_schema.$table2_id";
	// if($where){
	// 	$sql .= " where $where";
	// }
	// $sql_res = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

	if(!file_exists($cached_folder)) mkdir($cached_folder, 0777, true);
	$spiders = $cached_folder . "spiders.svg";

	file_put_contents($spiders, psql2svg($table2_id, $table2_pk, "geom", $where, "spiders", null, null, "#888", null));
}

function updateConfigById(&$conf, $var, $key, $val){
	if(count(array_filter(array_keys($conf), 'is_string')) > 0){
		if($conf["id"] == $var){
			$conf[$key] = $val;
			// echo "\n========= Found it! =============\n";
			// print_r($conf);
			return $conf;
		}else{

			if(array_key_exists("children", $conf)){
				$n = count($conf["children"]);
				if($n){
					for ($i=0; $i<$n; $i++) {
						updateConfigById($conf["children"][$i], $var, $key, $val);
					}
					// return null;
				}else{
					return null;
				}
			}else{
				return null;
			}
		}
	}else{
		// echo "\nHello, sequential array\n";

		for ($i=0; $i < count($conf); $i++) {
			updateConfigById($conf[$i], $var, $key, $val);
		}
	}
}

/* 	Todo: find a specific var by its ID
	Usage: print_r(findId($config,"pr_cma"));
*/

function findId($conf, $var){
	if(count(array_filter(array_keys($conf), 'is_string')) > 0){
		if($conf["id"] == $var){
			return $conf;
		}else{

			if(array_key_exists("children", $conf)){
				$n = count($conf["children"]);
				if($n){
					for ($i=0; $i<$n; $i++) {
						$d = findId($conf["children"][$i], $var);
						if($d) return $d;
					}
					// return null;
				}else{
					return null;
				}
			}else{
				return null;
			}
		}
	}else{
		// echo "\nHello, sequential array\n";

		for ($i=0; $i < count($conf); $i++) {
			$d = findId($conf[$i], $var);
			if($d) return $d;
		}
	}
}

function findId2($conf, $var) {

	if($conf["id"] == $var){
		return $conf;
	}else{
		if(array_key_exists("children", $conf)){
			$n = count($conf["children"]);
			if($n){
				for ($i=0; $i<$n; $i++) {

					if($conf["children"][$i]["id"] == $var){
						return $conf["children"][$i];
					}else{
						$c = findId($conf["children"][$i], $var);
						if($c){
							return $c;
						}
						// else{  // WARNING: this else will break the logic!
						// 	print " C3***** found $var.\n";
						// 	return null;
						// }
					}
				}
				return null;
			}else{
				return null;
			}
		}
		else{
			return null;
		}
	}
}

?>
