//	TMDB sample calls
// 	search query: http://api.themoviedb.org/3/search/movie?query={PARAMS}&api_key=9e1b08f9af16f8d7c20c0dd0aeb4749a
// 	poster query: http://image.tmdb.org/t/p/original/{IMAGE_PATH}
//  details url: http://api.themoviedb.org/3/movie/{ID}?api_key=9e1b08f9af16f8d7c20c0dd0aeb4749a&append_to_response=credits

//Things needed 
// - poster ✔
// - title ✔
// - year ✔
// - tagline - details
// - time - details
// - imdb rating - 
// - description - details
// - genres - details
// - director - details
// - actors - details
// - trailer - details
// - imdb link - details
// - kickass link - direct

"use strict;"

var $input = document.getElementById('input');
var $search = document.getElementById('search');
var $resultContainer = document.getElementById('resultContainer');
var api_key = "9e1b08f9af16f8d7c20c0dd0aeb4749a";
var movieBaseUrl = "http://api.themoviedb.org/3/search/movie";
var imageBaseUrl = "http://image.tmdb.org/t/p/original";
var detailsBaseUrl = "http://api.themoviedb.org/3/movie/"; 
var appendDetails = "&append_to_response=videos,reviews,rating,casts";

var responseJSON, resultsArray;

$search.addEventListener('click', function(e){
	
	e.preventDefault(); //stops page from reloading - which is default behaviour of submit button
	
	//clearing results div
	$resultContainer.innerHTML = "";
	
	//forming url for querying TMDb
	var searchUrl = movieBaseUrl + "?api_key=" + api_key + "&query=" + $input.value;
	
	var searchXHR = new XMLHttpRequest();
	
	searchXHR.onreadystatechange = function(){
		if (searchXHR.readyState == 4 && searchXHR.status == 200) {
			responseJSON = JSON.parse(searchXHR.responseText);
			resultsArray = responseJSON.results;

			for (var i = 0; i < resultsArray.length; i++) {
				var tmdbPoster = resultsArray[i].poster_path;
				var tmdbId = resultsArray[i].id;
				var tmdbTitle = resultsArray[i].title;
				var tmdbYear;

				//	setting default image is poster not available
				if(tmdbPoster === null) {
					tmdbPoster = "noposter.png";
				} else {
					tmdbPoster = imageBaseUrl + tmdbPoster;
				}
				
				// rows for displaying search result
				var resultRow = document.createElement("div");
				resultRow.setAttribute('class', 'resultRow');
				$resultContainer.appendChild(resultRow);

				// fetching and displaying movie poster
				var moviePoster = document.createElement('div');
				moviePoster.setAttribute('class', 'poster');
				moviePoster.style.backgroundImage = "url(" + tmdbPoster + ")"

				var movieDetails = document.createElement('div');
				movieDetails.setAttribute('class', 'details');
				
				// fetching and displaying movie title
				var movieTitle = document.createElement("h2");
				movieTitle.innerHTML = tmdbTitle;
				movieDetails.appendChild(movieTitle);

				// fetching and displaying movie year
				if (resultsArray[i].release_date === null) {
					tmdbYear = "release year not available";
				} else {
					tmdbYear = resultsArray[i].release_date.slice(0, 4);
				}

				var releaseYear = document.createElement("h2");
				releaseYear.innerHTML = tmdbYear;
				movieDetails.appendChild(releaseYear);

				// fetching and displaying movie runtime
				var movieTime = document.createElement("h3");
				movieTime.innerHTML = moreDetails(tmdbId) + " mins";
				movieDetails.appendChild(movieTime);

				resultRow.appendChild(moviePoster);
				resultRow.appendChild(movieDetails);
			}
			$input.value = "";
		}
	}

	searchXHR.open("GET", searchUrl, true);
    searchXHR.send();
})

function moreDetails(id){
	var detailsXHR = new XMLHttpRequest();				
	var detailsUrl = detailsBaseUrl + id + "?api_key=" + api_key + appendDetails;
	var duration;
	
	detailsXHR.onreadystatechange = function(){
		if (detailsXHR.readyState == 4 && detailsXHR.status == 200) {
			var detailsJSON = JSON.parse(detailsXHR.responseText);
			duration = detailsJSON.runtime || "not available";
			console.log(duration);
		}
	}
	detailsXHR.open("GET", detailsUrl, true);
	detailsXHR.send();

	return duration;
}











