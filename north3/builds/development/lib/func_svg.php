<?php
// require_once("func_meta.php");
require_once("connect.php");
// ini_set('display_errors', 'On');

function psql2svg($table,$idField,$geomField,$where,$svg_id,$colorField,$fillColors,$strokeColor,$markerIco){
	global $db, $servername, $username, $password, $conn, $schema;
	try{

		$c1 = 20037508.342789;
		$c2 = 20037535.725605;
		$zoom = 1;
		$factor = (512 * pow(2,$zoom)) / ($c1 * 2);

		$sql = "select $idField as id, ";
		if($colorField) $sql .= "$colorField as color, ";
		if(!$geomField || $geomField == "geom"){
			$sql .= "ST_AsSVG(ST_TransScale(st_transform(geom,3857),$c1,-$c2,$factor,$factor),1,5) as svg from $schema.$table";
		}else{
			if(is_array($geomField)){
				$sql .= "ST_AsSVG(ST_TransScale(st_transform(ST_SetSRID(ST_MakePoint(" . $geomField[0] . ", " . $geomField[1] . "),4326),3857),$c1,-$c2,$factor,$factor),1,5) as svg from $schema.$table";
			}else{
				throw new Exception("Invalid geomField config!");
			}
		}

		if($where) $sql .= " where $where";

	// print $sql;
	// print "===============\n<br>";
	// return;

		$res = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

		$svg = '<svg id="svg_' . $svg_id . '" width="100%" height="100%" viewBox="0 0 ' . $c1*2*$factor . ' ' . $c2*2*$factor . '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';

		if(!isset($strokeColor) || !$strokeColor) $strokeColor = "#000";
		if(!isset($fillColor) || !$fillColor)
			$fillColor = "none";

		// loop thru each geometry
		for ($c=0; $c < count($res); $c++) {

			$place_svg = $res[$c]["svg"];
			$place_id = $res[$c]["id"];
			@$place_cx = $res[$c]["cx"];
			@$place_cy = $res[$c]["cy"];

			if($colorField = -1) // -1 means applying a uniform color
				$clr_inx = 0;
			else
				$clr_inx = intval($res[$c]['color']);

			$svg .= '<g data-id="' . $place_id . '"';
			if(!$fillColors){
				$svg .= ' fill="none" stroke="' . $strokeColor . '" stroke-width="1">';
			}else{
				$svg .= ' fill="' . $fillColors[$clr_inx] . '" stroke="' . $strokeColor . '" stroke-opacity="1" stroke-width="1">';
			}

			// if it's point feature class
			if(strrpos($place_svg, "cx", -strlen($place_svg)) !== FALSE || strrpos($place_svg, "x", -strlen($place_svg)) !== FALSE){
				$svg .= "<image $place_svg r=\"1\" width=\"40\" height=\"40\" xlink:href=\"$markerIco\"/>";
			}else{ // if it's a polygon etc...
				$svg .= "<path d=\"$place_svg\" />";
			}

			$svg .= "</g>";

		} // end for
		$svg .= '</svg>';

		return $svg;

	}catch(PDOException $e){
	  return "Error: " . $e->getMessage();
	}
}

function psql2svg_mannually($id, $sql,$colorField,$fillColors,$strokeColor){

	try{
		global $conn;

		$res = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

		/* calculate the stroke-width */
		$zoom = 1;
		$strokeWidth = 1; // 1px at $zoom level
		$stroke = 20037508.342789 * 2 / (512 * pow(2,$zoom)) * $strokeWidth;

		$svg = '<svg id="svg_' . $id . '" width="100%" height="100%" viewBox="0 0 ' . 40075016.685578/$stroke . ' ' . 40075071.451209/$stroke . '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';


		if(!$strokeColor) $strokeColor = "#000";
		$clr_inx = 0;

		// loop thru each country
		for ($c=0; $c < count($res); $c++) {

			if($colorField = -1) // -1 means applying a uniform color
				$clr_inx = 0;
			else
				$clr_inx = intval($res[$c][$colorField]);

			$polygons = $res[$c]["geom"];
			$place_id = $res[$c]["id"];
			$polygons = json_decode($polygons, true);
			$type = $polygons["type"];
			$polygons = $polygons["coordinates"];

			if(!$fillColors){
				$svg .= '<g data-id="' . $place_id . '" fill="none" stroke="' . $strokeColor . '" stroke-width="1">';
			}else{
				$svg .= '<g data-id="' . $place_id . '" fill="' . $fillColors[$clr_inx] . '" stroke="' . $strokeColor . '" stroke-opacity="1" stroke-width="1">';
			}

			switch ($type) {
				case 'MultiPolygon':

					// loop thru each part/pon
					for ($i=0; $i < count($polygons); $i++) {
						$polygon = $polygons[$i];

						// loop thru each part
						$svg .= '<path fill-rule="evenodd" d="';
						$exterior = $polygon[0];
						$first = true;
						// exterior ring
						for ($j=0; $j < count($exterior); $j++) {
							$x = $exterior[$j][0];
							$y = $exterior[$j][1];
							$x =  $x + 20037508.342789;
							$y = 20037535.725605 - $y;
							$x = $x / $stroke;
							$y = $y / $stroke;
							if($first){
								$svg .= "M" . round($x,2) . "," . round($y,2);
								$first = false;
							}else{
								$svg .= " L" . round($x,2) . "," . round($y,2);
							}
						}
						// interior rings
						for ($j=1; $j < count($polygon); $j++) {
							$interior = $polygon[$j];
							$first = true;
							for ($k=0; $k < count($interior); $k++) {
								$x = $interior[$k][0];
								$y = $interior[$k][1];
								$x = $x + 20037508.342789;
								$y = 20037535.725605 - $y;
								$x = $x / $stroke;
								$y = $y / $stroke;
								if($first){
									$svg .= "M" . round($x,2) . "," . round($y,2);
									$first = false;
								}else{
									$svg .= " L" . round($x,2) . "," . round($y,2);
								}
							}
						}

						$svg .= '"/>';
					}

					$svg .= '</g>';
					break;

				default:
					# code...
					break;
			} // end switch
		} // end for
		$svg .= '</svg>';

		return $svg;

	}catch(PDOException $e){
	  return "Error: " . $e->getMessage();
	}
}

?>
