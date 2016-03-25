$(document).ready(function(){
	var apiKey = '&APPID=2664a8f717e9cd0c3d61f2a4990d5df5';
	// var baseURL = 'http://api.openweathermap.org/data/2.5/forecast/city?id=524901'; 
	var baseURL = 'http://api.openweathermap.org/data/2.5/weather?q=Atlanta';
	var options = '&units=Imperial';
	var endPoint = baseURL + options + apiKey;
	var iconBaseURL = 'http://openweathermap.org/img/w/';

	// console.log(endPoint);

	$.getJSON(endPoint, function(weatherData) {
		// console.log(weatherData);
		var currTemp = weatherData.main.temp;
		var weatherIcon = weatherData.weather[0].icon;
		var weatherDescription = weatherData.weather[0].main;
		$('#weather-icon').html('<img src="' + iconBaseURL + weatherIcon + '.png">');
		$('#weather-description').html('<h5>' + weatherDescription + '</h5>');

		var canvas = $('#current-temp');
		// jQuery requires you specify an index for your canvas element
		var context = canvas[0].getContext('2d');
		
		// set up an animate function
		// update the appropriate variables
		var currPerc = 0;

		if(currTemp < 32){
			var tempColor = 'blue';
		} else if (currTemp >=32 && currTemp < 59) {
			var tempColor = 'green';
		} else if (currTemp > 59 && currTemp < 75) {
			var tempColor = '#FF9200';
		} else {
			var tempColor = 'red';
		}

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

});