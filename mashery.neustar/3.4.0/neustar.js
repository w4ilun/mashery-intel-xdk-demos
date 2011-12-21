// *******************SET YOUR API KEY HERE*******************
// ***********************************************************

// Insert your Neustar API Key here. ReadMe for more info.
var apikey ='your_api_key_here';

// Insert your Neustar secret key here. ReadMe for more info.
var secret ='your_api_secret_here';

// ***********************************************************
// ***********************************************************

// Check if valid API Key
function check_keys()
{
        AppMobi.device.getRemoteData(getURL(),"GET","","displayFlashMessage","displayFlashMessage");
}

function displayFlashMessage(rawPayload)
{
	  var httpStatus = '200';
	  var matchString = new RegExp("code: ([0-9]{3})");
	  var matchArray = rawPayload.match(matchString);
	  if (matchArray) {
		httpStatus = matchArray[1];
	  }
	  $('#flash').show();
	
	  if(httpStatus == '400') { 
		AppMobi.notification.alert('Invalid IP Address','Oops!','OK');
		reset_screen();
	  }
	  else if(httpStatus == '403') { 
		AppMobi.notification.alert('Please check the Readme.md file for instructions','Invalid API Key','OK');
		$('#map_canvas').hide();
		$('#flash').addClass('red');
		$('#flash').html("<p class='center'><strong>Neustar IP Intelligence API Key Invalid</strong></p><p>Please see <a target='_blank' href='Readme.md'>ReadMe</a> file located in the Project directory for instructions.</p><p>(Hint: To locate your project directory, click on the <img class='middle' style='width:35px;margin-left:-5px;' src='images/project_icon.png'/> icon on the Emulator Toolbar above)</p>");
	  }
	  else { 
		$('#flash').addClass('green');
		$('#flash').html("<p class='center green'>Valid API Key Found</p>");
	  }
}

function getURL()
{
	var search = $('#search').val();
	
	// Quora requires the API calls to include a Digital Signature.
	// The digital signature is an MD5 hash of apikey, your shared secret, and the timestamp.
	var timestamp = Math.round((new Date()).getTime()/1000).toString();
	var sig = $.md5(apikey + secret + timestamp);
	var url = 'http://api.quova.com/v1/ipinfo/' + search + '?format=json&apikey=' + apikey + '&sig=' + sig;
	return url;
}

function getNeustar()
{
    AppMobi.device.getRemoteData(getURL(),"GET","","getNeustarCB","displayFlashMessage");
}

function getNeustarCB(rawPayload)
{
	var data = $.parseJSON(rawPayload);
	var country = data.ipinfo.Location.CountryData.country;
	var state = data.ipinfo.Location.StateData.state;
	var city = data.ipinfo.Location.CityData.city;
	$("#output").show();
	$("#country").html(country);
	$("#state").html(state);
	$("#city").html(city);
	
	var lat=data.ipinfo.Location.latitude;
	var lng=data.ipinfo.Location.longitude;
	
	var latlng = new google.maps.LatLng(lat, lng);
	    var myOptions = {
	      zoom: 8,
	      center: latlng,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    var map = new google.maps.Map(document.getElementById("map_canvas"),
	        myOptions);	
}

function errorCB(data)
{
  console.log ("GRD error "+data);
}
