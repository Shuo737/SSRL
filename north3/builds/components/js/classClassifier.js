global.Classifier = function(layer){
	if(!(layer instanceof Layer)){
		throw 'a [Layer] object is required to create a [Theme] object.';
	}else{
		this._layer = layer;
	}
	this._classification = {};
};

global.Classifier.prototype.getClassification = function(n){
	return this._classification;
};

global.Classifier.prototype.quantile = function(n){
	// n--;

	var _data = this._layer.getClassificationData();
	var i;
	var breaks = [];
	for (i = 0; i < n; i++) {
		breaks.push(i * 100 / n);
	}

	var q = d3.scale.quantile().domain(_data).range(breaks);
	var qt =  q.quantiles().map(function(a){return Math.round(a*10)/10;});

	var rng = [];
	var ext = d3.extent(_data);
	rng.push(numberWithCommas(ext[0]) + '~' + numberWithCommas(qt[0]));
	for (i = 0; i < n-2; i++) {
		rng.push(numberWithCommas(qt[i]) + '~' + numberWithCommas(qt[i+1]));
	}
	rng.push(numberWithCommas(qt[n-2]) + '~' + numberWithCommas(ext[1]));

	_data = null;

	// var rng = breaks.map(function(a){return q.invertExtent(a).toString().replace(',','~')});
	this._classification = {
		method: 'Quantile',
		breaks: qt,
		ranges: rng,
		extent: ext
	};

	return this._classification;
};
