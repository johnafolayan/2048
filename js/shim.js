window.requestAnimationFrame = window.requestAnimationFrame 
							|| window.mozRequestAnimationFrame
							|| window.webkitRequestAnimationFrame
							|| window.msRequestAnimationFrame
							|| function(callback) {
								return window.setTimeout(callback, 1000/60);
							};

window.getTime = function() {
	return (new Date()).getTime();
};