// *******************SET YOUR API KEY HERE*******************
// ***********************************************************

// Insert your Rotten Tomatoes API Key here. ReadMe for more info.
var api_key ='your_api_key_here';

// ***********************************************************
// ***********************************************************

// Check if valid API Key
function check_keys(){			
	var url = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?apikey=' + api_key;
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
	$('#flash').html("<p class='center'><strong>Rotten Tomatoes API Key Not Found</strong></p><p>Please see <a target='_blank' href='Readme.md'>ReadMe</a> file located in the Project directory for instructions.</p><p>(Hint: To locate your project directory, click on the <img class='middle' style='width:35px;margin-left:-5px;' src='images/project_icon.png'/> icon on the Emulator Toolbar above</p>");
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

function topMovies(){	
	var search = $('#search').val();
	var url = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?apikey=' + api_key;
	AppMobi.device.getRemoteData(url,"GET","","topMoviesCB","displayFlashMessage");
}

function topMoviesCB(rawPayload)
{
	var data = $.parseJSON(rawPayload);
	reset_screen();
	if (!data.movies) {
		AppMobi.notification.alert('No Movies Found','Oops','OK');
		return false;
	}	
	var movies = data.movies;
	$("#rotten-output").show();
	$("#rotten-output .movies").html('<p class="center"><strong>Top Movies</strong></p>');

	$.each(movies, function(index, movie) {
		$("#rotten-output .movies").append('<hr/>');
		$("#rotten-output .movies").append('<div id="box-'+index+'"class="box"><img src="' + movie.posters.thumbnail + '" /><p><a href="'+ movie.links.alternate+'">' + movie.title + '</a></p>');
	 });	
}

function topRentals(){	
	var search = $('#search').val();
	var url = 'http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/new_releases.json?apikey=' + api_key;
	AppMobi.device.getRemoteData(url,"GET","","topRentalsCB","displayFlashMessage");
}

function topRentalsCB(rawPayload)
{
	var data = $.parseJSON(rawPayload);
	reset_screen();
	if (!data.movies) {
		AppMobi.notification.alert('No DVDs Found','Oops','OK');
		return false;
	}	
	var movies = data.movies;
	$("#rotten-output").show();
	$("#rotten-output .movies").html('<p class="center"><strong>Top DVD Rentals</strong></p>');

	$.each(movies, function(index, movie) {
		
		$("#rotten-output .movies").append('<hr/>');
		$("#rotten-output .movies").append('<div id="box-'+index+'"class="box"><img src="' + movie.posters.thumbnail + '" /><p><a href="'+ movie.links.alternate+'">' + movie.title + '</a></p>');
	 });	
}

function reset_screen(){
	$(".output-inner").hide();
}

function errorCB(data)
{
  console.log ("GRD error "+data);
}
