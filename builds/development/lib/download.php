<?php

/** Error reporting */
// error_reporting(E_ALL);
// ini_set('display_errors', TRUE);
// ini_set('display_startup_errors', TRUE);
date_default_timezone_set('America/Regina');
define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');

/*
  http://localhost:8083/lib/download.php?layer=airport
*/
if(isset($_GET['group'])){
  $usr_group = $_GET['group'];
}else{
  die('<h1>Bad call.</h1>');
}

if(isset($_GET['layer'])){
  $usr_layer = $_GET['layer'];
}else{
  die('<h1>Bad call.</h1>');
}

$usr_type = $_GET['type'];

$configDirRaster = '../../../config/';
$configDirVector = '../../../config/';
$ogr2ogr = '/usr/local/bin/ogr2ogr';

// for cached feature classes
$cached_folder = './cache/';
if(!file_exists($cached_folder)) mkdir($cached_folder, 0777, true);

switch ($usr_layer) {

  // raster cases
  case 'elev':
  case 'prcp':
  case 'temp':
    $xml = parseXml($configDirRaster . $usr_layer . '_style.xml');
    $tifPath = $xml->Layer->Datasource->Parameter[1];
    $path1 = realpath($configDirRaster) . $tifPath;
    $path2 = get_absolute_path($path1);
    // echo $path2;
    downloadFile($path2);
    break;

  // vector cases
  default:
    $xml = parseXml($configDirVector . "__$usr_group.xml");
    $layers = $xml->Layer;
    $found = false;
    for ($i=0; $i < count($layers); $i++) {
      $lyr = $layers[$i];
      if($lyr['name'] == $usr_layer){
        $found = true;

        $param = $lyr->Datasource->Parameter;
        $file_gdb = $param[0];
        $featureIn = $param[1];
        $featureOut = $usr_layer; // . '_' . md5(rand());

        switch ($usr_type) {
          case 'shp':
            $format = 'ESRI Shapefile';
            $ext = ".shp";
            break;
          case 'kml':
            $format = 'KML';
            $ext = ".kml";
            break;
          case 'json':
            $format = 'GeoJSON';
            $ext = ".geojson";
            break;
          case 'info':
            $format = 'MapInfo File';
            $ext = ".tab";
            break;
          case 'gml':
            $format = 'GML';
            $ext = ".gml";
            break;
          case 'gpx':
            $format = 'GPX';
            $ext = ".gpx";
            break;
          case 'dxf':
            $format = 'DXF';
            $ext = ".dxf";
            break;
          default:
            # code...
            break;
        }

        $target_compile = "$featureOut$ext";
        $target_deliver = "$cached_folder$featureOut$ext.zip";

        if(file_exists($target_deliver)){
          downloadFile($target_deliver);
        }else{
          $file_gdb = get_absolute_path(realpath($configDirVector) . '/' . $file_gdb);

          $cmd = "$ogr2ogr -f \"$format\" $target_compile \"$file_gdb\" -sql \"select * from $featureIn\"";
          // $trail = " > /dev/null &";
          // $trail = " 2>&1";
          $trail = "";

          try{

            // extract the file from GDB
            exec($cmd . $trail, $cmd_output, $return_var);
            if($return_var == 0){

              // zip the file(s)
              $files = glob("$featureOut*");
              create_zip($files, $target_deliver);

              downloadFile($target_deliver);
              array_map('unlink', $files);
            }
          }catch(Exception $err){
            echo $err->getMessage();
          }
        }

        setcookie("download_$usr_layer", "1", time() + (86400 * 3), "/"); // 86400 = 1 day

        return;
      }
    }
    if(!$found){
      die("<h3>No such layer found on the server: $usr_layer</h3>");
    }
    break;
}

function parseXml($xmlPath){
  $xml = simplexml_load_file($xmlPath) or die("Error: Cannot create object");
  return $xml;
}

function get_absolute_path($path) {
   $path = str_replace(array('/', '\\'), DIRECTORY_SEPARATOR, $path);
   $parts = array_filter(explode(DIRECTORY_SEPARATOR, $path), 'strlen');
   $absolutes = array();
   foreach ($parts as $part) {
       if ('.' == $part) continue;
       if ('..' == $part) {
           array_pop($absolutes);
       } else {
           $absolutes[] = $part;
       }
   }
   return '/' . implode(DIRECTORY_SEPARATOR, $absolutes);
}

function downloadFile($fullPath){

  // Must be fresh start
  if( headers_sent() )
    die('Headers Sent');

    // Required for some browsers
   if(ini_get('zlib.output_compression'))
     ini_set('zlib.output_compression', 'Off');

     // File Exists?
   if( file_exists($fullPath) ){

     // Parse Info / Get Extension
     $fsize = filesize($fullPath);
     $path_parts = pathinfo($fullPath);
     $ext = strtolower($path_parts["extension"]);

     // Determine Content Type
     switch ($ext) {
       case "pdf": $ctype="application/pdf"; break;
       case "exe": $ctype="application/octet-stream"; break;
       case "zip": $ctype="application/zip"; break;
       case "doc": $ctype="application/msword"; break;
       case "xls": $ctype="application/vnd.ms-excel"; break;
       case "ppt": $ctype="application/vnd.ms-powerpoint"; break;
       case "tif": $ctype="image/tif"; break;
       case "gif": $ctype="image/gif"; break;
       case "png": $ctype="image/png"; break;
       case "jpeg":
       case "jpg": $ctype="image/jpg"; break;
       case "geojson": $ctype ="application/vnd.geo+json"; break;
       case "kml": $ctype ="application/vnd.google-earth.kml+xml"; break;
       case "gml": $ctype ="text/xml; subtype=\"gml/3.1.1\""; break;
       case "gpx": $ctype ="application/gpx+xml"; break;
       case "dxf": $ctype ="application/dxf"; break;
       default: $ctype="application/force-download";
     }

     header("Pragma: public"); // required
     header("Expires: 0");
     header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
     header("Cache-Control: private",false); // required for certain browsers
     header("Content-Type: $ctype");
     header("Content-Disposition: attachment; filename=\"".basename($fullPath)."\";" );
     header("Content-Transfer-Encoding: binary");
     header("Content-Length: ".$fsize);
     ob_clean();
     flush();
     readfile( $fullPath );

   } else
     die('File Not Found');
}

/*
  TODO: creates a compressed zip file
  SOURCE: https://davidwalsh.name/create-zip-php
*/

function create_zip($files = array(),$destination = '',$overwrite = false) {
	//if the zip file already exists and overwrite is false, return false
	if(file_exists($destination) && !$overwrite) { return false; }
	//vars
	$valid_files = array();
	//if files were passed in...
	if(is_array($files)) {
		//cycle through each file
		foreach($files as $file) {
			//make sure the file exists
			if(file_exists($file)) {
				$valid_files[] = $file;
			}
		}
	}
	//if we have good files...
	if(count($valid_files)) {
		//create the archive
		$zip = new ZipArchive();
		if($zip->open($destination, $overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
			return false;
		}
		//add the files
		foreach($valid_files as $file) {
			$zip->addFile($file,$file);
		}
		//debug
		//echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;

		//close the zip -- done!
		$zip->close();

		//check to make sure the file exists
		return file_exists($destination);
	}
	else
	{
		return false;
	}
}
