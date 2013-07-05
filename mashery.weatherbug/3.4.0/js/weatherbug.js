// *******************SET YOUR API KEY HERE*******************
// ***********************************************************

// Insert your WeatherBug REST XML API Key here. ReadMe for more info.
// Do not plug in your WeatherBug GEO Basic API Key. It must be the
// REST XML API Key (which also works for JSON requests)
//var api_key ='your_api_key_here';
var api_key = 'jhmy9cqeamummcysjvv2mcpr';

// ***********************************************************
// ***********************************************************

function launch() {
    setdefaultFlash();
    check_keys();
    setTimeout(
	function() {
	    getGeoData();
	    setTimeout(
		function() {
		    findWeatherZip();
		}, 600);
	}, 
	600);
}

function setdefaultFlash(){
    console.log('setdefaultflash');
    $('#flash').show();
    $('#flash').addClass('red');
    $('#flash').removeClass('green');
    $('#flash').html("<p class='center'><strong>WeatherBug API Key Not Found</strong></p><p>Please see <a target='_blank' href='Readme.md'>ReadMe</a> file located in the Project directory for instructions.</p><p>(Hint: To locate your project directory, click on the <img class='middle' style='width:35px;margin-left:-5px;' src='images/project_icon.png'/> icon on the Emulator Toolbar above</p>");
}

function weatherBug(extras, successCB) {
    var url = 'http://i.wxbug.net/REST/Direct/GetForecast.ashx';
    url += '?api_key=' + api_key;
    url += '&nf=7&ht=t&ht=i&l=en&c=US';
    url += '&' + extras;
    
    $.ajax({
	url: url,
	dataType: 'jsonp',
	jsonp: 'f',
	success: successCB,
	error: errorCB
    });

}

// Check if valid API Key
function check_keys(){   
    weatherBug('zip=03079', displayMessage);
}

function displayMessage(data) { 
    if (data.forecastList[0].dateTime){
	$('#flash').addClass('green');
	$('#flash').html("<p class='center green'>Valid API Key Found</p>");
	return false;
    }
    else{
	AppMobi.notification.alert('Please check the Readme.md file for instructions','Invalid API Key','OK');
	$('#flash').addClass('red');
	$('#flash').html("<p class='center'><strong>WeatherBug API Key Not Found</strong></p><p>Please see <a target='_blank' href='Readme.md'>ReadMe</a> file located in the Project directory for instructions.</p><p>(Hint: To locate your project directory, click on the <img class='middle' style='width:35px;margin-left:-5px;' src='images/project_icon.png'/> icon on the Emulator Toolbar above</p>");
    }
}

function getGeoData() {

    var successFunction=function(p) {
	var lat=p.coords.latitude;
	var lng=p.coords.longitude;
    
	findWeatherGeo(lat,lng);
    }

    var errorFunction=function( ){
	alert("Error getting location");
    }

    // Getting current GeoLocation using appMobi's built-in GeoLocation API. 
    // Then calling the success function if position is successfully retrieved
    AppMobi.geolocation.getCurrentPosition(successFunction,errorFunction); 
}

// Using WeatherBug's API to get forecast based on the current latitude/longitude positions
function findWeatherGeo(latitude, longitude)
{
    weatherBug('la='+ latitude + '&lo=' + longitude, updateWeatherGeo);
}

// Using WeatherBug's API to get forecast based on the zip code entered in the zip_code input box.
function findWeatherZip()
{
    var zip = $('#zipcode').val();
    console.log('zip code: ' + zip);
    weatherBug('zip=' + zip, updateWeatherZip);
}

// Update the weather based on geo request
function updateWeatherGeo(data)
{
    try {
	var template = $('#tpl').html();
	var html = Mustache.to_html(template, {forecastList:data.forecastList}); 
	$('#divGeo').html(html);
    } catch(e){
	alert("error in findWeatherGeoCB: " + e.message); 
    }
}

// Update the weather based on zipcode request
function updateWeatherZip(data)
{
    try {
	var template = $('#tpl').html();
	var html = Mustache.to_html(template, {forecastList:data.forecastList}); 
	$('#divZip').html(html);
    } catch(e){ 
	AppMobi.notification.alert('Invalid Zip','Weather Not Found','OK');
    }
}

function errorCB(data)
{
    console.log ("GRD error "+JSON.stringify(data));
}
