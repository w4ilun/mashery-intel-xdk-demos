// *******************SET YOUR API KEY HERE*******************
// ***********************************************************

// Insert your WeatherBug REST XML API Key here. ReadMe for more info.
// Do not plug in your WeatherBug GEO Basic API Key. It must be the
// REST XML API Key (which also works for JSON requests)
// var api_key ='your_api_key_here';
var api_key ='your_api_key_here';

// ***********************************************************
// ***********************************************************

var map=""; //google maps object

function setdefaultFlash(){
	$('#flash').show();
	$('#flash').addClass('red');
	$('#flash').removeClass('green');
	$('#flash').html("<p class='center'><strong>WeatherBug API Key Not Found</strong></p><p>Please see <a target='_blank' href='Readme.md'>ReadMe</a> file located in the Project directory for instructions.</p><p>(Hint: To locate your project directory, click on the <img class='middle' style='width:35px;margin-left:-5px;' src='images/project_icon.png'/> icon on the Emulator Toolbar above</p>");
	
}
// Check if valid API Key
function check_keys(){			
		var url = 'http://i.wxbug.net/REST/Direct/GetForecastHourly.ashx?zip=21044&ht=t&api_key=' + api_key + '&f=displayMessage';
		$.ajax({
		    url: url,
		    dataType: "jsonp",
			success: displayMessage
		  });
		
}

function displayErrorMessage(data) { 
	$('#flash').addClass('red');
	$('#flash').removeClass('green');
	$('#flash').html("<p class='center'><strong>WeatherBug API Key Not Found</strong></p><p>Please see <a target='_blank' href='Readme.md'>ReadMe</a> file located in the Project directory for instructions.</p><p>(Hint: To locate your project directory, click on the <img class='middle' style='width:35px;margin-left:-5px;' src='images/project_icon.png'/> icon on the Emulator Toolbar above</p>");
}

function displayMessage(data) { 
		
		if (data.forecastHourlyList[0].dateTime){
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

function getData() {

	var successFunction=function(p)
	{
		
		var lat=p.coords.latitude;
		var lng=p.coords.longitude;
				
		findWeatherGeo(lat,lng,"findWeatherGeoCB");
		
		var myLatlng = new google.maps.LatLng(lat, lng);
		var myOptions = {
		  zoom: 8,
		  center: myLatlng,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	}
	var errorFunction=function( ){
		alert("Error getting location");
	}

	// Getting current GeoLocation using appMobi's built-in GeoLocation API. 
	// Then calling the success function if position is successfully retrieved
	AppMobi.geolocation.getCurrentPosition(successFunction,errorFunction); 
}

// Using WeatherBug's API to get forecast based on the current latitude/longitude positions
function findWeatherGeo(latitude, longitude, callbackFunction)
{
	check_keys();
	
	AppMobi.device.getRemoteData('http://i.wxbug.net/REST/Direct/GetForecast.ashx?la='+ latitude + '&lo='+ longitude + '&nf=7&ht=t&ht=i&l=en&c=US&api_key='+ api_key,"GET","",callbackFunction,"errorCB");	
}

// Using WeatherBug's API to get forecast based on the zip code entered in the zip_code input box.
function findWeatherZip(zip, callbackFunction)
{
	check_keys();
	
	var zip = document.getElementById("zip_code").value;
	var callbackFunction = 'findWeatherZipCB'	
	AppMobi.device.getRemoteData('http://i.wxbug.net/REST/Direct/GetForecast.ashx?zip='+ zip +'&api_key='+ api_key + '&nf=7&ht=t&ht=cp',"GET","",callbackFunction,"errorCB");
}

// Callback function for the function findWeatherGeo()
function findWeatherGeoCB(data)
{
	try {
	
	data=JSON.parse(data);

	var content=aUX.web.template("geo_list_tpl",{forecastList:data.forecastList}); 
	AMUi.updateContentDiv("divGeo",content);		
		
	AMUi.hideMask();
	
	} catch(e){ alert("error in findWeatherGeoCB: " + e.message); AMUi.hideMask(); }
}

// Callback function for the function findWeatherZip()
function findWeatherZipCB(data)
{
	try {
	
	data=JSON.parse(data);

	var content=aUX.web.template("zip_list_tpl",{forecastList:data.forecastList}); 
	AMUi.updateContentDiv("divZip",content);	
	
	document.getElementById("output").innerHTML = content;
		
	AMUi.hideMask();
	
	} catch(e){ reset_screen(); AppMobi.notification.alert('Invalid Zip','Weather Not Found','OK'); AMUi.hideMask(); }
}

function reset_screen(){
	$("#output").html('');
}


function errorCB(data)
{
  console.log ("GRD error "+data);
}
