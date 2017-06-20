global.meta_broker = {};
global.menu_broker = {};
global.boundaries = {};

global.DEFAULT = {
	map: {
    center: [54.36136, -105.4578],
    zoom: 6,
    min_zoom: 6,
		max_zoom: 13
  },
  UI: {
    legend_font: 14
  },
  icons: {
    icoMinus: 'demo-icon icon-minus-squared',
    icoPlus: 'demo-icon icon-plus-squared',
		tree_group: 'demo-icon icon-database',
    tree_folder_open: 'demo-icon icon-minus-squared-alt',
    tree_folder_close: 'demo-icon icon-plus-squared-alt',
		tree_item: 'demo-icon icon-check-empty',
		tree_item_check: 'demo-icon icon-check',
  },
  marker_div: {
		size   : {w:40, h:40},
    anchor : {x:20, y:20},
    mradius: 40
  },
  bookmarks:[
  	{
  		"name":"Saskatchewan",
  		"latLng":[54.92660, -104.52393, 6]
  	},
  	{
  		"name":"break"
  	},
  	{
  		"name":"Prince Albert",
  		"latLng":[53.199411, -105.748731, 10]
  	},
  	{
  		"name":"Saskatoon",
  		"latLng":[52.135146, -106.651197, 10]
  	},
  	{
  		"name":"La Ronge",
  		"latLng":[55.07994, -105.30670, 9]
  	}
  ],
  url:{
  	"schema": "files/north_schema_v1.pdf"
  },
  render:{
    click_radius: 40 * 0.75, // DEFAULT.marker_div.size.w * .75,
    bar_min_years: 2,
    na: ['-99', '-999', '-9999'],
		pie: [12, 20], // default min/max size for the pie chart

		dot: [8, 19],
    dot_stroke_width: 2,
    breaks: 5,
    na_color: "#aaa",
    getcolor5: ["#ffffcc", "#ffeeaa", "#ffcc99", "#ffa083", "#ff7766"],
    getColor2: function(n){
      if (!n) n = 5;
      return d3.scale.linear()
        .domain(d3.range(this.breaks))
        .range([d3.rgb(255, 218, 213), d3.rgb(255, 119, 102)]);
    },
    getColorPie: function(){
      return d3.scale.category10().domain(d3.range(10));
    },
    ramp1: ["#bd0000","#990000","#e70000", "#bd5600", "#994500","#e76900","#009700","#007a00","#00b900","#007171","#005c5c","#008b8b"],
    ramp2: ["#e9e9e9","#e4e4e4","#e0e0e0","#dbdbdb","#d7d7d7","#d3d3d3","#bdbdbd","#a8a8a8","#939393","#7e7e7e","#696969","#545454","#3f3f3f","#2a2a2a"],
    ramp3: [
  /* red */     ["#FFB8B8", "#FF9999", "#FF7A7A", "#FF5C5C", "#FF3D3D", "#FF1E1E", "#FF0000", "#ED0000", "#DC0000", "#CA0000", "#B90000", "#A70000", "#960000"],
  /* orange */  ["#FFDBB8", "#FFCB99", "#FFBC7A", "#FFAD5C", "#FF9E3D", "#FF8F1E", "#FF8000", "#ED7700", "#DC6E00", "#CA6500", "#B95C00", "#A75300", "#964B00"],
  /* green */   ["#B8FFB8", "#99FF99", "#7AFF7A", "#5CFF5C", "#3DFF3D", "#1EFF1E", "#00FF00", "#00ED00", "#00DC00", "#00CA00", "#00B900", "#00A700", "#009600"],
  /* cyan */    ["#B8FFFF", "#99FFFF", "#7AFFFF", "#5CFFFF", "#3DFFFF", "#1EFFFF", "#00FFFF", "#00EDEE", "#00DCDD", "#00CACD", "#00B9BC", "#00A7AB", "#00969B"],
  /* blue */    ["#B8DBFF", "#99BCFF", "#7ABCFF", "#5CADFF", "#3D9EFF", "#1E8FFF", "#0080FF", "#0077EE", "#006FDE", "#0067CD", "#005EBD", "#0056AC", "#004E9C"],
  /* purple */  ["#DBB8FF", "#CB99FF", "#BC7AFF", "#AD5CFF", "#9E3DFF", "#8F1EFF", "#8000FF", "#7700EE", "#6F00DE", "#6700CD", "#5E00BD", "#5600AC", "#4E009C"],
  /* magenta */ ["#FFB8FF", "#FF99FF", "#FF7AFF", "#FF5CFF", "#FF3DFF", "#FF1EFF", "#FF00FF", "#EE00EE", "#DE00DE", "#CD00CD", "#BD00BD", "#AC00AC", "#9C009C"],
  /* yellow */  ["#FFFFB8", "#FFFF99", "#FFFF7A", "#FFFF5C", "#FFFF3D", "#FFFF1E", "#FFFF00", "#EDED00", "#DCDC00", "#CACA00", "#B9B900", "#A7A700", "#969600"]],
    recycleRampIndex: function(lyr){
      if(typeof lyr.ramp_i == 'undefined' || lyr.ramp_i < 0) return;
      if(lyr.ramp_i<0){
        console.log('err');
      }
      // console.log(lyr.id + '\'s ramp recycled');
      this.ramp3[lyr.ramp_i].used = 0;
      lyr.ramp_i = -1;
      this.ramp3.used --;
    },
    getRampIndex: function(lyr){
      if(this.ramp3.used + 1 > DEFAULT.UI.max_layers.n){
        // popMaxLayers(lyr.id);
        busy.hide();
        console.log('ramp index = -1');
        return -1;
      }

      for (var i = 0; i < this.length; i++) {
        if(!this.ramp3[i].used){
          this.ramp3[i].used = 1;
          this.ramp3.used ++;
          return i;
        }
      }
    },
  }
};
