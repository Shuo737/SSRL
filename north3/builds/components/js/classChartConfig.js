global.chart_config = (function(){

  return {
    getChart: function(chart_id){
      switch(chart_id){
        case 'bar':
          return {
            icon: '<i class="icon icon-chart-bar"></i>',
            name: 'Bar',
            charts: ['bar', 'dot', 'heatmap']
          };
        case 'pie':
          return {
            icon: '<i class="icon icon-chart-pie"></i>',
            name: 'Pie',
            charts: ['pie', 'dot', 'heatmap']
          };
        case 'choropleth':
          return {
            icon: '<i class="icon icon-chart-chorop"></i>',
            name: 'choropleth',
            charts: ['chrop', 'dot', 'heat']
          };
        case 'dot':
          return {
            icon: '<i class="icon icon-chart-dot"></i>',
            name: 'Dot'
          };
        case 'heatmap':
          return {
            icon: '<i class="icon icon-chart-heat"></i>',
            name: 'Heatmap'
          };
      }
      throw 'Chart with id "' + chart_id + '" is not registered.';
      // return null;
    } // end 'getChart'
  }; // end 'return'
})();
