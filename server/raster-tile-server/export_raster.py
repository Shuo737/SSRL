# -*- coding: utf-8 -*-
# ---------------------------------------------------------------------------
# export_raster.py
# Created on: 2016-08-26 21:50:25.00000
# Author: Matthew Li (gismatthew@gmail.com)
# Description: Export rasters in File GDB to GeoTiff format.
# ---------------------------------------------------------------------------

# Import arcpy module
import arcpy
import ConversionUtils

##################### Begin of Configuration #################
# project code. Possible values are: basemaps, project1, project2
project_code = "basemaps"

# location of soil-db project's File GDB
soil_db_gdb = "C:\\WestAfricaFoodSecurity\\BaseMaps.gdb\\"

# put all rasters into the array below
rasters = [

    "elevation_Nigeria",
    "Nigeria_PrecAnnual",
    "Nigeria_TempAnnual",

    "elevation_Benin",
    "Benin_PrecAnnual",
    "Benin_TempAnnual",

    "elevation_BurkinaFaso",
    "BurkinaFaso_PrecAnnual",
    "BurkinaFaso_TempAnnual",

    "elevation_Mali",
    "Mali_PrecAnnual",
    "Mali_TempAnnual",

    "elevation_Niger",
    "Niger_PrecAnnual",
    "Niger_TempAnnual"
]

# rename all input rasters, follow this schema: {country}_{layer}
rasters_new_name = [

    project_code + "_nigeria_elev",
    project_code + "_nigeria_prcp",
    project_code + "_nigeria_temp",

    project_code + "_benin_elev",
    project_code + "_benin_prcp",
    project_code + "_benin_temp",

    project_code + "_burkinafaso_elev",
    project_code + "_burkinafaso_prcp",
    project_code + "_burkinafaso_temp",

    project_code + "_mali_elev",
    project_code + "_mali_prcp",
    project_code + "_mali_temp",

    project_code + "_niger_elev",
    project_code + "_niger_prcp",
    project_code + "_niger_temp"
]

# output directory
output_dir = "C:\\Program Files (x86)\\PostgreSQL\\EnterpriseDB-ApachePHP\\apache\\www\\soil-db\\data\\server-raster\\data\\"

##################### End of Configuration ###################

def getInputPath(path):
  return soil_db_gdb + path

def getOutputPath(path):
  return output_dir + path + ".tif"

rasters = map(getInputPath, rasters)
rasters_new_name = map(getOutputPath, rasters_new_name)

print '=============='
for idx, raster in enumerate(rasters):
  try:
	raster = ConversionUtils.ValidateInputRaster(raster)
	print " - exporting %s to %s" % (raster, rasters_new_name[idx])
	ConversionUtils.CopyRasters(raster, rasters_new_name[idx], "")
  except Exception, ErrorDesc:
	print ConversionUtils.gp.GetMessages(2)

print 'Job done!'
print '=============='
