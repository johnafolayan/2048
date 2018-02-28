var Tile = function(id, row, col) {
	this.id = id;
	this.row = row;
	this.col = col;
	this.alpha = 0;
};

Tile.prototype = {
	setPosition: function(x, y) {
		this.row = y;
		this.col = x;
	},

	render: function(ctx) {
		if (this.alpha < 1) {
			this.alpha += 0.02;
		}

		if (this.alpha > 1) {
			this.alpha = 1;
		}

		var startX = this.col * GRID_SIZE;
		var startY = this.row * GRID_SIZE;
		var id = this.id;

		if (id === null) {
			ctx.fillStyle = "hsla(0, 0%, 20%, 0.9)";
			ctx.fillRect(startX, startY, GRID_SIZE, GRID_SIZE);
			return;
		}

		var lightColor, darkColor;

		if (!COLORS[id]) {
			COLORS[id] = {};
			var hue = ~~(Math.random() * 360);
			lightColor = COLORS[id].light = "hsl(" + hue + ", 100%, 30%)";
			darkColor = COLORS[id].dark = "hsl(" + hue + ", 100%, 20%)";
		} else {
			var color = COLORS[this.id];
			lightColor = color.light;
			darkColor = color.dark;
		}

		// lightColor = "hsl(0, 0%, 90%)";
		// darkColor = "hsl(0, 0%, 80%)";

		ctx.globalAlpha = this.alpha;

		ctx.beginPath();
		ctx.moveTo(startX, startY + GRID_SIZE);
		ctx.lineTo(startX, startY);
		ctx.lineTo(startX + GRID_SIZE, startY);
		ctx.closePath();
		ctx.fillStyle = lightColor;
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(startX + GRID_SIZE, startY);
		ctx.lineTo(startX + GRID_SIZE, startY + GRID_SIZE);
		ctx.lineTo(startX, startY + GRID_SIZE);
		ctx.closePath();
		ctx.fillStyle = darkColor;
		ctx.fill();

		ctx.fillStyle = "#000";
		ctx.font = "normal 21px Trebuchet MS";
		ctx.textAlign = "center";
		ctx.fillText("" + id, startX + GRID_SIZE / 2 | 0, startY + GRID_SIZE / 2 + 3 | 0);

		// Reset
		ctx.globalAlpha = 1;
	}
};