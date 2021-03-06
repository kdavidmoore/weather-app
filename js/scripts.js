const apiKey = '&APPID=2664a8f717e9cd0c3d61f2a4990d5df5'; 
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?q=';
const forecaseBaseURL = 'http://api.openweathermap.org/data/2.5/forecast?q=';
const options = '&units=Imperial';
const endPointOnLoad = baseURL + 'Atlanta' + options + apiKey;
const iconBaseURL = 'http://openweathermap.org/img/w/';
const forecastEndPoint = forecaseBaseURL + 'Atlanta,us' + options + apiKey;

var currTemp = 0;
var currPerc = 0;
var weatherIcon = 0;
var weatherDescription = '';
var cityName = '';
var context;

function getWeatherReport(endPoint) {
	$.getJSON(endPoint, function(weatherData) {
		//console.log(weatherData);
		currTemp = weatherData.main.temp;
		weatherIcon = weatherData.weather[0].icon;
		weatherDescription = weatherData.weather[0].main;
		cityName = weatherData.name;
		displayWeatherData();
	});
}

function getForecast(endPoint) {
	var thisDayHi, thisDayLo, tomorrow_high, tomorrow_low, maxTemp, minTemp;
	$.getJSON(endPoint, function(forecast) {
		console.log(forecast);
		for (var i=1; i<5; i++){
			thisDayDesc = '#day-' + i + '-desc';
			thisDayHi = '#day-' + i + '-hi';
			thisDayLo = '#day-' + i + '-lo';
			description = forecast.list[i].weather[0].description;
			maxTemp = forecast.list[i].main.temp_max + '°F';
			minTemp = forecast.list[i].main.temp_min + '°F';

			tomorrow_desc = $(thisDayDesc);
			tomorrow_desc.html(description);
			tomorrow_high = $(thisDayHi);
			tomorrow_high.html(maxTemp);
			tomorrow_low = $(thisDayLo);
			tomorrow_low.html(minTemp);
		}
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
	context.font = '42px Helvetica';
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
	$('#weather-description').html('<h5>' + weatherDescription + '</h5>');
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
	getForecast(forecastEndPoint);

	$('#search-form').submit(function(){
		event.preventDefault();
		var searchStr = $('#search-box').val();
		var searchEndPoint = baseURL + encodeURI(searchStr) + options + apiKey;
		var searchForecastEndPoint = forecaseBaseURL + encodeURI(searchStr) + ',us' + options + apiKey;

		var canvas = $('#current-temp');
		context = canvas[0].getContext('2d');
		currPerc = 0;
		getWeatherReport(searchEndPoint);
		getForecast(searchForecastEndPoint);
	});
});