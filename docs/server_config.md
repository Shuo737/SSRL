#Server Configuration

##GDAL Installation

Install the following `msi`s from [here](http://www.gisinternals.com/query.html?content=filelist&file=release-1800-x64-gdal-2-1-0-mapserver-7-0-1.zip).

###Steps:
1. gdal-201-1800-x64-core.msi
2. add 'C:\Program Files\GDAL' to system's PATH
3. gdal-201-1800-x64-filegdb.msi
4. GDAL-2.1.0.win-amd64-py3.4.msi
5. GDAL-2.1.0.win-amd64-py2.7.msi

## Mapnik Installation
Download the Windows Installer from [here](http://mapnik.s3.amazonaws.com/dist/v2.2.0/mapnik-win-sdk-v2.2.0.zip).
### Using mapnik
``` bash
set PATH=C:\Users\mel044\Documents\mapnik-v2.2.0\lib;%PATH%
set PATH=C:\Users\mel044\Documents\mapnik-v2.2.0\bin;%PATH%
set PYTHONPATH=C:\Users\mel044\Documents\mapnik-v2.2.0\python\2.7\site-packages;%PYTHONPATH%
set PATH=C:\Python27\ArcGIS10.3;%PATH%
cd C:\Users\mel044\Documents\mapnik-v2.2.0\demo\python

# run the demo
python rundemo.py
```
You can produce an `xml` using `mapnik`'s `python` bindings:

``` python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#
#
# This file is part of Mapnik (c++ mapping toolkit)
# Copyright (C) 2005 Jean-Francois Doyon
#
# Mapnik is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.

# Import everything.  In this case this is safe, in more complex systems, you
# will want to be more selective.

import sys

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

# Instanciate a map, giving it a width and height. Remember: the word "map" is
# reserved in Python! :)

m = mapnik.Map(800,600,"+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs")

# Set its background colour. More on colours later ...

m.background = mapnik.Color('white')

# Instanciate a layer.  The parameters depend on the type of data:
# shape:
#     type='shape'
#     file='/path/to/shape'
# raster:
#     type='raster'
#     file='/path/to/raster'
# postgis:
#     type='postgis'
#     host='127.0.0.1'
#     dbname='mydatabase'
#     user='myusername'
#     password='mypassword'
#     table= TODO

provpoly_lyr = mapnik.Layer('adm0')
provpoly_lyr.srs = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
provpoly_lyr.datasource = mapnik.SQLite(file='C:/WestAfricaFoodSecurity/gdb.sqlite', table='Nigeria_adm0')

provpoly_style = mapnik.Style()

m.append_style('adm0', provpoly_style)

# Then associate the style to the layer itself.

provpoly_lyr.styles.append('adm0')

m.layers.append(provpoly_lyr)

print "\n\nHave a look!\n\n"

mapnik.save_map(m,"map.xml")

```