function rand(a, b) {
	return a + Math.random() * (b - a);
}

function formatTime(time) {
	var seconds = ~~(time % 60);
	var minutes = ~~(time / 60);
	return pad(minutes) + " : " + pad(seconds);
}

function pad(n) {
	n = "" + n;
	while (n.length < 2) {
		n = "0" + n;
	}
	return n;
}

function degToRad(n) {
	return n * Math.PI / 180;
}