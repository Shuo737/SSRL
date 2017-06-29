# `{project}_config.js`

## Purpose
`{project}_config.js` is used to compile Mapnik XML files while will be used directly to publish vector tile services.

`{project}_config.js` is designed to solve these issues:
- *exposing which fields?* it's common for a layer to have lots of fields. When we publish a layer to our online mapping app, We may want to only expose certain fields, due to the fact that
  - some fields are maintained by the GIS system (eg. FID, Shape, Shape_Length etc.) and thus are not intended for human-reading.
  - some fields are not relevant to our project or the end user. This applies to most layers in the 'Background' category which are downloaded from the internet with lots of attribute info and only some of them are used in our project.
- *field mapping* meanwhile most of the time we want to present our attribute table in a better way than just throw what it is to our end user. For example, we have a field named 'OC' which we know indicates 'Organic Content of the soil sample' for instance. However, the end user may have no clue what 'OC' means. `{project}_config.js` is able to map field names as desired so that the user will see 'Organic Content' in their browser instead of the arcane name 'OC'. This becomes very necessary when we have long field names. Since Colin's file GDB is populated through Shapefiles, we have lots of confusing field names due to Shapefile's outdated DBF engine. For example, in table 'Research_Data_INuWaM_KoumagouB', we have these fields "Number_of", "Number_o_1", "Number_o_2", "Number_o_3", which Colin later 'decoded' as "Number of wives", "Number of children", "Number of Workers", "Number of Non-worker children" &mdash; this will be impossible for others to decide what they are based on the field names. This happens because Shapefile's DBF engine renames long field names to 11 characters and some vitally important info are chopped off during the process.

## Usage

```js
[
  /* a layer definition example from 'Background' category */
  {
    /* this layer's id, will be reference at the front-end */
    "id": "adm0",
    
    /* fields exposed to the front-end online mapping app */
    "fields": ["NAME_ENGLI", "ISO", "NAME_FRENC"],
    
    /* mapped field names, should be end-user-friendly */
    "fieldNames": ["Name", "ISO", "French_Name"],
    
    /* feature classes to be published,
      if this layer consists of multiple feature classes,
      (e.g. a layer in 'Background' category has parts
      of different countries), we use 'layers' to hold
      the array of all feature classes
    */
    "layers": ["Benin_adm0", "BurkinaFaso_adm0", "Mali_adm0", "Niger_adm0", "Nigeria_adm0"],
    
    /* if 'layers' is an array, you have to populate
      'countries' array with all country identifiers
      which are in the correct order as defined in
      'layers' array
     */
    "countries": ["Benin", "BurkinaFaso", "Mali", "Niger", "Nigeria"],
    
    /* location of the file GDB */
    "gdb": "C:/WestAfricaFoodSecurity/BaseMaps.gdb"
  },
  
  /* an layer definition example from project2 */
  {
    "id": "beninResearchLocations",
    "fields": ["Village", "Districts"],
    "fieldNames": ["Village", "Districts"],
    
    /* for this layer, we don't have multi-parts,
      so the 'layers' array will have one item.
      And we don't need to define 'countries'.
    */
    "layers": ["Benin_Locations_MicroVeg"],
    "gdb": "C:/WestAfricaFoodSecurity/MicroVeg/MicroVeg.gdb"
  },
  
  /* a layer definition example from project1 */
  {
    "id": "proj1_data_RWH",
    "fields": ["Treatments", "N_Avg", "P_Avg", "pH_Avg", "EC_Avg", "OC_Avg", "Soil_Sampl", "Avail_P"],
    "fieldNames": ["Treatments", "N_Avg", "P_Avg", "pH_Avg", "EC_Avg", "OC_Avg", "Soil_Sample", "Available_P"],
    "layers": ["Research_Data_INuWaM_BurkinaFaso_RWH"],
    
    /* this layer is a non-spatial layer, but it should
      have a field 'Join_ID' so that it can be joined to
      its associated spatial layer defined in 'spatial'
      here. 'spatial' also has 'Join_ID'. Colin processed
      all research data to separate spatial info with non-
      spatial info into different tables.
     */
    "spatial": "Research_Locations_INuWaM",
    "gdb": "C:/WestAfricaFoodSecurity/INuWaM- Project1.gdb"
  }
]
```
