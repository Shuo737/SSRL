#!/usr/bin/env python
# -*- coding: utf-8 -*-
#

import sys

try:
    from PIL import Image
except:
    print '\n\nPIL is not installed.\n\n'
    sys.exit(1)

try:
    import mapnik
except:
    print '\n\nThe mapnik library and python bindings must have been compiled and \
installed successfully before running this script.\n\n'
    sys.exit(1)

try:
    import cairo
    HAS_PYCAIRO_MODULE = True
except ImportError:
    HAS_PYCAIRO_MODULE = False

########### start of configuration ##########
input_dir = '..\\..\\data\\'
input_raster = 'nigeria_elev.tif'
input_layer_id = 'elev'
# no_data = 250
output_name = 'map'
band = 1
stops = [0, 190, 370, 560, 940]
colors = [ '#104510', '#628234', '#cccc66', '#966530', '#61150d' ]
output_opacity = 0.7
########### start of configuration ##########


file = input_dir + input_raster;
lyr = mapnik.Layer(input_layer_id)
lyr.datasource = mapnik.Gdal(file=file, type='gdal', band=band)

width, height = Image.open(file).size

wgsStr = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
mercStr = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs +over'
wgs = mapnik.Projection(wgsStr)
merc = mapnik.Projection(mercStr)
transform = mapnik.ProjTransform(wgs, merc)

m = mapnik.Map(width, height, mercStr)
# m.background = mapnik.Color('white')

# http://mapnik.org/docs/v2.0.1/api/python/mapnik._mapnik.RasterSymbolizer-class.html#scaling
# http://mapnik.org/docs/v2.0.1/api/python/mapnik._mapnik.RasterColorizer-class.html

#style

def makeStops(stop, color):
	return  mapnik.ColorizerStop(stop,  mapnik.COLORIZER_INHERIT,  mapnik.Color(color))
	
rs = mapnik.RasterSymbolizer()
# rs.mode = "normal"

rc = mapnik.RasterColorizer()
for idx, stop in enumerate(stops): 
	rc.add_stop(mapnik.ColorizerStop(stop,  mapnik.COLORIZER_INHERIT,  mapnik.Color(colors[idx])))

rs.colorizer = rc

rule1 = mapnik.Rule()
rule1.symbols.append(rs)

style1 = mapnik.Style()
style1.rules.append(rule1)
style1.opacity = output_opacity

m.append_style('style1', style1)
lyr.styles.append('style1')

m.layers.append(lyr)

# generate the xml
mapnik.save_map(m, '__' + output_name + '.xml')
print "\n\nxml generated!\n"

# generat a preview image
env = lyr.envelope()
envProjected = transform.forward(env)
margin = 50000 # 50 km
envNew = mapnik.Box2d(envProjected.minx - margin, envProjected.miny - margin, envProjected.maxx + margin, envProjected.maxy + margin)
m.zoom_to_box(envNew)
im = mapnik.Image(m.width,m.height)
mapnik.render(m, im)
im.save( '__' + output_name + '.png', 'png') # true-colour RGBA
print "\nPreview image generated. Have a look!\n\n"
