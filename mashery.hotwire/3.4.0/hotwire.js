// *******************SET YOUR API KEY HERE*******************
// ***********************************************************

// Insert your Hotwire API Key here. ReadMe for more info.
var api_key = 'your-API-key-here';

// ***********************************************************
// ***********************************************************

// Check if valid API Key
function check_keys() {
	var url = 'http://api.hotwire.com/v1/deal/hotel?limit=1&dest=94103&distance=15&apikey=' + api_key;
	AppMobi.device.getRemoteData(url, "GET", "", "displayFlashMessage", "displayFlashMessage");
}

function displayFlashMessage(rawPayload) {

	var httpStatus = '200';
	var matchString = new RegExp("code: ([0-9]{3})");
	var matchArray = rawPayload.match(matchString);

	if(matchArray) {
		httpStatus = matchArray[1];
	}

	$('#flash').show();
	if(httpStatus == '404') {
		AppMobi.notification.alert('Profile Not Found', 'Oops', 'OK');
		reset_screen();
	} else if(httpStatus == '403') {
		AppMobi.notification.alert('Please check the Readme.md file for instructions', 'Invalid API Key', 'OK');
		$('#flash').addClass('red');
		$('#flash').html("<p class='center'><strong>Hotwire API Key Not Found</strong></p><p>Please see <a target='_blank' href='Readme.md'>ReadMe</a> file located in the Project directory for instructions.</p><p>(Hint: To locate your project directory, click on the <img class='middle' style='width:35px;margin-left:-5px;' src='images/project_icon.png'/> icon on the Emulator Toolbar above</p>");
	} else if(httpStatus == '202') {
		AppMobi.notification.alert('Profile Not Found', 'Invalid ID', 'OK');
		reset_screen();
	} else {
		$('#flash').addClass('green');
		$('#flash').html("<p class='center green'>Valid API Key Found</p>");
	}
}

function searchDeals() {
	var search = $('#search').val();
	var url = 'http://api.hotwire.com/v1/deal/hotel?format=json&limit=10&distance=10&apikey=' + api_key + '&dest=' + search;
	AppMobi.device.getRemoteData(url, "GET", "", "searchDealsCB", "displayFlashMessage");
}

function searchDealsCB(rawPayload) {
	var data = $.parseJSON(rawPayload);
	reset_screen();
	if(!data.Result[0]) {
		alert('No hotel deals could be found there. Sorry!');
		return false;
	}

	$("#hotwire-output").show();
	for(var x in data.Result) {
		var deal = data.Result[x];
		var html = "<span onclick='AppMobi.device.launchExternal(\"" + deal.Url + "\");'>" + deal.Headline + "&nbsp;<img src='images/hwarrow.png' height=/></span><br /><br />";
		$("#hotwire-output .deals").append(html);
	}
}

function reset_screen() {
	$(".output-inner").hide();
}

function errorCB(data) {
	console.log("GRD error " + data);
}