var apiKey = '&APPID=2664a8f717e9cd0c3d61f2a4990d5df5'; 
var baseURL = 'http://api.openweathermap.org/data/2.5/weather?q=';
var options = '&units=Imperial';
var endPointOnLoad = baseURL + 'Atlanta' + options + apiKey;
var iconBaseURL = 'http://openweathermap.org/img/w/';

var currTemp = 0;
var currPerc = 0;
var weatherIcon = 0;
var weatherDescription = '';
var cityName = '';
var context;

function getWeatherReport(endPoint) {
	var theEndPoint = endPoint;
	$.getJSON(theEndPoint, function(weatherData) {
		currTemp = weatherData.main.temp;
		weatherIcon = weatherData.weather[0].icon;
		weatherDescription = weatherData.weather[0].main;
		cityName = weatherData.name;
		displayWeatherData();
	});
}

function animate(current) {
	var roundedTemp = Math.round(currTemp);
	var currTempStr = roundedTemp + '°F';
	var tempColor = setTempColor(currTemp);
	// begin the gray circle
	context.fillStyle = '#ccc';
	context.beginPath();
	context.arc(155,75,65,0,2*Math.PI);
	context.closePath();
	context.fill();
	// done drawing the gray circle; now the arc...
	// set line width and line color
	context.lineWidth = 10;
	context.strokeStyle = tempColor;
	// start a new path before drawing the arc
	context.beginPath();
	// draw to the full circle * current percentage, then add 1.5*Pi; this will start at 12 o'clock
	context.arc(155, 75, 70, 1.5*Math.PI, (Math.PI*2*current) + (1.5*Math.PI));
	// to draw, use stroke() for lines, fill() for shapes
	context.stroke();
	// set font for temperature indicator
	context.font = '48px Myriad Pro';
	context.fillStyle = tempColor;
	context.textBaseLine = 'bottom';
	context.fillText(currTempStr, 110, 15*6);
	currPerc++;
	if (currPerc < currTemp) {
		requestAnimationFrame(function(){
			animate(currPerc/100);
		});
	}
}

function displayWeatherData() {
	$('#weather-icon').html('<img src="' + iconBaseURL + weatherIcon + '.png">');
	$('#weather-description').html('<h4>' + weatherDescription + '</h4>');
	$('#city-name').html('<h3>' + cityName + '</h3>');
	animate();
}

function setTempColor(currTemp) {
	var tempColor = '';
	if(currTemp < 32){
		tempColor = 'blue';
	} else if (currTemp >=32 && currTemp < 59) {
		tempColor = 'green';
	} else if (currTemp > 59 && currTemp < 75) {
		tempColor = '#FF9200';
	} else {
		tempColor = 'red';
	}
	return tempColor;
}

$(document).ready(function(){
	var canvas = $('#current-temp');
	// jQuery requires you specify an index for your canvas element
	context = canvas[0].getContext('2d');
	getWeatherReport(endPointOnLoad);

	$('#search-form').submit(function(){
		var searchStr = $('#search-box').val();
		var searchEndPoint = baseURL + encodeURI(searchStr) + options + apiKey;
		var canvas = $('#current-temp');
		context = canvas[0].getContext('2d');
		//context.clearRect(0,0, canvas.width, canvas.height);
		currPerc = 0;
		getWeatherReport(searchEndPoint);
		event.preventDefault();
	});
});