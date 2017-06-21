<?php
	$var = "";
	if(isset($_GET["id"])){
		$var = $_GET["id"];
	}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN">
<html class="no-js" lang=""
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:svg="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
<head>
  <title>Northern Saskatchewan Communities</title>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
  <meta name="description" content="Northern Saskatchewan Communities is an interactive web platform to visualize wealth of datasets from ICNGD as well as analyize them.">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="apple-touch-icon" href="img/logo.png">
  <!-- Fav and touch icons -->
  <link rel="apple-touch-icon-precomposed" sizes="144x144" href="img/icngd_logo.png">
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/icngd_logo.png">
  <link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/icngd_logo.png">
  <link rel="apple-touch-icon-precomposed" href="img/icngd_logo.png">
  <link rel="shortcut icon" href="img/icngd_logo.png">

  <link rel="stylesheet" href="css/main.css">
  <script type="text/javascript" src="js/script.js"></script>
  <script type="text/javascript" src="w2ui-1.5.rc1.min.js"></script>
  <link rel="stylesheet" href="w2ui-1.5.rc1.min.css" />
  <script type="text/javascript">
	 var preload_var = <?php echo "'$var'"; ?>;
  </script>
</head>

<body>
	<div class="version"></div>
  <div id="layout" class="non_selectable">
		<div id="banner">
			<div class="dream-l"></div>
			<div class="dream-r"></div>
			<div class="title">Northern Saskatchewan Communities</div>
		</div>
		<div id="content">
			<span class="census-button">
				<span class="fa fa-table" aria-hidden="true"></span>
				<span class="title">Table of Contents</span>
			</span>
			<div id="nav">
				<div class="tab-box">
					<div class="tab">
						<span class="title">Table of Contents (TOC)</span>
						<!-- <span class="search-button">
							<span class="fa fa-search" aria-hidden="true"></span>
							<span class="title">Search</span>
						</span> -->
						<span class="back-button">
							<span class="demo-icon icon-angle-circled-left" aria-hidden="true"></span>
							<span class="title">CLOSE</span>
						</span>
					</div>
				</div>
				<div id="nav-guide">
					<div class="icon icon-search" id="btnSearchNode"><span>Search a Variable</span></div>
					<div class="break"></div>
					<div class="icon icon-eye-off" id="btnHideAllLayers"><span>Turn All Layers Off</span></div>
					<div class="break"></div>
					<div class="icon icon-map" id="btnAtlas" title="Professionally designed PDF maps."><span>Atlas</span></div>
				</div>
				<div id="search-tree">
					<input type="text"></input>
					<span class="footnote"><p>Type in keywords to search.</p><p>Press &lt;Enter&gt; or &lt;ESC&gt; to Exit.</p></span>
				</div>
				<div class="tree-view-box">
					<div class="tree-view"></div>
					<!-- <img src="img/slides/tree_bg2_600.jpg"> -->
				</div>
				<div id="basemap-switch">
					<div>Base Map: </div>
					<select class="selectpicker" data-size="8"></select>
				</div>
			</div>
			<div id="map"></div>
		</div>

    <svg class="hatch" xmlns="http://www.w3.org/2000/svg">
    	<defs>
    		<pattern id="hatch" patternUnits="userSpaceOnUse" width="0" height="0" patternTransform="rotate(-45)"><rect fill="#f00" fill-opacity="0.2" stroke="#f00" stroke-width="0" stroke-dasharray="" width="" height=""></rect></pattern>
    		<linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#ffff00;stop-opacity:1"></stop>
          <stop offset="100%" style="stop-color:#e18f0f;stop-opacity:1"></stop>
        </linearGradient>
    	</defs>
    </svg>

    <footer id="footer">
      <div class="container">
        <div class="btn-group" role="group">
					<input id="toc2" type="checkbox" data-onstyle="success">
					<button type="button" id="tip" class="btn btn-transparent"><i class="icon icon-book"></i> Help</button>
          <div class="search-community input-group">
			      <input type="text" id="txtSearchComunity" class="form-control" placeholder="Search for a community...">
			      <span class="input-group-btn">
			        <button id="btnSearchComunity" class="btn btn-default" type="button">Go!</button>
			      </span>
			    </div>
        </div>

        <div class="right status">
          <span class = "busy"> <span class="icon icon-arrows-cw animate-spin"></span> <span class="msg"></span></span>
          <span>Map Centre: </span>
          <span><span class="icon icon-target"></span> <span id="coordinate"></span></span>
        </div>
      </div>
    </footer>

    <!-- Modal message -->
    <div class="modal" data-backdrop="static" id="modalMsg" role="dialog">
      <div class="alert alert-warning" role="alert">Loading</div>
    </div>

    <!-- Modal dialogbox -->
    <div class="modal" data-backdrop="static" id="modalDiag" role="dialog">
      <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header header-inverse">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Header</h4>
          </div>
          <div class="modal-body">
            <p></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

		<svg id = "lead" xmlns="http://www.w3.org/2000/svg" viewBox="0 -10 210 20" preserveAspectRatio="none">
			<defs>
				<marker id="lead-head" orient="auto" markerWidth="3" markerHeight="4" refX="0.1" refY="2">
					<path d="M0,0 V4 L3,2 Z" fill="red"></path>
				</marker>
			</defs>
			<path id="lead-line" stroke-linecap="round" marker-end="url(#lead-head)" stroke-width="5" fill="none" stroke="red" d="M0,0 200,0"></path>
		</svg>

		<div id="ui-popup"></div>

  </div> <!--  end of #layout -->

	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-59242239-2', 'auto');
	  ga('send', 'pageview');

	</script>
</body>
</html>
