var CELLSIZE = 80;
var GRIDWIDTH = 12;
var GRIDHEIGHT = 12;
var CELLMARGIN = 10;

function grid() {
	var grids = document.getElementsByClassName('grid');

	var initGrids = toArray(grids).map(function(el) {
		return new Grid(el);
	});
}

function toArray(obj) {
	var arr = [];

	for(var x = 0; x < obj.length; x++) {
		arr.push(obj[x]);
	}

	return arr;
}

function Grid(el) {
	var grid = this;
	var cells = el.getElementsByClassName('cell');

	this.cells = toArray(cells).map(function(cell) {
		var result = {};
		var size = cell.className.match(/width-([0-9]+)/)[1]

		cell.classList.add('height-' + size);
		cell.addEventListener('click', function() {
			grid.focus(result);
		});

		result.el = cell;
		result.size = size;
		result.width = size;
		result.height = size;

		return result;
	});

	this.redraw();
}

Grid.prototype.redraw = function() {
	/* Prepare our layout */
	var layout = [];
	for(var x = 0; x < GRIDWIDTH; x++) {
		var column = [];

		for(var y = 0; y < GRIDHEIGHT; y++) {
			column.push(false);
		}

		layout.push(column);
	}

	/* Find optimal solution */
	this.cells.forEach(function(cell) {
		for(var x = 0; x < layout.length - cell.width; x++) {
			for(var y = 0; y < layout[x].length - cell.height; y++) {
				var free = true;

				for(var w = 0; w < cell.width; w++) {
					for(var h = 0; h < cell.height; h++) {
						if(layout[x + w][y + h]) {
							free = false;
						}
					}
				}

				if(free) {
					for(var w = 0; w < cell.width; w++) {
						for(var h = 0; h < cell.height; h++) {
							layout[x + w][y + h] = true;
						}
					}

					cell.el.classList.remove('col-' + cell.col);
					cell.el.classList.remove('row-' + cell.row);
					cell.col = y + 1;
					cell.row = x + 1;
					cell.el.classList.add('col-' + cell.col);
					cell.el.classList.add('row-' + cell.row);
					return;
				}
			}
		}
	}, this);
}

Grid.prototype.focus = function(cell) {
	this.cells.forEach(function(c) {
		c.el.classList.remove('focussed');
		c.el.classList.remove('width-' + c.height);
		c.el.classList.remove('height-' + c.width);
		c.width = c.size;
		c.height = c.size;
		c.el.classList.add('width-' + c.height);
		c.el.classList.add('height-' + c.width);

	});

	cell.el.classList.remove('width-' + cell.height);
	cell.el.classList.remove('height-' + cell.width);
	cell.width = 2;
	cell.height = 3;
	cell.el.classList.add('focussed');
	cell.el.classList.add('width-' + cell.height);
	cell.el.classList.add('height-' + cell.width);

	this.redraw();
}