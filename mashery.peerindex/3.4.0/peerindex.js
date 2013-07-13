// *******************SET YOUR API KEY HERE*******************
// ***********************************************************

// Insert your PeerIndex API Key here. ReadMe for more info.
var api_key ='your_api_key_here';

// ***********************************************************
// ***********************************************************

// Check if valid API Key
function check_keys(){
	var url = 'https://api.peerindex.com/1/actor/basic?twitter_screen_name=barackobama&api_key=' + api_key;
	AppMobi.device.getRemoteData(url,"GET","","displayFlashMessage","displayFlashMessage");
}

function displayFlashMessage (rawPayload) {
  var httpStatus = '200';
  var matchString = new RegExp("code: ([0-9]{3})");
  var matchArray = rawPayload.match(matchString);
  var missingIDError = rawPayload.search("api.peerindex");

  if (matchArray) {
	httpStatus = matchArray[1];
  }
  else if (missingIDError > 0) {
  	httpStatus = '404';
  }

  $('#flash').show();

  if(httpStatus == '400') {
  	AppMobi.notification.alert('Query parameter must include a Twitter Screen Name','No Supplied Parameter','OK');
  	reset_screen();
  }
  else if(httpStatus == '403') { 
	AppMobi.notification.alert('Please check the Readme.md file for instructions','Invalid API Key or Over Rate Limit','OK');
	$('#flash').addClass('red');
	$('#flash').html("<p class='center'><strong>PeerIndex API Key Not Found</strong></p><p>Please see <a target='_blank' href='Readme.md'>ReadMe</a> file located in the Project directory for instructions.</p><p>(Hint: To locate your project directory, click on the <img class='middle' style='width:35px;margin-left:-5px;' src='images/project_icon.png'/> icon on the Emulator Toolbar above</p>");
  }
  else if(httpStatus == '404') { 
	AppMobi.notification.alert('No PeerIndex Data Found for Actor','Oops','OK');
	reset_screen();
  } 
  else if(httpStatus == '503' || httpStatus == '504') { 
	AppMobi.notification.alert('Unable to reach the PeerIndex API','Timeout/Service Unavailable','OK');	 
	reset_screen(); 
	}
  else { 
	$('#flash').addClass('green');
	$('#flash').html("<p class='center green'>Valid API Key Found</p>");
  }
}

function peerIndexID(){	
	var search = $('#search').val();
	var url = 'https://api.peerindex.com/1/actor/extended?twitter_screen_name=' + search + '&api_key=' + api_key;
	AppMobi.device.getRemoteData(url,"GET","","showUserCB","displayFlashMessage");		
}

function showUserCB(rawPayload)
{
	var data = $.parseJSON(rawPayload);
	reset_screen();
	if (!data.peerindex_id) {
		AppMobi.notification.alert('No PeerIndex Data Found for Actor','Oops','OK');
		reset_screen();
		return false;
	}	
	var peerindexScore = data.peerindex;

	$("#peerindex-output").show();
	$("#peerindex-output .peerindexScore").html('<p class="center"><strong>PeerIndex Profile</strong></p>');
	$("#peerindex-output .peerindexScore").append('<p>PeerIndex ID: ' + data.peerindex_id + '<br />Twitter ID#: ' + data.twitter.id + '<br />PeerIndex Score: ' + data.peerindex + '<br />Audience Score: ' + data.audience + '<br />Activity Score: ' + data.activity + '<br />Authority Score: ' + data.authority + '</p>');
}

function reset_screen(){
	$(".output-inner").hide();
}

function errorCB(data)
{
  console.log ("GRD error "+data);
}
