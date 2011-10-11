// *******************SET YOUR API KEY HERE*******************
// ***********************************************************

// Insert your Qwerly API Key here. ReadMe for more info.
var api_key ='your_api_key_here';

// ***********************************************************
// ***********************************************************

// Check if valid API Key
function check_keys()
{
        AppMobi.device.getRemoteData('http://api.qwerly.com/v1/twitter/t?&api_key='+ api_key,"GET","","displayFlashMessage","displayFlashMessage");
}

function displayFlashMessage (rawPayload)
{	  
	  var httpStatus = '200';
	  var matchString = new RegExp("code: ([0-9]{3})");
	  var matchArray = rawPayload.match(matchString);
	  if (matchArray) {
		httpStatus = matchArray[1];
	  }

	  $('#flash').show();
	
	  if(httpStatus == '404') { 
		AppMobi.notification.alert('Profile Not Found','Oops','OK');
		reset_screen();
	  } 
	  else if(httpStatus == '403') { 
		AppMobi.notification.alert('Please check the Readme.md file for instructions','Invalid API Key','OK');
		$('#flash').addClass('red');
		$('#flash').html("<p class='center'><strong>Qwerly API Key Invalid</strong></p><p>Please see <a target='_blank' href='Readme.md'>ReadMe</a> file located in the Project directory for instructions.</p><p>(Hint: To locate your project directory, click on the <img class='middle' style='width:35px;margin-left:-5px;' src='images/project_icon.png'/> icon on the Emulator Toolbar above)</p>");
	  }
	  else if(httpStatus == '400') { 
		AppMobi.notification.alert('Bad request. Please check your input parameter.','Bad Request','OK');
		reset_screen(); 
	  }

	  else if(httpStatus == '202') { 
		AppMobi.notification.alert('Profile Not Found','Invalid ID','OK');	 
		reset_screen(); 
		}
	  else { 
		$('#flash').addClass('green');
		$('#flash').html("<p class='center green'>Valid API Key Found</p>");
	  }
}

function searchTwitter()
{	
		var search = $('#search').val();
		var url = 'http://api.qwerly.com/v1/twitter/'+search+'?&api_key=' + api_key;
        AppMobi.device.getRemoteData(url,"GET","","searchTwitterCB","displayFlashMessage");
}

function searchTwitterCB(rawPayload)
{
	var data = $.parseJSON(rawPayload);
	reset_screen();
	
	var profile = data.profile;
	var services = data.profile.services;

	$("#twitter-output").show();
	$("#twitter-output span.username").html(profile.twitter_username);
	$("#twitter-output span.website").html(profile.website);
	
	$.each(services, function(index, service) {
		$("#twitter-output .services").append('<hr/>');
		$("#twitter-output .services").append('<p>Type: <span class="service-type">'+ service.type + '</span></p>');
		$("#twitter-output .services").append('<p>URL: <span class="service-url url">'+ service.url + '</span></p>');
		$("#twitter-output .services").append('<p>Username: <span class="service-username">'+ service.username + '</span></p>');		
	 });
}

function searchFacebook()
{	
		var search = $('#search').val();
		var url = 'http://api.qwerly.com/v1/facebook/username/'+search+'?&api_key='+api_key;
        AppMobi.device.getRemoteData(url,"GET","","searchFacebookCB","displayFlashMessage");
}

function searchFacebookCB(rawPayload)
{
	var data = $.parseJSON(rawPayload);
	reset_screen();
	
	var profile = data.profile;
	var services = data.profile.services;
			
	$("#facebook-output").show();
	$("#facebook-output span.facebook_id").html(profile.facebook_id);
	$("#facebook-output span.username").html(profile.facebook_username);
	
	$.each(services, function(index, service) {
		$("#facebook-output .services").append('<hr/>');
		$("#facebook-output .services").append('<p>Type: <span class="service-type">'+ service.type + '</span></p>');
		$("#facebook-output .services").append('<p>URL: <span class="service-url url">'+ service.url + '</span></p>');
		$("#facebook-output .services").append('<p>Username: <span class="service-username">'+ service.username + '</span></p>');		
	 });	
}

function searchEmail()
{	
	var search = $('#search').val();
	var url = 'http://api.qwerly.com/v1/email/'+search+'?&api_key=' + api_key;
    AppMobi.device.getRemoteData(url,"GET","","searchEmailCB","displayFlashMessage");
}

function searchEmailCB(rawPayload)
{
	var data = $.parseJSON(rawPayload);
	reset_screen();
	
	var profile = data.profile;
	var services = data.profile.services;
	
	if (data.profile) {
		alert('Not Found');
	}

	$("#email-output").show();
	$("#email-output span.name").html(profile.name);
	$("#email-output span.location").html(profile.location);
	$("#email-output span.website").html(profile.website);

	$.each(services, function(index, service) {
		$("#email-output .services").append('<hr/>');
		$("#email-output .services").append('<p>Type: <span class="service-type">'+ service.type + '</span></p>');
		$("#email-output .services").append('<p>URL: <span class="service-url url">'+ service.url + '</span></p>');
		$("#email-output .services").append('<p>Username: <span class="service-username">'+ service.username + '</span></p>');		
	 });
}

function reset_screen()
{
	$(".output-inner").hide();
	$("span").html('');
	$(".services").html('');
}
