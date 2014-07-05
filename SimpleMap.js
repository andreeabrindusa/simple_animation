
// Canvas information

var canvas = $("canvas")[0];			
	canvas_width = canvas.width;
	canvas_height = canvas.height;

var ctx = canvas.getContext("2d");

var timer;

// ---------------------------------------------------------------------------

// The Map

var grid_unit = 10;

var Map = function(bkgd_color, bkgd_image, width, height) {

	this.bkgd_color		= bkgd_color;					// default color of the map
	this.bkgd_image		= bkgd_image;					// image used as background (optional)
	this.size			= {w: width, h: height};		// size of map in grid units
	this.grid 			= [];							// array used as game grid
};

Map.prototype.createGrid = function() {					// create blank game grid

	for (col=0; col<this.size.h; col++) {
		var row = [];

		for (r=0; r<this.size.w; r++) {
			row[r] = 0;
		};

		this.grid[col] = row;
	};
};

Map.prototype.setupBackground = function() {

	$("#canvas").css("background-color",this.bkgd_color);

	if (this.bkgd_image != "") {
		$("#canvas").css("background-image", "url('" + bkgd_image + "')");
	}
};

Map.prototype.drawGrid = function() {

	ctx.lineWidth = 1;
	ctx.strokeStyle = "white";

	for (col=0; col<this.size.h; col++) {
		ctx.beginPath();
		ctx.moveTo(col*grid_unit, 0);
		ctx.lineTo(col*grid_unit, canvas_height);
		ctx.stroke();
	};

	for (row=0; row<this.size.w; row++) {
		ctx.beginPath();
		ctx.moveTo(0, row*grid_unit);
		ctx.lineTo(canvas_width, row*grid_unit);
		ctx.stroke();
	};
};

// ---------------------------------------------------------------------------

// Map Objects

var object_array = [];

var Map_Object = function(id, height, width) {

	this.id				= id;							// the type of object
	this.size 			= {h:height, w:width};			// size of object in grid units
	this.position		= [];							// array to hold positions
};

Map_Object.prototype.randomlyPlace = function(total, map_w, map_h) {

	obj_h = this.size.h;
	obj_w = this.size.w;

	for (i=0; i<total; i++) {
		this.position[i] = [];

		rand_x = generateRandom(0, map_w-obj_w);
		rand_y = generateRandom(0, map_h-obj_h);

		this.position[i] = [rand_x, rand_y];
	};

};


// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

// Init functions 

function init() {							// to be called after images load 
	
	var l1_map = new Map("rgb(120,216,120)", "", 50, 100);
	l1_map.setupBackground();
	createEnvironment(l1_map);				// place all the objects on the map

	timer = setInterval(drawGame(l1_map), 10);		// animation - draw map every interval
	return timer, l1_map;	
};

function createEnvironment(map) {			// create and place all the objects on the grid
	
	map.createGrid();

	var grass = new Map_Object("grass", 6, 3);
	grass.randomlyPlace(5, map.size.w, map.size.h);
	object_array.push(grass);

	var flower = new Map_Object("flower", 5, 5);
	flower.randomlyPlace(1, map.size.w, map.size.h);
	object_array.push(flower);

};

function drawGame(map) {
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);	// erase the canvas

	map.drawGrid();										// draw the game grid
	drawObjects();
};

function drawObjects() {

	for (i=0; i<object_array.length; i++) {
		var object = object_array[i];
			obj_w = object.size.w * grid_unit;
			obj_h = object.size.h * grid_unit;
			image = document.getElementById(object.id);
			position = object.position;

		for (j=0; j<position.length; j++) {
			x_pos = position[j][0] * grid_unit;
			y_pos = position[j][1] * grid_unit;
			ctx.drawImage(image, y_pos, x_pos, obj_h, obj_w);
		};
	};
};



// ----------------------------------------------------------------------------

// Helper functions

function generateRandom(lower_bound, upper_bound) {
	var diff = upper_bound - lower_bound;

	var rand = Math.round(Math.random() * diff);
	rand = rand + lower_bound;

	return rand;
};
