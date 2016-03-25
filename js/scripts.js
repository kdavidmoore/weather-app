var apiKey = '&APPID=2664a8f717e9cd0c3d61f2a4990d5df5'; 
var baseURL = 'http://api.openweathermap.org/data/2.5/weather?q=';
var options = '&units=Imperial';
var endPoint = baseURL + 'Atlanta' + options + apiKey;
var iconBaseURL = 'http://openweathermap.org/img/w/';

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
	$.getJSON(endPoint, function(weatherData) {
		var currTemp = weatherData.main.temp;
		var weatherIcon = weatherData.weather[0].icon;
		var weatherDescription = weatherData.weather[0].main;
		var cityName = weatherData.name;
		$('#weather-icon').html('<img src="' + iconBaseURL + weatherIcon + '.png">');
		$('#weather-description').html('<h5>' + weatherDescription + '</h5>');
		$('#city-name').html('<h3>' + cityName + '</h3>');

		var canvas = $('#current-temp');
		// jQuery requires you specify an index for your canvas element
		var context = canvas[0].getContext('2d');
		
		var currPerc = 0;
		var tempColor = setTempColor(currTemp);
		// set up an animate function
		// update the appropriate variables
		function animate(current) {
			// set up circle and styling
			// set up color based on temperature (blue = cold; red = hot)
			context.fillStyle = '#ccc';
			context.beginPath();
			context.arc(155,75,65,0,2*Math.PI);
			// close path because we want two separate drawings
			context.closePath();
			context.fill();

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
			var roundedTemp = Math.round(currTemp);
			var currTempStr = roundedTemp + '°F';
			context.fillText(currTempStr, 110, 15*6);
			currPerc++;
			if (currPerc < currTemp) {
				requestAnimationFrame(function(){
					animate(currPerc/100);
				});
			}
		}
	animate();
	});

	$('#search-form').submit(function(){
		// handling spaces?
		var searchStr = $('#search-box').val();
		console.log(searchStr);

		var searchEndPoint = baseURL + encodeURI(searchStr) + options + apiKey;
		
		$.getJSON(searchEndPoint, function(weatherData) {
			console.log(weatherData);
			var currTemp = weatherData.main.temp;
			var weatherIcon = weatherData.weather[0].icon;
			var weatherDescription = weatherData.weather[0].main;
			var cityName = weatherData.name;
			$('#weather-icon').html('<img src="' + iconBaseURL + weatherIcon + '.png">');
			$('#weather-description').html('<h5>' + weatherDescription + '</h5>');
			$('#city-name').html('<h3>' + cityName + '</h3>');

			var canvas = $('#current-temp');
			// jQuery requires you specify an index for your canvas element
			var context = canvas[0].getContext('2d');
			
			var currPerc = 0;
			var tempColor = setTempColor(currTemp);
			// set up an animate function
			// update the appropriate variables
			function animate(current) {
				// set up circle and styling
				// set up color based on temperature (blue = cold; red = hot)
				context.fillStyle = '#ccc';
				context.beginPath();
				context.arc(155,75,65,0,2*Math.PI);
				// close path because we want two separate drawings
				context.closePath();
				context.fill();

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
				var roundedTemp = Math.round(currTemp);
				var currTempStr = roundedTemp + '°F';
				context.fillText(currTempStr, 110, 15*6);
				currPerc++;
				if (currPerc < currTemp) {
					requestAnimationFrame(function(){
						animate(currPerc/100);
					});
				}
			}
			animate();
		});
	event.preventDefault();
	});
});