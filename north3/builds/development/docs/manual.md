# Northern SK Communities Online Mapping System
## User's Manual
---
## Table of Contents

- [Introduction](#introduction)
- [Application layout](#application-layout)
- [Navigation](#navigation)
- [Data Structure and Chart Types](#data-structure-and-chart-types)
  - [Two data structures](#two-data-structures)
  - [Four Chart Types](#four-chart-types)
    - [Bar Chart Map](#bar-chart-map)
    - [Pie Chart Map](#pie-chart-map)
    - [Dot Map](#dot-map)
    - [Heat Map](#heat-map)
- [Contact Information](#contact-information)

## Introduction
This document will get you started with the online mapping application "Northern SK Communities Online Mapping System", which is developed and maintained by [International Centre for Northern Governance and Development (ICNGD)](http://www.usask.ca/icngd/) and [Social Sciences Research Laboratories/The Spatial Initiative (SSRL/TSI)](http://ssrl.usask.ca/), at University of Saskatchewan.

The application was developed for the ubiquitous html environment using modern open source technology. It is designed as a cross-browser application that functions in all major desktop browsers. At the current stage, the application is not optimized for mobile browsers (phones, tablets etc).
The application is an effort of organizing and presenting a wealth of social-economic variables from ICNGD in the form of quality maps, in order to provide effective decision support for First Nation communities in Northern Saskatchewan. Most maps involve data with 3 dimensions: time, location, as well as the hierarchical structure of the variable.

Though the application is designed for general browsers, Webkit browsers (Google Chrome, Apple Safari) are recommended for a much better user experience.

## Application layout

The mapping application consists of 3 components:
  - Map view
    - The map view takes most of the space and provide itself as your workspace for showing maps, as well as rendering charts.
  - Table of Contents (TOC)
    - TOC has a tree-like structure. It has all statistical variables organized as layers in the hierarchical order. There are 7 top categories, 55 items in total, and 37 layers you can map.
    - 'Close' button: This button will collapse TOC panel and hide it, so that you can have bigger desktop space for you to work on. Once collapsed, you can bring TOC panel back either by clicking the 'Table of Contents' button at the top of the page or 'Table of Contents' at the bottom toolbar.
    - There are 3 buttons in TOC:
      - *Search a variable*: This button helps you to filter all available layers using your own keywords so as to find your desired variables efficiently.
      - *Hide all layers*: This button removes all layers shown on the map. Use it as a shortcut for removing multiple layers, otherwise you need to either remove layers from their legends or from TOC.
      - *Atlas*: SSRL/TSI has manually designed quality printer-friendly PDF maps, usually only available for latest year's data. Users can access them from here.
     Although TOC is very important for you to find At its top right corner there's a 'Close' button to collapse it.
  - Bottom toolbar
    - At the bottom of the page there is a toolbar. It has 4 functions:
      - Help: the documentation for this mapping application.
      - Toggle TOC: Click 'Table of Contents' button to show or hide the TOC.
      - Search for a community: If you want to locate a community on the map, just type in the community's name here. A list of suggestions will pop up as you type. You can click an item in that list to locate it on the map.
      - Show current map's centre: At the far right shows your maps current centre, in the format of `latitude, longitude` (note that latitude is positive on the northern hemisphere, longitude is negative in the western hemisphere).

## Navigation

For general navigation on the map, the map control (`+`, `-` buttons at the map's top right corner) is effective and intuitive to use. More intuitively, the user can use a mouse with the scroll button to zoom in or out dynamically.

The user can have more control on zooming in to a specific area by holding down `SHIFT` key while dragging the mouse to define a rectangle, which will be used as the map's new extent.

## Data Structure and Chart Types

All statistical variables in the mapping system fall into these 2 categories: bar-structured and pie-structured.

### Two data structures

Bar-structured data type is for mapping time series data for simple variables (eg. number of households in all communities across 10 years). This type of data can be rendered as *bar chart*, *dot map* or *heat map*.

Pie-structured data type is for mapping time series data for compound variables (eg. various degree of education levels in all communities across 10 years). This type of data can be rendered as *pie chart*, *dot map* or *heat map*.

### Four Chart Types

The system supports rendering these 4 types of maps: bar chart map, pie chart map, dot map and heat map. When you turn on a layer of any type, its legend will also show up with detailed information about that layer, as well as settings to allow you configure that layer's appearance.

#### Bar Chart Map

A "Bar Chart Map" is generated by rendering all the values of a single target variable individually at each geographical location. A “Bar Chart Map” can effectively portray the long-term trend of a desired variable. It also compares such trends between different geographical locations.

**Interpretation** Each geographical location has several bars. The color of each bar indicates a year. The height of the bar indicates value of the target variable in that year. You can directly compare the values of any two geographical locations based on the bar’s height.

**Usage**

On the map, you can hover on a bar chart to
- highlight any bar (one year's data), making it yellow.
- tooltip shows up explaining the bar chart with detailed information: place's name, variable's name, value of current variable, rank of the current variable among all communities in the same year.

In the legend, you can
- control the layer by accessing:
  - **eye button** to temporarily turn it off. Note that once a layer is hidden, you cannot interact with it until you turn it back on by clicking the eye button again.
  - **minimize button** to collapse the legend, the collapsed legend will only have
    - the control buttons (eye, min, max)
    - the layer's title
    - chart icon in front of the title to tell what type of chart this layer produces
  - **close button** to remove the layer from the map.
- See the title of current layer
- Change chart types to dot map or heatmap
- Check its metadata
- Download the original data in Microsoft&trade; EXCEL&reg; Format.
- Configuration
  - **Border Color** Adjust the color of bar's borders
  - **Bar's Min Height** Adjust height for bars with smallest values
  - **Y Axis Transform** Whether to use the original values to make the bar chart, or apply logarithm transformation on the values before making the ba chart

#### Pie Chart Map

A " Pie Chart Map" is generated by making a pie chart of a variable for all geographical locations, with the variable containing categories of data.

**Interpretation** You can compare the size of pies because the sizes are based on the classification of the original total values (3-5 classes from low to high). The total value is the sum its categories. The application draw pie slices from 12 o’clock in the clock-wise manner.

**Usage**

On the map, you can hover your cursor on any pie to:
- Highlight the pie slice in the chart: the pie slice will become bright yellow.
- There will also be a tooltip available for that slice, showing
  - place’s name
  - name of the current variable
  - name and value of the current category
  - the displayed year

In the legend, you can
- control the layer by accessing:
  - **eye button** to temporarily turn it off. Note that once a layer is hidden, you cannot interact with it until you turn it back on by clicking the eye button again.
  - **minimize button** to collapse the legend, the collapsed legend will only have
    - the control buttons (eye, min, max)
    - the layer's title
    - chart icon in front of the title to tell what type of chart this layer produces
  - **close button** to remove the layer from the map.
- Hover your cursor on any category to highlight the corresponding pie slices on the map.
- Click the painter button to design the pie chart with your own colors.
- Click on the play button ￼(black triangle) to play the animation of the pie chart across all available time periods/years.
- Change chart types to dot map or heat map
- Check its metadata
- Download the original data in Microsoft&trade; EXCEL&reg; Format.

#### Dot Map

A dot map is generated by drawing the values of a target variable for all geographical places at the same time period/year. It supports animation to examine the dynamic change of the target variable across all available time periods/years in the database.

**Interpretation** The values of the variable are classified into 3 to 5 categories (low to high), indicated by the size of the dots. Note that the size of the dot corresponds to its classified category instead of its original value (A twice as big as B doesn’t mean A’s original value of the variable is twice as big as B’s). The dot map is effective at comparing the values of a desired variable for all geographical places at the same time period.

**Usage**

On the map, you can hover your cursor on any dot to
- Highlight the dot in the charts: the dot will become bright yellow.
- There will also be a tooltip available for that dot, showing
  - place’s name
  - name of the current variable
  - value of the current variable at the displayed year
  - *optional* rank of the current variable at the displayed year among all the places in this layer

In the legend, you can
- Control the layer by accessing:
  - **eye button** to temporarily turn it off. Note that once a layer is hidden, you cannot interact with it until you turn it back on by clicking the eye button again.
  - **minimize button** to collapse the legend, the collapsed legend will only have
    - the control buttons (eye, min, max)
    - the layer's title
    - chart icon in front of the title to tell what type of chart this layer produces
  - **close button** to remove the layer from the map
- Click on the color patch or name of each year (eg. 2014) to update the map for that year.
- *Pie chart only* click on the color patch for any category to update the map for that category
- Click on the play button (black triangle)￼ to play the animation of the dot map across all time periods/years.
- Change chart types to pie/bar chart map or heat map
- Check its metadata
- Download the original data in Microsoft&trade; EXCEL&reg; Format.

#### Heat Map

A "heat map" is generated based on a dot map. It is good at portraying the clustering pattern of a desired variable. If the default rendering scheme is used, red means more clustering whereas green means the opposite.

**Usage**

On the map, you can hover your cursor anywhere to
- bring up a tooltip showing  - place’s name
  - name of the current variable
  - interpolated value of the current variable at your cursor's location at the displayed year, for the current category (pie chart)

In the legend, you can
- Control the layer by accessing:
  - **eye button** to temporarily turn it off. Note that once a layer is hidden, you cannot interact with it until you turn it back on by clicking the eye button again.
  - **minimize button** to collapse the legend, the collapsed legend will only have
    - the control buttons (eye, min, max)
    - the layer's title
    - chart icon in front of the title to tell what type of chart this layer produces
  - **close button** to remove the layer from the map
- Click on the color patch or name of each year (eg. 2014) to update the map for that year.
- *Pie chart only* click on the color patch for any category to update the map for that category
- Click on the play button (black triangle)￼ to play the animation of the dot map across all time periods/years.
- Change chart types to pie/bar chart map or dot map
- Check its metadata
- Download the original data in Microsoft&trade; EXCEL&reg; Format.
- Configuration
  - **Theme** Adjust the color scheme used for producing the heat map. There are in total 4 color schemes to choose from.
  - **Exaggeration** Whether to use the original values to make the heat map, or apply a factor (multiplier) to the original values before making the heat map. This comes in convenient if the default rendering is either extremely *hot* or *cold*.

## Contact Information

This project is supervised by Dr. Winston Zeng (winston.zeng@usask.ca) at SSRL, University of Saskatchewan. These are the project teams:

|Team|Member|Responsibility|
|---|---|---|
|GIS Data Analysts|Jane Lu (xil242@mail.usask.ca)<br>Xiaolei Yu (yxl1919@gmail.com)<br>Sisi Zhang (sisi.zhang@usask.ca)| - Search, catalogue and analyze spatial layers / statistical data<br> - Produce cartographic output (pdf, jpg maps)|
|WebGIS Development|Matthew Li (gismatthew@gmail.com)<br>Jane Lu (xil242@mail.usask.ca)| - Design the user interface and develop the functionality of the web application for the client side (front-end)<br> - Develop the supporting services running on the server side (back-end) <br> - Produce documentation (this user manual)|

---
SSRL/TSI, September 2016
