
// Canvas information

var canvas = $("canvas")[0];			
	canvas_width = canvas.width;
	canvas_height = canvas.height;

var ctx = canvas.getContext("2d");

var timer;
var timer2;
var bloom_timer;

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

var Map_Object = function(id, height, width, clip_height, clip_width) {

	this.id				= id;							// the type of object
	this.size 			= {h:height, w:width};			// size of object in grid units
	this.position		= [];							// array to hold positions

	this.clip_size		 = {h:clip_height, w:clip_width};
	this.clip_state 	 = {x:0, y:0};	
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



var flower_list = [];

var Flower = function(id, height, width, clip_height, clip_width, bloom_time, bloom_probability, point_value) {

	Map_Object.call(this, id, height, width, clip_height, clip_width);

	this.bloom_time 	= bloom_time;
	this.bloom_prob 	= bloom_probability;
	this.state 			= 0;

	this.pts 			= point_value;
};

Flower.prototype = Object.create(Map_Object.prototype);

Flower.prototype.bloom = function(map) {
	if (this.state == 0) {
		this.randomlyPlace(1, map.size.w, map.size.h);
	}

	this.clip_state.x = this.state * this.clip_size.w;
	this.state = this.state + 1;

	if (this.state == 4) {
		this.clip_state.x = 0;
		this.position[0] = [-10,-10];
		this.state = 0;
		clearInterval(bloom_timer);
		bloomRandomFlower(map);
	}
};

function chooseRandomFlower() {
	var upper_bound = flower_list.length - 1;
	var rand = generateRandom(0, upper_bound);
	return flower_list[rand];
};

function bloomRandomFlower(map) {
	var randomFlower = chooseRandomFlower();
 	bloom_timer = setInterval(function(){randomFlower.bloom(map)}, randomFlower.bloom_time);
 	return bloom_timer;
};

Flower.prototype.eat = function(map) {
	scoreboard.score = scoreboard.score + this.pts;
};



var Character = function(id, height, width, clip_height, clip_width, speed) {
	Map_Object.call(this, id, height, width, clip_height, clip_width);
	this.speed 				= speed;
	this.facing_direction	= "right";
};

Charater.prototype = Object.create(Map_Object.prototype);

Character.prototype.move = function(direction) {

};

Character.prototype.eat = function(direction) {

};


// ---------------------------------------------------------------------------

// Scoreboard Object

var Scoreboard = function(score) {
	this.score 			= score;
};

Scoreboard.prototype.displayScore = function() {
	ctx.font = "18px sans-serif";
	ctx.fillText("score:  "+this.score, 10, 20);

	if (this.score >= 40) {
		tulip.eat(l1_map);
		rose.eat(l1_map);
	} 
};

var scoreboard = new Scoreboard(0);

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

// Init functions 

function init() {							// to be called after images load 
	
	var l1_map = new Map("rgb(120,216,120)", "", 50, 100);
	l1_map.setupBackground();
	createEnvironment(l1_map);				// place all the objects on the map

	timer = setInterval(function(){drawGame(l1_map)}, 20);		// animation - draw map every interval
	return timer, l1_map;	
};

function createEnvironment(map) {			// create and place all the objects on the grid
	
	map.createGrid();

//	var grass = new Map_Object("grass", 5, 2.5, 229, 479);
//	grass.randomlyPlace(5, map.size.w, map.size.h);
//	object_array.push(grass);

	var tulip = new Flower("tulip", 4, 4, 342, 342, 2000, .7, 10);
	object_array.push(tulip);
	var tulip_prob = tulip.bloom_prob * 10;
	for (i=0; i<tulip_prob; i++) {
		flower_list.push(tulip);
	}

	var rose = new Flower("rose", 4, 4, 342, 342, 1000, .3, 30);
	object_array.push(rose);
	var rose_prob = rose.bloom_prob * 10;
	for (i=0; i<rose_prob; i++) {
		flower_list.push(rose);
	}	

	bloomRandomFlower(map);
};

function drawGame(map) {
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);	// erase the canvas

	map.drawGrid();										// draw the game grid
	drawObjects();

	scoreboard.displayScore();
};


function drawObjects() {

	for (i=0; i<object_array.length; i++) {
		var object = object_array[i];
			obj_w = object.size.w * grid_unit;
			obj_h = object.size.h * grid_unit;
			image = document.getElementById(object.id);
			position = object.position;

			clip_w = object.clip_size.w;
			clip_h = object.clip_size.h;
			clip_x = object.clip_state.x;
			clip_y = object.clip_state.y;


		for (j=0; j<position.length; j++) {
			x_pos = position[j][0] * grid_unit;
			y_pos = position[j][1] * grid_unit;
			ctx.drawImage(image, clip_x, clip_y, clip_w, clip_h, y_pos, x_pos, obj_h, obj_w);
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
