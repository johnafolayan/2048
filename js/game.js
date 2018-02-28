var Game = function(width, height, id) {
	this.width = width;
	this.height = height;

	this.el = document.getElementById(id);
	this.ctx = this.el.getContext("2d");
	this.scale = 1;

	this.grid = [];
	this.resetGrid();

	this.startTime = 0;
	this.lastTime = 0;
	this.dt = 0;
	this.time = 0 * 60;
	this.endingGame = 0;
	// this.time = 5 * 60;

	this.score = 0;
	this.hiscore = Number(localStorage.getItem("2048-hi") || 0);

	this._tick = this.tick.bind(this);
	this.touch = { x: 0, y: 0 };

	this.resizeCanvas();

	window.addEventListener("resize", this.resizeCanvas.bind(this));
	document.addEventListener("keydown", this.onKeyDown.bind(this));
	document.addEventListener("touchstart", this.onTouchStart.bind(this));
	document.addEventListener("touchend", this.onTouchEnd.bind(this));
};

Game.prototype = {
	onTouchStart: function(evt) {
		var e = evt.changedTouches[0];
		var pageX = (e.pageX - this.el.offsetLeft) / this.scale;
		var pageY = (e.pageY - this.el.offsetTop) / this.scale;

		this.touch.x = pageX;
		this.touch.y = pageY;
	},

	onTouchEnd: function(evt) {
		var e = evt.changedTouches[0];
		var pageX = (e.pageX - this.el.offsetLeft) / this.scale;
		var pageY = (e.pageY - this.el.offsetTop) / this.scale;

		var dx = pageX - this.touch.x;
		var dy = pageY - this.touch.y;
		var valid = Math.abs(dx) > 5 || Math.abs(dy) > 5;

		if (valid) {
			if (Math.abs(dx) > Math.abs(dy)) {
				this.moveTilesX(Math.sign(dx));
			} else {
				this.moveTilesY(Math.sign(dy));
			}
		}
	},	

	onKeyDown: function(e) {
		var key = e.keyCode || e.charCode;
		switch (key) {
			case 37:
				this.moveTilesX(-1);
				break;
			case 38:
				this.moveTilesY(-1);
				break;
			case 39: 
				this.moveTilesX(1);
				break;
			case 40:
				this.moveTilesY(1);
				break;
		}
	},

	addToScore: function(a) {
		this.score += a;
		this.saveHighscore();
	},

	saveHighscore: function() {
		if (this.score > this.hiscore) {
			this.hiscore = this.score;
			localStorage.setItem("2048-hi", this.hiscore);
		}
	},

	getTileTowards: function(row, col, dir, inc) {
		var t = this.grid[row][col];
		var end = inc === -1 ? 0 : dir === "row" ? this.grid.length : this.grid[0].length;
		var count = 0;
		if (inc == -1) {
			for (var i = t[dir] - 1; i >= 0; i--) {
				if (dir === "row") {
					if (this.grid[i][col].id !== null) return this.grid[i][col];
				} else {
					if (this.grid[row][i].id !== null) return this.grid[row][i];
				}
			}
		} else {
			for (var i = t[dir] + 1; i < end; i++) {
				if (dir === "row") {
					if (this.grid[i][col].id !== null) return this.grid[i][col];
				} else {
					if (this.grid[row][i].id !== null) return this.grid[row][i];
				}
			}
		}
		return null;
	},

	moveTilesX: function(dir) {
		var _this = this,
			grid = this.grid,
			rows = grid.length,
			cols = grid[0].length,
			first,
			tile,
			id1, id2,
			moved = false,
			t;

		function cb(i, j) {
			t = grid[i][j];
			id1 = t.id;
			if (t.id === null) return;
			first = _this.getTileTowards(t.row, t.col, "col", dir);

			if (first) {
				id2 = first.id;
				if (id1 === id2) {
					first.id *= 2;
					t.id = null;
					moved = true;
					_this.addToScore(first.id);
				} else {
					tile = grid[t.row][first.col - dir];
					if (!tile) return;
					if (t.col !== tile.col) {
						tile.id = id1;
						t.id = null;
						moved = true;
					}
				}
			} else {
				tile = grid[t.row][dir === -1 ? 0 : cols - 1];
				if (t.col !== tile.col) {
					tile.id = t.id;
					t.id = null;
					moved = true;
				}
			}
		}

		if (dir === -1) {
			for (var i = 0; i < rows; i++) {
				for (var j = 0; j < cols; j++) {
					cb(i, j);
				}
			}
		} else {
			for (var i = 0; i < rows; i++) {
				for (var j = cols - 1; j >= 0; j--) {
					cb(i, j);
				}
			}
		}

		if (moved) {
			this.addTile();
		}
	},

	moveTilesY: function(dir) {
		var _this = this,
			grid = this.grid,
			rows = grid.length,
			cols = grid[0].length,
			first,
			tile,
			id1, id2,
			moved = false,
			t;

		function cb(i, j) {
			t = grid[i][j];
			id1 = t.id;
			if (t.id === null) return;
			first = _this.getTileTowards(t.row, t.col, "row", dir);

			if (first) {
				id2 = first.id;
				if (id1 === id2) {
					first.id *= 2;
					t.id = null;
					moved = true;
					_this.addToScore(first.id);
				} else {
					tile = grid[first.row - dir][t.col];
					if (t.row !== tile.row) {
						tile.id = t.id;
						t.id = null;
						moved = true;
					}
				}
			} else {
				tile = grid[dir === -1 ? 0 : rows - 1][t.col];
				if (t.row !== tile.row) {
					tile.id = t.id;
					t.id = null;
					moved = true;
				}
			}
		}

		if (dir === -1) {
			for (var i = 0; i < rows; i++) {
				for (var j = cols - 1; j >= 0; j--) {
					cb(i, j);
				}
			}
		} else {
			for (var i = rows - 1; i >= 0; i--) {
				for (var j = 0; j < cols; j++) {
					cb(i, j);
				}
			}
		}

		if (moved) {
			this.addTile();
		}
	},

	addTile: function(start) {
		var p2 = 0.55,
			p4 = 0.45;

		if (start) {
			p2 = 0.85;
			p4 = 0.15;
		}

		var col = ~~rand(0, GRID_COLS);
		var row = ~~rand(0, GRID_ROWS);
		var full = this.gridFull();
			
		while (!full && this.grid[row][col].id !== null) {
			col = ~~rand(0, GRID_COLS);
			row = ~~rand(0, GRID_ROWS);
		}

		var id;
		var r = rand(0, 1);
		// Weight
		if (r < p2) {
			id = 2;
		} else {
			id = 4;
		}

		this.grid[row][col].id = id;
		this.grid[row][col].alpha = 0;
	},

	resizeCanvas: function() {
		var ww = window.innerWidth,
			wh = window.innerHeight;

		this.el.width = this.width;
		this.el.height = this.height;

		var r0 = ww / wh;
		var r1 = this.width / this.height;
		var cssW, cssH;

		if (r0 > r1) {
			cssH = wh;
			cssW = cssH * r1;
		} else {
			cssW = ww;
			cssH = cssW / r1;
		}

		cssW = Math.floor(cssW);
		cssH = Math.floor(cssH);

		this.el.style.width = cssW + "px";
		this.el.style.height = cssH + "px";

		this.el.style.marginLeft = Math.floor((ww - cssW) / 2) + "px";
		this.el.style.marginTop = Math.floor((wh - cssH) / 2) + "px";
	},

	resetGrid: function() {
		this.grid.length = 0;
		for (var i = 0; i < GRID_ROWS; i++) {
			this.grid[i] = [];
			for (var j = 0; j < GRID_COLS; j++) {
				this.grid[i][j] = new Tile(null, i, j);
			}
		}

		this.addTile(true);
		this.addTile(true);
	},

	gridFull: function() {
		var collapsed = this.grid.reduce(function(array, r) {
			return array.concat(r);
		}, []);

		var tiles = collapsed.filter(function(tile) {
			return tile.id !== null;
		});

		return tiles.length === (GRID_COLS * GRID_ROWS);
	},

	tileAt: function(row, col) {
		if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) {
			return null;
		}
		return this.grid[row][col];
	},

	possibleMove: function() {
		// Perform a neighborhood search
		for (var i = 0; i < GRID_ROWS; i++) {
			for (var j = 0; j < GRID_COLS; j++) {
				var tile      = this.grid[i][j];
				var tileLeft  = this.tileAt(    i, j - 1);
				var tileUp    = this.tileAt(i - 1, j);
				var tileRight = this.tileAt(    i, j + 1);
				var tileDown  = this.tileAt(i + 1, j);

				if ((tileLeft && tileLeft.id === tile.id) ||
					(tileUp && tileUp.id === tile.id) ||
					(tileRight && tileRight.id === tile.id) ||
					(tileDown && tileDown.id === tile.id)) {
					return true;
				}
			}
		}

		return false;
	},

	start: function() {
		this.startTime = Date.now();
		requestAnimationFrame(this._tick);
	},

	tick: function() {
		// Numerical integration for time
		var now = getTime();
		if (this.lastTime === 0) this.lastTime = now;

		this.dt = Math.min(1, (now - this.lastTime) / 1000);
		this.lastTime = now;
		this.time += this.dt;

		// Check every 5s
		if (this.endingGame <= 0 && this.time % (60 * 5)) {
			if (this.gridFull() && !this.possibleMove()) {
				this.endingGame = 5;
			}
		}

		var ending = this.endingGame > 0;

		if (ending) {
			this.endingGame -= this.dt;
		}

		var width = this.width,
			height = this.height,
			offsetX = Math.max(0, Math.floor((width - (GRID_COLS * GRID_SIZE + TILE_SPACING * GRID_COLS)) / 2)),
			offsetY = ~~Math.max(height * 0.15, height - (GRID_ROWS * GRID_SIZE + TILE_SPACING * GRID_ROWS) - height * 0.25),

			ctx = this.ctx;

		// Background
		ctx.fillStyle = BG_COLOR;
		ctx.fillRect(0, 0, width, height);

		ctx.fillStyle = "#fff";
		ctx.font = "normal 28px Trebuchet MS";
		ctx.textAlign = "center";
		ctx.fillText(formatTime(this.time), width * 0.5, 50);

		ctx.strokeStyle = "#fff";
		ctx.beginPath();
		ctx.moveTo(width * 0.35, 40);
		ctx.lineTo(width * 0.4, 40);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(width * 0.6, 40);
		ctx.lineTo(width * 0.65, 40);
		ctx.stroke();

		ctx.fillStyle = "#fff";
		ctx.textAlign = "left";

		var scoreOffset = 100;
		// var marginY = offsetY + GRID_ROWS * GRID_SIZE + 80;
		var marginY = offsetY - 80;

		var score = "Score: " + this.score;
		var w = ctx.measureText(score).width;
		ctx.font = "normal 22px Trebuchet MS";
		ctx.fillText(score, scoreOffset, marginY);

		score = "Highscore: " + this.hiscore;
		var w = ctx.measureText(score).width;
		ctx.font = "normal 22px Trebuchet MS";
		ctx.textAlign = "right";
		ctx.fillText(score, width - scoreOffset, marginY);

		// ctx.lineWidth = 3;

		// ctx.beginPath();
		// ctx.arc(100, height - 50, 10, degToRad(20), degToRad(120), false);
		// ctx.strokeStyle = "#fff";
		// ctx.stroke();

		// ctx.beginPath();
		// ctx.arc(100, height - 50, 10, degToRad(190), degToRad(310), false);
		// ctx.strokeStyle = "#fff";
		// ctx.stroke();

		// ctx.lineWidth = 1;

		ctx.save();
		ctx.translate(offsetX, offsetY);

		if (ending) {
			ctx.globalAlpha = 0.4;
		}

		for (var i = 0; i < GRID_ROWS; i++) {
			ctx.save();
			ctx.translate(0, TILE_SPACING * i);
			for (var j = 0; j < GRID_COLS; j++) {
				var tile = this.grid[i][j];
				tile.render(ctx);
				ctx.translate(TILE_SPACING, 0);
			}
			ctx.restore();
		}

		ctx.restore();

		ctx.globalAlpha = 1.0;

		if (ending) {
			ctx.fillStyle = "hsl(80,100%,50%)";
			ctx.fillRect(0, height * 0.35, width, height * 0.25);
			ctx.font = "28px Trebuchet MS";
			ctx.textAlign = "center";
			ctx.fillStyle = "#000";
			ctx.fillText("You lose! You did well to score " + this.score + " pts!", width / 2, height / 2 - 15);
		}

		ctx.restore();

		requestAnimationFrame(this._tick);
	}
};