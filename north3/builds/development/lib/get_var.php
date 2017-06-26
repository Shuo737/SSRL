<?php

require_once("func_meta.php");
ini_set('display_errors', 'On');

$cached_folder = './cache/';

$var = $_GET["id"];

$conf = json_decode(file_get_contents($cached_folder . "meta.json"), true);

// set debug = 1 only prints sql command, used for debug/testing purposes only
$debug = 0;

/*  ---- TEST LINK ----
	bar-chart example
		http://gistest.usask.ca/git/north/lib/get_var.php?id=dwell_hhold_sz

	pie-chart example
		http://gistest.usask.ca/git/north/lib/get_var.php?id=dwell_hhold_sz2

*/

// return the cached copy for a better performance
$target = "$cached_folder$var.query";
if(!$debug && file_exists($target)){
	header('Content-Type: application/json');
	echo file_get_contents($target);
	return;
}

try{

	$conf_var = findId($conf,$var);

	$table = $conf_var["server"]["table1"];	// the non-spatial table
	$table_id = $conf_var["server"]["table1_id"];
	$table_fields = $conf_var["server"]["table1_fields"];
	$table_fieldNames = $conf_var["server"]["table1_fieldNames"];
	$chart = $conf_var["server"]["chart"];
	$percent = false;
	if(isset($conf_var["server"]["percent"])){
		$percent = !!$conf_var["server"]["percent"];
	}

	switch ($chart) {
		case 'bar':
			$propNames = ['v','r','a','b','c','d','e','f','g','h','i','j'];
			$table_field_main = $table_fields[0]; // the 1st one is the main field
			$table_fieldName_main = $table_fieldNames[0]; // name of the 1st field
			$table_field_misc = null;
			if(count($table_fields)==3){
				array_shift($table_fields);
				$table_field_misc = $table_fields;
				array_shift($table_fieldNames);
				$table_fieldName_misc = $table_fieldNames;
			}
			break;
		case 'pie':
			$table_field_main = [];
			$table_fieldName_main = [];
			$n = count($table_fields);
			for ($i=0; $i < $n-2; $i++) {
				$table_field_main[] = $table_fields[$i];
				$table_fieldName_main[] = $table_fieldNames[$i];
			}
			$table_field_misc[] = $table_fields[$n-2];
			$table_field_misc[] = $table_fields[$n-1];
			$table_fieldName_misc[] = $table_fieldNames[$n-2];
			$table_fieldName_misc[] = $table_fieldNames[$n-1];

			$propNames = ['a','b','c','d','e','f','g','h','i','j'];
			break;
		default:
			# code...
			break;
	}

	$table2 = "north_points_benben";
	$table2_id = "uid_join";
	$table2_fk = "uid_join";
	$table2_name = "place_and_region";

	// $table_field2 = $conf_var["server"]["table1_field2"];

	// $fields = $conf_var["server"]["pie_fields"];	// an array of fields: the 1st one is the id field which will also be the foreign key for joinning the spatial layer, the rest are attr fields used to make pie charts
	// $fieldNames = $conf_var["server"]["pie_fieldNames"];
	// $fr = $conf_var["server"]["fr"];
	// $en = $conf_var["server"]["en"];
	// $lang_filters = $conf_var["server"]["lang_filters"];

	if(array_key_exists("where", $conf_var["server"])){
		$where = $conf_var["server"]["where"];	// for selecting records in table1
		$where = str_replace("\\", "", $where);	// strip off the backslash
	}else{
		$where = null;
	}

	$year_type = $conn->query("SELECT data_type as type FROM information_schema.columns WHERE  table_name = '$table' and column_name = 'year'")->fetchAll(PDO::FETCH_ASSOC)[0]['type'];

	switch ($chart) {

		case 'pie':

			// get all the years
			if($where){
				$sql = "select distinct year from $table where $where order by year";
			}else
				$sql = "select distinct year from $table order by year";

			$cols = [];

			$years = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

			$years_arr = [];

			$stats =  $conn->query(getStats_pie($conn, $table, $table_id, $table_field_main, $where))->fetchAll(PDO::FETCH_ASSOC);

			for ($i=0; $i < count($years); $i++) {
				$years_arr[] = (string)$years[$i]["year"];
				$col = [
					"id" => "y$i" . "v0",
					"name" => "Total",
					"year" => $years[$i]["year"],
					"max" => $stats[$i]["max"],
					"min" => $stats[$i]["min"],
					"avg" => $stats[$i]["avg"],
					"n" => $stats[$i]["n"],
				];

				$cols[] = $col;
				for ($j=0; $j < count($table_field_main); $j++) {
					if($where){
						if(strpos($year_type,"text") === FALSE && strpos($year_type,"char") === FALSE)
							$where0 = "$where AND year = " . $years[$i]["year"];
						else
							$where0 = "$where AND year = '" . $years[$i]["year"] ."'";
					}else{
						if(strpos($year_type,"text") === FALSE && strpos($year_type,"char") === FALSE)
							$where0 = "year = " . $years[$i]["year"];
						else
							$where0 = "year = '" . $years[$i]["year"] ."'";
					}

					$stats2 = $conn->query(getStats($table,$table_field_main[$j], $where0))->fetchAll(PDO::FETCH_ASSOC);

					$cols[] = [
						"id" => "y${i}v" . ($j+1),
						"name" => $table_fieldName_main[$j],
						"year" => $years[$i]["year"],
						"max" => $stats2[0]["max"],
						"min" => $stats2[0]["min"],
						"avg" => $stats2[0]["avg"],
						"n" => $stats2[0]["n"]
					];
				}

				for ($j=0; $j < count($table_field_misc); $j++) {
					$cols[] = [
					"id" => $propNames[$j] . $i,
					"name" => $table_fieldName_misc[$j],
					"year" => $years[$i]["year"]];
				}
			}

			$sql = build_sql_var_pie($conn, $table, $table_id, $table_field_main, $table_field_misc, $where, $table2, $table2_fk, $table2_id, $table2_name, $propNames);

			break;

		case 'bar':

			if($where){
				$sql = "select distinct year from $table where $where order by year";
			}else
				$sql = "select distinct year from $table order by year";

			$cols = [];

			$years = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

			$stats = $conn->query(getStats($table,$table_field_main,$where))->fetchAll(PDO::FETCH_ASSOC);
			$years_arr = [];
			for ($i=0; $i < count($years); $i++) {
				$years_arr[] = (string)$years[$i]["year"];
				$cols[] = [
					"id" => $propNames[0] . $i,
					"name" => $table_fieldName_main,
					"year" => $years[$i]["year"],
					"max" => $stats[$i]["max"],
					"min" => $stats[$i]["min"],
					"avg" => $stats[$i]["avg"],
					"n" => $stats[$i]["n"]
				];
				$cols[] = ["id" => $propNames[1] . $i, "name" => "Rank", "year" => $years[$i]["year"]];
				if(isset($table_field_misc)){
					for ($j=0; $j < count($table_field_misc); $j++) {
						$cols[] = [
						"id" => $propNames[2+$j] . $i,
						"name" => $table_fieldName_misc[$j],
						"year" => $years[$i]["year"]];
					}
				}
			}

			$sql = build_sql_var_bar($conn, $table, $table_id, $table_field_main, $table_field_misc, $where, $table2, $table2_fk, $table2_id, $table2_name, $propNames);

			break;

		default:
			header('Content-Type: application/json');
			print json_encode(array(
				"status" => -1,
				"message" => "invalid request"
				));
			return;
	}

	if($debug){
		echo $sql;
		return;
	}

	$sql_res = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
	$res = array();

	$res["data"] = $sql_res;

	$res["fields"] = $cols;
	$res["years"] = $years_arr;

	$res["chart"] = $chart;
	$res["percent"] = $percent;

	if($chart == "pie"){
		$res["categories"] = $table_fieldName_main; // this is necessary since js will sort fields so the original order is messed up. we need to track the order to make the pie chart's legend right.
		$res["default"] = "Total";
	}else{
		$res["default"] = "Value";
	}

	header('Content-Type: application/json');
	$res = json_encode($res);
	file_put_contents($target, $res); // cache the result
	print $res;

}catch(PDOException $e){
  echo "Error: " . $e->getMessage();
}

// helper functions

function getStats($table, $table_field, $where){

	$sql = "select year, max(case when $table_field < 0 then 0 else $table_field end) as max, min(case when $table_field < 0 then 0 else $table_field end) as min, round(avg(case when $table_field < 0 then 0 else $table_field end),3) as avg, count(case when $table_field < 0 then 0 else $table_field end) as n from $table";
	if($where)
		$sql .= " where $where";
	 $sql .= " group by year order by year";

	 return $sql;
}

function getStats_pie($conn, $table, $table_id, $table_field_main, $where){

	// get all the years
	if($where){
		$sql = "select distinct year from $table where $where order by year";
	}else
		$sql = "select distinct year from $table order by year";

	// get the data type for field 'year'
	$year_type = $conn->query("SELECT data_type as type FROM information_schema.columns WHERE  table_name = '$table' and column_name = 'year'")->fetchAll(PDO::FETCH_ASSOC)[0]['type'];

	// sum of fields
	$sum_fields = "(CASE WHEN " . $table_field_main[0] ." > 0 THEN " . $table_field_main[0] . " ELSE 0 END)";
	for ($i=1; $i < count($table_field_main); $i++) {
		$sum_fields .= " + (CASE WHEN " . $table_field_main[$i] ." > 0 THEN " . $table_field_main[$i] . " ELSE 0 END)";
	}

	//execute sql
	$recs = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

	$sql = "SELECT " . $table_id . " AS id, $sum_fields AS y0"; // v0 is the total

	if(strpos($year_type,"text") === FALSE && strpos($year_type,"char") === FALSE)
		$sql .= " FROM $table WHERE year=" . $recs[0]["year"];
	else
		$sql .= " FROM $table WHERE year='" . $recs[0]["year"] ."'";

	if($where) $sql .= " AND $where";

	for ($i=1; $i < count($recs); $i++) {

		$id0 = 2 * ($i - 1); // table index for the previous subquery
		$id1 = 2 * $i -1; // table index for current query

		$sql2 = "SELECT COALESCE(t${id0}.id, t${id1}.id) AS id";

		// fields from the 1st year till the current year
		for ($j=0; $j < $i+1; $j++) {
			$sql2 .= ", y${j}";
		}

		// subquery for the current year
		$sql3 = "SELECT " . $table_id . " AS id, $sum_fields AS y${i}"; // v0 is the total

		if(strpos($year_type,"text") === FALSE && strpos($year_type,"char") === FALSE)
			$sql3 .= " FROM $table WHERE year=" . $recs[$i]["year"];
		else
			$sql3 .= " FROM $table WHERE year='" . $recs[$i]["year"] ."'";

		if($where) $sql3 .= " AND $where";

		$sql2 .= " FROM ($sql3) t{$id1} FULL OUTER JOIN ($sql) t{$id0} USING (id)";
		$sql = $sql2;
	}
	$sql3 = [];
	for ($i=0; $i < count($recs); $i++) {
		$sql3[] = "select max(y$i), min(y$i), round(avg(y$i),3) as avg, count(y$i) as n from ($sql) t1";
	}
	$sql3 = implode(' union all ', $sql3);
	return $sql3;
}

/*

This function is designed to prepare a table for making a pie chart.
It will generate a TOTAL field automatically by summing vallues of all the [fields].

example:
	 transpose_table("imm_age_gender",["cmauid","age0_14","age15_24","age25_44","age45_plus"]);

*/
function build_sql_var_pie($conn, $table, $table_id, $table_field_main, $table_field_misc, $where, $table2, $table2_fk, $table2_id, $table2_name, $propNames){

	// get all the years
	if($where){
		$sql = "select distinct year from $table where $where order by year";
	}else
		$sql = "select distinct year from $table order by year";

	// get the data type for field 'year'
	$year_type = $conn->query("SELECT data_type as type FROM information_schema.columns WHERE  table_name = '$table' and column_name = 'year'")->fetchAll(PDO::FETCH_ASSOC)[0]['type'];

	// sum of fields
	$sum_fields = "(CASE WHEN " . $table_field_main[0] ." > 0 THEN " . $table_field_main[0] . " ELSE 0 END)";
	for ($i=1; $i < count($table_field_main); $i++) {
		$sum_fields .= " + (CASE WHEN " . $table_field_main[$i] ." > 0 THEN " . $table_field_main[$i] . " ELSE 0 END)";
	}

	//execute sql
	$recs = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

	$sql = "SELECT " . $table_id . " AS id, $sum_fields AS y0v0"; // v0 is the total
	for ($j=0; $j < count($table_field_main); $j++) {
		$sql .= "," . $table_field_main[$j] . " AS " . "y0v" . ($j+1);
	}

	// $sql .= ", " . $table_field_misc[0] . " AS " . $propNames[0] . "0";
	// $sql .= ", " . $table_field_misc[1] . " AS " . $propNames[1] . "0";

	$sql .= ", " . $table_field_misc[0] . " AS " . $propNames[0] . "0";
	$sql .= ", " . $table_field_misc[1] . " AS " . $propNames[1] . "0";

	if(strpos($year_type,"text") === FALSE && strpos($year_type,"char") === FALSE)
		$sql .= " FROM $table WHERE year=" . $recs[0]["year"];
	else
		$sql .= " FROM $table WHERE year='" . $recs[0]["year"] ."'";

	if($where) $sql .= " AND $where";

	for ($i=1; $i < count($recs); $i++) {

		// $year = $years[$i]["year"];
		$id0 = 2 * ($i - 1); // table index for the previous subquery
		$id1 = 2 * $i -1; // table index for current query

		$sql2 = "SELECT COALESCE(t${id0}.id, t${id1}.id) AS id";

		// fields from the 1st year till the current year
		for ($j=0; $j < $i+1; $j++) {
			for ($k=0; $k< count($table_field_main)+1; $k++) {
				$sql2 .= ", y${j}v$k"; //	"t" . (2*($i-1)) . "."
			}
			$sql2 .= ", " . $table_field_misc[0] . " AS " . $propNames[0] . $j;
			$sql2 .= ", " . $table_field_misc[1] . " AS " . $propNames[1] . $j;
		}

		// subquery for the current year
		$sql3 = "SELECT " . $table_id . " AS id, $sum_fields AS y${i}v0"; // v0 is the total
		for ($j=0; $j < count($table_field_main); $j++) {
			$sql3 .= "," . $table_field_main[$j] . " AS " . "y${i}v" . ($j+1);
		}
		$sql3 .= "," . $table_field_misc[0]; // . " AS " . $propNames[0] . $j;
		$sql3 .= "," . $table_field_misc[1]; // . " AS " . $propNames[1] . $j;

		if(strpos($year_type,"text") === FALSE && strpos($year_type,"char") === FALSE)
			$sql3 .= " FROM $table WHERE year=" . $recs[$i]["year"];
		else
			$sql3 .= " FROM $table WHERE year='" . $recs[$i]["year"] ."'";

		if($where) $sql3 .= " AND $where";

		$sql2 .= " FROM ($sql3) t{$id1} FULL OUTER JOIN ($sql) t{$id0} USING (id)";
		$sql = $sql2;
	}

	$sql_geom = "select GeometryType(geom) as g from $table2 limit 1";
	$res_geom = $conn->query($sql_geom)->fetch(PDO::FETCH_ASSOC);
	if($res_geom["g"] == "POINT"){
		$sql2 = "SELECT t1.$table2_id AS id, t1.$table2_name AS name, round(cast(st_xmax(ST_Transform(t1.geom,4326)) as numeric),5) as lng, round(cast(st_ymax(ST_Transform(t1.geom,4326)) as numeric),5) as lat";
	}else{
		throw new Exception('Neither XY fields undefined nor point layer available.');
	}


	for ($i=0; $i < count($recs); $i++) {
		for ($j=0; $j < count($table_field_main)+1; $j++) {
			$sql2 .= ", t2.y$i" . "v$j";
		}
		$sql2 .= "," . " t2." . $propNames[0] . $i;
		$sql2 .= "," . " t2." . $propNames[1] . $i;
	}

	$vs1 = array();
	for ($i=0; $i < count($recs); $i++) {
		$vs1[] = "y{$i}v0";
	}
	$vs11 = implode(" + ", $vs1);

	$sql2 .= " FROM $table2 t1 INNER JOIN ($sql) t2 ON t1.$table2_fk = t2.id WHERE $vs11 > 0";

	return $sql2;
}

function build_sql_var_bar($conn, $table, $table_id, $table_field_main, $table_field_misc, $where, $table2, $table2_fk, $table2_id, $table2_name, $propNames){

	if($where){
		$sql = "select distinct year from $table where $where order by year";
	}else
		$sql = "select distinct year from $table order by year";

	$years = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

	// get the data type for field 'year'
	$year_type = $conn->query("SELECT data_type as type FROM information_schema.columns WHERE  table_name = '$table' and column_name = 'year'")->fetchAll(PDO::FETCH_ASSOC)[0]['type'];

	// loop thru each year
	if(isset($table_field_misc)){
		$sql = "SELECT $table_id AS id,";

		for ($j=0; $j < count($table_field_misc); $j++) {
			$sql .= $table_field_misc[$j] . " AS " . $propNames[2+$j] . "0,";
		}

		$sql .= "$table_field_main AS v0, CASE WHEN $table_field_main IS NOT NULL THEN RANK() over (order by $table_field_main desc nulls last) END AS r0 FROM $table";

	}else{
		$sql = "SELECT $table_id AS id, $table_field_main AS v0, CASE WHEN $table_field_main IS NOT NULL THEN RANK() over (order by $table_field_main desc nulls last) END AS r0 FROM $table";
	}

	if(strpos($year_type,"text") === FALSE && strpos($year_type,"char") === FALSE)
		$sql .= " WHERE year = " . $years[0]['year'] /*. " order by $table_field_main desc"*/;
	else
		$sql .= " WHERE year = '" . $years[0]['year'] /*. " order by $table_field_main desc" */."'";

	if($where)
		$sql .= " AND $where"/* . " order by $table_field_main desc"*/;

	for ($i=1; $i < count($years); $i++) {
		$sql2 = $sql;

		if(isset($table_field_misc)){
			$sql_ = "SELECT " . $table_id . " AS id,";

			for ($j=0; $j < count($table_field_misc); $j++) {
				$sql_ .= $table_field_misc[$j] . " AS " . $propNames[2+$j] . "$i,";
			}

			$sql_ .= "$table_field_main AS v$i, CASE WHEN $table_field_main IS NOT NULL THEN RANK() over (order by $table_field_main desc nulls last) END AS r$i FROM $table";
		}else{
			$sql_ = "SELECT $table_id AS id, $table_field_main AS v$i, CASE WHEN $table_field_main IS NOT NULL THEN RANK() over (order by $table_field_main desc nulls last) END AS r$i FROM $table";
		}

		if(strpos($year_type,"text") === FALSE && strpos($year_type,"char") === FALSE){
			$sql_ .= " WHERE year = " . $years[$i]['year']/* . " order by $table_field_main desc"*/;
    }else{
			$sql_ .= " WHERE year = '" . $years[$i]['year'] /*. " order by $table_field_main desc"*/ ."'";
    }

		if($where)
			$sql_ .= " AND $where" /*. " order by $table_field_main desc"*/;

		$sql = "SELECT COALESCE(t" . (2 * $i - 2) . ".id, t" . (2 * $i - 1) . ".id) AS id";

		for ($j=0; $j < $i; $j++) {
			if(isset($table_field_misc)){
				for ($k=0; $k < count($table_field_misc); $k++) {
					$sql .= ", t" . (2 * $i - 2) . "." . $propNames[2+$k] . "$j AS " . $propNames[2+$k] . "$j";
				}
			}
			$sql .= ", t" . (2* $i - 2) . ".v$j AS v$j, t" . (2 * $i - 2) . ".r$j AS r$j";
		}

		if(isset($table_field_misc)){
			for ($k=0; $k < count($table_field_misc); $k++) {
				$sql .= ", t" . (2 * $i - 1) . "." . $propNames[2+$k] . "$i AS " . $propNames[2+$k] . "$i";
			}
		}

		$sql .= ", t" . (2 * $i - 1) . ".v$i AS v$i, t" . (2 * $i - 1) . ".r$i AS r$i FROM ($sql2) t" . (2 * $i - 2) . " FULL JOIN ($sql_) t" . (2 * $i - 1) . " USING (id)";
	}


	$sql_geom = "select GeometryType(geom) as g from $table2 limit 1";
	$res_geom = $conn->query($sql_geom)->fetch(PDO::FETCH_ASSOC);

	if($res_geom["g"] == "POINT"){
		$sql2 = "SELECT ta.$table2_id AS id, ta.$table2_name AS name, round(cast(st_xmax(ST_Transform(ta.geom,4326)) as numeric),5) as lng, round(cast(st_ymax(ST_Transform(ta.geom,4326)) as numeric),5) as lat";
	}else{
		throw new Exception('No point spatial layer available.');
	}

	for ($i=0; $i < count($years); $i++) {
		if(isset($table_field_misc)){
			for ($k=0; $k < count($table_field_misc); $k++) {
				$sql2 .= ", tb." . $propNames[2+$k] . "$i";
			}
		}
		$sql2 .= ", tb.v$i, tb.r$i";
	}

	$sql2 .= " FROM $table2 ta INNER JOIN ($sql) tb ON ta.$table2_fk = tb.id";

	return $sql2;
}


?>
