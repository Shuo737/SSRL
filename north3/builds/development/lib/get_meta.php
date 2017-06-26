<?php

require_once('func_meta.php');

ini_set('display_errors', 'On');

/*  ---- TEST LINK ----
	http://gistest.usask.ca/git/north/lib/get_meta.php?f=meta
	http://gistest.usask.ca/git/north/lib/get_meta.php?f=meta&verb=update
*/

$var = $_GET["f"];
if(isset($_GET["verb"]))
	$verb = $_GET["verb"];
if(isset($_GET["arg"]))
	$arg = $_GET["arg"];

$cached_folder = './cache/';
if(!file_exists($cached_folder)) mkdir($cached_folder, 0777, true);

if($var){
	switch ($var) {

		case 'meta':

			header('Content-Type: application/json');

			$target = $cached_folder . "meta.json";
			if(isset($verb) && $verb == 'update'){
				print updateConfig();

				// remove these caches: query, excel
				if(isset($arg) && $arg == 'dump'){
					array_map('unlink', glob("${cached_folder}*.query"));
					// array_map('unlink', glob("${cached_folder}xls/*.xlsx"));
				}
			}else{
				if(file_exists($target)){
					print file_get_contents($target);
				}else{
					print updateConfig();
				}
			}
			break;
		default:
			print "<h1>Invalid call</h1>";
			break;
	}
}

?>
