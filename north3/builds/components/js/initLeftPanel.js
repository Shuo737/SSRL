global.$ = require('jquery');

var initLeftPanel = function(){
	global.leftPanel = $('#nav');
	leftPanel.width = parseInt(leftPanel.css('width'));
	leftPanel.isOpen = 1;
	leftPanel.backButton = $('#nav .tab .back-button');
	leftPanel.resizer = $('#nav-resizer');

	$('#content .census-button').click(function(){
		leftPanel.open();
	});

	// leftPanel.backButton.css('left', leftPanel.width + 'px');
	leftPanel.backButton.click(function(){
		if(leftPanel.isOpen){
			leftPanel.close();
		}else{
			leftPanel.open();
		}
	});

	var btnSearch = $('#btnSearchNode'); // $('#nav .tab .search-button');
	var divSearch = $('#nav #search-tree');
	var input = divSearch.find('input');

	btnSearch.click(function(){
		divSearch.css({
			'display': 'block',
			'left': btnSearch.offset().left + 'px'
		});
		input.select().focus();
	});
	input.on('keyup',function(e){
		if(e.keyCode == 13 || e.keyCode == 27){
			divSearch.css('display', 'none');
		}else{
			if(to) clearTimeout(to);
			var to = setTimeout(function() {
				var v = input.val();
				$('#nav .tree-view').jstree(true).search(v);
			}, 250);
		}
	}).on('blur', function(e){
		divSearch.css('display', 'none');
	});

	leftPanel.backButton.label = function(lbl){
		var title = leftPanel.backButton.find('.title');
		var ico = leftPanel.backButton.find('.fa');
		if(lbl){
			title.html(lbl);
			if(leftPanel.isOpen){
				ico.removeClass('icon-angle-circle-right').addClass('icon-angle-circled-left');
      }else{
				ico.removeClass('icon-angle-circled-left').addClass('icon-angle-circle-right');
      }
		}else{
			return title.html();
		}
	};

	leftPanel.close = function(){
		if(this.isOpen){
			this.isOpen = 0;
			leftPanel.resizer.css('visibility', 'hidden');
			this.animate({
				left: -1 * parseInt(leftPanel.css('width')) + 'px'
				// ,height: '2em'
			}, 300, function(){
				leftPanel.backButton.label('OPEN');
				$('#content .census-button').css('display','block');
				$('.jstree-anchor.data.jstree-clicked').blur(); // bugfix: 20160429, mouseover event is triggered after the panel has been collapsed.
			});
			// this.backButton.animate({
			// 	left: '0px'
			// }, 1000);
		}
	};

	leftPanel.open = function(){
		if(!this.isOpen){
			this.isOpen = 1;
			leftPanel.resizer.css('visibility', 'visible');
			this.animate({
				left: '0px'
				// ,height: '100%'
			}, 300, function(){
				leftPanel.backButton.label('CLOSE');
				$('#content .census-button').css('display','none');
			});
			// this.backButton.animate({
			// 	left: parseInt(leftPanel.css('width')) + 'px'
			// }, 1000);
		}
	};

	/* bind tooltips */
	setupTooltipDiv(leftPanel.backButton, 'Collapse the left panel "Census Variables".');

};
