// *******************SET YOUR API KEY HERE*******************
// ***********************************************************

// Insert your Klout API Key here. ReadMe for more info.
var api_key ='your_api_key_here';

// ***********************************************************
// ***********************************************************

// Check if valid API Key
function check_keys(){			
	var url = 'http://api.klout.com/1/users/show.json?&key=' + api_key;
	AppMobi.device.getRemoteData(url,"GET","","displayFlashMessage","displayFlashMessage");
}

function displayFlashMessage (rawPayload) { 

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
	$('#flash').html("<p class='center'><strong>Klout API Key Not Found</strong></p><p>Please see <a target='_blank' href='Readme.md'>ReadMe</a> file located in the Project directory for instructions.</p><p>(Hint: To locate your project directory, click on the <img class='middle' style='width:35px;margin-left:-5px;' src='images/project_icon.png'/> icon on the Emulator Toolbar above</p>");
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

function kloutUser(){	
	var search = $('#search').val();
	var url = 'http://api.klout.com/1/users/show.json?&key=' + api_key + '&users=' + search;
	AppMobi.device.getRemoteData(url,"GET","","showUserCB","displayFlashMessage");		
}

function showUserCB(rawPayload)
{
	var data = $.parseJSON(rawPayload);
	reset_screen();
	if (!data.users) {
		alert('No Klout profile could be located for that search query.');
		return false;
	}	
	var users = data.users;
	$("#klout-output").show();
	$("#klout-output .users").html('<p class="center"><strong>Klout Profiles</strong></p>');

	$.each(users, function(index, user) {
		
		$("#klout-output .users").append('<hr/>');
		$("#klout-output .users").append('<p>Twitter Name: @' + user.twitter_screen_name + '<br />Klout Score: ' + user.score.kscore + '<br />Class: ' + user.score.kclass + '<br />Delta (1 day / 5 day): '+user.score.delta_1day+' / '+user.score.delta_5day+'</p>');	
	 });
}

function reset_screen(){
	$(".output-inner").hide();
}

function errorCB(data)
{
  console.log ("GRD error "+data);
}
