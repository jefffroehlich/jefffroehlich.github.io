var station = '9410230';
var stations = {

	"option1": {
		id:	"9410230",
		name: "San Diego",
		lat: "32.7157",
		lon: "-117.1611",
		tzAdj: 7
		},
	"option2": {
		id: "8665530",
		name: "Beaufort",
		lat: "32.4316",
		lon: "-80.6698",
		tzAdj: 4
		},
	"option3": {
		id: "8725110",
		name: "Bonita Springs",
		lat: "26.3398",
		lon: "-81.7787",
		tzAdj: 4
		},
	"option4": {
		id: "8665530",
		name: "Charleston",
		lat: "32.7765",
		lon: "-79.9311",
		tzAdj: 4
		}
};

station = stations.option1.id;
stationName = stations.option1.name;
var lat = stations.option1.lat;
var lon = stations.option1.lon;
var startTemp = stations.option1.tzAdj;

pageLoad();
getTemp(station);
getSunset(lat, lon, "option1");
parseTides(0,station);
var todayUrl = tidePredictions(0,station);
var tomorrowUrl = tidePredictions(1,station);
getAPI(todayUrl,tomorrowUrl,false);

function pageLoad() {

		$(document).ready(function() {
	});
		var stationName = stations.option1.name;
		document.getElementById("stationName").innerHTML = stationName;

}


function getTemp(station) {

	$(document).ready(function() {
	});

	let url = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station='+station+'&product=water_temperature&datum=STND&time_zone=lst&units=english&format=json';
	console.log(url);
	$.getJSON(url, function(data) {
		var parseTemp = data.data[0].v;
		document.getElementById("temp").innerHTML = parseTemp;
		
	});
};

function getSunset(lat, lon, dropSelection) {

	$(document).ready(function() {
	});

	var curDate = new Date();
  	var utcOffset = curDate.getTimezoneOffset();
  	utcOffset /= 60;
  	console.log(dropSelection);
  	var tzOffset = stations[dropSelection].tzAdj;
  	console.log(tzOffset);

	let url = 'https://api.sunrise-sunset.org/json?lat='+lat+'&lng='+lon+'&date=2020-09-18';

	$.getJSON(url, function(data) {
		var parseSunset = data.results.sunset;
		console.log(parseSunset);
		console.log(utcOffset);
		var split = parseSunset.split(":");
		var hour = split[0];
		hour = hour - utcOffset + utcOffset - tzOffset + 12;
		if (hour > 12) {

			hour -= 12;
		}
		parseSunset = hour + ":" + split[1] + " PM";
		console.log(parseSunset);

		document.getElementById("sunset").innerHTML = parseSunset;
	});
};

var bigArray;

function parseTides(tomorrow,station) {
	$(document).ready(function() {
	});
	let curDate = new Date();
	let yearString = curDate.getFullYear().toString();
	let monthString = curDate.getMonth() + 1;
	monthString = monthString.toString();
	if (monthString.length === 1) {
		monthString = '0' + monthString;
	}
	let dayString = curDate.getDate() + tomorrow;
		dayString = dayString.toString();
	if (dayString.length === 1) {
		dayString = '0' + dayString;
	}
	let dateString = yearString+monthString+dayString;
	let url = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&begin_date='+dateString+'&end_date='+dateString+'&datum=MLLW&station='+station+'+&time_zone=lst_ldt&units=english&interval=hilo&format=json'
	$.getJSON(url, function(data) {
	
		bigArray = data.predictions;
	
		let hArray = [];
		let lArray = [];

		for (let i = 0; i < bigArray.length; i++) {

			if (bigArray[i].type === 'H') {
				let x = bigArray[i].t;
				hArray.push(x);
			};
		};
		for (let i = 0; i < bigArray.length; i++) {

			if (bigArray[i].type === 'L') {
				let x = bigArray[i].t;
				lArray.push(x);
			};
		};	

		for (let i = 0;i < hArray.length; i++) {

			hArray[i] = hArray[i].substr(hArray[i].length - 5);
			let h = hArray[i].substring(0,2);
			let ampm = ' PM';
			if (h < 12) {
				ampm = ' AM';
			}
			h = h % 12;
	  		h = h ? h : 12;
	  		hArray[i] = h + hArray[i].substring(2) + ampm;
		};
		for (let i = 0;i < lArray.length; i++) {

			lArray[i] = lArray[i].substr(lArray[i].length - 5);
			let h = lArray[i].substring(0,2);
			let ampm = ' PM';
			if (h < 12) {
				ampm = ' AM';
			}
			h = h % 12;
	  		h = h ? h : 12;
	  		lArray[i] = h + lArray[i].substring(2) + ampm;
		};
		
		lArray = lArray.join();
		hArray = hArray.join();
		lArray = lArray.replace(/,/g," ");
		hArray = hArray.replace(/,/g," ");		
		document.getElementById("lowTide").innerHTML = lArray;
		document.getElementById("highTide").innerHTML = hArray;
});
};

function tidePredictions(x,station) {

	let curDate = new Date();

	if (x===1) {
    curDate.setDate(curDate.getDate() + 1);
	}
	let yearString = curDate.getFullYear().toString();
	let monthString = curDate.getMonth() + 1;
	monthString = monthString.toString();
	if (monthString.length === 1) {
		monthString = '0' + monthString;
	}
	let dayString = curDate.getDate();
		dayString = dayString.toString();
	if (dayString.length === 1) {
		dayString = '0' + dayString;
	}
	let todayDateString = yearString+monthString+dayString;
	
	url = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&begin_date='+todayDateString+'&end_date='+todayDateString+'&datum=MLLW&station='+station+'&time_zone=lst_ldt&units=english&interval=hilo&format=json';

	return url;
}

function getAPI(todayUrl,tomorrowUrl,button) {
   
	$.getJSON(todayUrl, function (data) {
	    
	    var todayArray = data.predictions;
	    
    		$.getJSON(tomorrowUrl, function (data) {
    
    			var tomorrowArray = data.predictions;
				drawClock(todayArray,tomorrowArray,button);

    		});
	});
}

function colorChangeToday() {
    
	document.getElementById('todayBtn').style.backgroundColor = 'lightSlateGray';       
    document.getElementById('tomorrowBtn').style.backgroundColor = 'white';
}

function colorChangeTomorrow() {
    
	document.getElementById('todayBtn').style.backgroundColor = 'white';       
    document.getElementById('tomorrowBtn').style.backgroundColor = 'lightSlateGray';
}

function drawClock(todayArray,tomorrowArray,button) {
  $(document).ready(function() {
	});

 	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var radius = canvas.height / 2;
	if (button === false) {
		ctx.translate(radius, radius);
	}
 	ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
 	drawTime(ctx, radius, clockPos(todayArray,tomorrowArray),button);
}

function clockPos(todayArray,tomorrowArray) {

let nextTideTime;
let nextTideType;
let finalTide;
let clockPos;
let curTime = new Date();
curTime = Date.parse(curTime);

	for (let i = 0; i < todayArray.length; i++) {

		nextTideTime = todayArray[i].t;
		nextTideTime = Date.parse(nextTideTime);
		finalTide = todayArray[todayArray.length-1].t;
		finalTide = Date.parse(finalTide);

		if (finalTide - curTime >= 0) {
			if (nextTideTime - curTime > 0){

				nextTideType = todayArray[i].type;
				i = todayArray.length;
			};
		}
		else {
				for (let i = 0; i < tomorrowArray.length; i++) {

				nextTideTime = tomorrowArray[i].t;
				nextTideTime = Date.parse(nextTideTime);

					if (nextTideTime - curTime > 0){

					nextTideType = tomorrowArray[i].type;
					i = tomorrowArray.length;
				}
			};

		}
	};

	var diff = nextTideTime - curTime;

	diff = Math.min(diff/60/60/1000,6);

	if (nextTideType === 'H') {
		clockPos = 12 - diff;
	}
	else {
		clockPos = 6 - diff;
	}
	return clockPos;
}

var prevRadians;
function drawTime(ctx, radius, clockPos, button) {


    var radians = (clockPos/12*2*Math.PI);
	var img = new Image();

	img.addEventListener("load", function() {

	    	if (button === false) {
	    	ctx.rotate(radians);
			ctx.rotate(-2*Math.PI/4); //account for hand img being at 3:00
			ctx.drawImage(img,-radius,-radius);
			prevRadians = radians;
			}
			else {
			var newRadians = -prevRadians + radians;
			
//Interval and increment radians...
			ctx.rotate(newRadians);
			ctx.drawImage(img,-radius,-radius);
			prevRadians = radians;
			}

	}, false);

	img.src = 'clockhand.png';
	
	
	
}

function toggleClass(elem,className){
	if (elem.className.indexOf(className) !== -1){
		elem.className = elem.className.replace(className,'');
	}
	else{
		elem.className = elem.className.replace(/\s+/g,' ') + 	' ' + className;
	}
	
	return elem;
}

function toggleDisplay(elem){
	const curDisplayStyle = elem.style.display;			
				
	if (curDisplayStyle === 'none' || curDisplayStyle === ''){
		elem.style.display = 'block';
	}
	else{
		elem.style.display = 'none';
	}
}


function toggleMenuDisplay(e){
	const dropdown = e.currentTarget.parentNode;
	const menu = dropdown.querySelector('.menu');
	const icon = dropdown.querySelector('.fa-angle-right');

	toggleClass(menu,'hide');
	toggleClass(icon,'rotate-90');
}

function handleOptionSelected(e){
	toggleClass(e.target.parentNode, 'hide');			

	const id = e.target.id;
	const newValue = e.target.textContent + ' ';
	const titleElem = document.querySelector('.dropdown .title');
	const icon = document.querySelector('.dropdown .title .fa');

	titleElem.textContent = newValue;
	titleElem.appendChild(icon);
	
	//trigger custom event
	document.querySelector('.dropdown .title').dispatchEvent(new Event('change'));
	//setTimeout is used so transition is properly shown
	setTimeout(() => toggleClass(icon,'rotate-90',0));
	newStation(id);
}

function handleTitleChange(e){

}

const dropdownTitle = document.querySelector('.dropdown .title');
const dropdownOptions = document.querySelectorAll('.dropdown .option');

//bind listeners to these elements
dropdownTitle.addEventListener('click', toggleMenuDisplay);
dropdownOptions.forEach(option => option.addEventListener('click',handleOptionSelected));
document.querySelector('.dropdown .title').addEventListener('change',handleTitleChange);

function newStation(dropSelection) {

	station = stations[dropSelection].id;
	stationName = stations[dropSelection].name;
	lat = stations[dropSelection].lat;
	lon = stations[dropSelection].lon;
	console.log(lat);
	console.log(lon);
	getTemp(station);
	getSunset(lat, lon, dropSelection);
	parseTides(0,station);
	todayUrl = tidePredictions(0,station);
	tomorrowUrl = tidePredictions(1,station);
	getAPI(todayUrl,tomorrowUrl,true);
	document.getElementById("stationName").innerHTML = stationName;
}