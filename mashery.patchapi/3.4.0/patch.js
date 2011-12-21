// *******************SET YOUR API KEY HERE*******************
// ***********************************************************

// Insert your Patch API Key here. ReadMe for more info.
var apikey ='your_api_key_here';

// Insert your Patch secret key here. ReadMe for more info.
var secret ='your_secret_key_here';

// ***********************************************************
// ***********************************************************

// Check if valid API Key
function check_keys()
{
	var city = 'fairfax';
	var state = 'virginia';
    AppMobi.device.getRemoteData(getURL('http://news-api.patch.com/v1.1/states/' + state + '/cities/'+ city),"GET","","displayFlashMessage","displayFlashMessage");
}

function displayFlashMessage(rawPayload)
{
	  var httpStatus = '200';
	  var matchString = new RegExp("code: ([0-9]{3})");
	  var matchArray = rawPayload.match(matchString);
	  
	  containsHTTP = rawPayload.substr(0,4)

	 if (containsHTTP == 'http'){
		AppMobi.notification.alert('Invalid City/State','Oops!','OK');
	}
	  
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
		$('#flash').addClass('red');
		$('#flash').html("<p class='center'><strong>Patch API Key Invalid</strong></p><p>Please see <a target='_blank' href='Readme.md'>ReadMe</a> file located in the Project directory for instructions.</p><p>(Hint: To locate your project directory, click on the <img class='middle' style='width:35px;margin-left:-5px;' src='images/project_icon.png'/> icon on the Emulator Toolbar above)</p>");
	  }
	  else { 
		$('#flash').addClass('green');
		$('#flash').html("<p class='center green'>Valid API Key Found</p>");	
	  }
}


function getURL(base_url)
{
	// Patch requires the API calls to include a Digital Signature.
	// The digital signature is an MD5 hash of apikey, your shared secret, and the timestamp.
	var timestamp = Math.round((new Date()).getTime()/1000).toString();
	var sig = $.md5(apikey + secret + timestamp);
	var url = base_url + '/stories?dev_key=' + apikey + '&sig=' + sig;

	return url;
}

function getStoriesByCity()
{
	var city = $('#city').val().replace(/\s/g,"%20");
	var state = $('#state').val();
    AppMobi.device.getRemoteData(getURL('http://news-api.patch.com/v1.1/states/' + state + '/cities/'+ city),"GET","","getStoriesCB","displayFlashMessage");
}

function getStoriesCB(rawPayload)
{
	var data = $.parseJSON(rawPayload);
	if (!data.total) {
		AppMobi.notification.alert('No Stories Found','Oops','OK');
		return false;
	}	
	var stories = data.stories;
	
	$("#stories-output").show();
	reset_screen();
	$("#stories-output .stories").html('<p class="center"><strong>Top Stories</strong></p>');

	$.each(stories, function(index, story) {
		$("#stories-output .stories").append('<hr/>');
		$("#stories-output .stories").append('<p><a href="' + story.story_url + '">' + story.title + '</a></p>');
	 });	
}

function getStoriesByGeo()
{
	
	var successFunction=function(p)
	{
		var lat=p.coords.latitude;
		var lng=p.coords.longitude;	
		AppMobi.device.getRemoteData(getURL('http://news-api.patch.com/v1.1/nearby/' + lat + ',' + lng),"GET","","getStoriesCB","displayFlashMessage");
	}
	
	var errorFunction=function( ){
		alert("Error getting location");
	}

	// Getting current GeoLocation using appMobi's built-in GeoLocation API. 
	// Then calling the success function if position is successfully retrieved
	AppMobi.geolocation.getCurrentPosition(successFunction,errorFunction);    
}


function reset_screen(){
	// alert('clearing');
	$("#stories-output .stories").html('');
}

function errorCB(data)
{
  console.log ("GRD error "+data);
}
