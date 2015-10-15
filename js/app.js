//	TMDB sample calls
// 	search query: http://api.themoviedb.org/3/search/movie?query={PARAMS}&api_key={api_key}
// 	poster query: http://image.tmdb.org/t/p/original/{IMAGE_PATH}
//  details url: http://api.themoviedb.org/3/movie/{ID}?api_key={api_key}&append_to_response=credits

// Things needed 
// - poster ✔
// - title ✔
// - year ✔
// - tagline ✔
// - time ✔
// - imdb rating ✔
// - description ✔
// - genres ✔
// - director ✔
// - actors ✔
// - trailer ✔
// - imdb link ✔
// - kickass link ✔

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

$input.addEventListener('keypress', function(e){
	
	if (e.keyCode == 13) {
	
		//clearing results div
		$resultContainer.innerHTML = "";
		
		//forming url for querying TMDb
		var searchUrl = movieBaseUrl + "?api_key=" + api_key + "&query=" + $input.value;
		
		var searchXHR = new XMLHttpRequest();
		searchXHR.open("GET", searchUrl, true);

		searchXHR.onreadystatechange = function(){
			if (searchXHR.readyState === 4 && searchXHR.status === 200) {
				responseJSON = JSON.parse(searchXHR.responseText);
				resultsArray = responseJSON.results;

				//
				if(responseJSON.results.length === 0) {
					console.log($input.value + "not found");
					var noResult = document.createElement('h1');
					noResult.innerHTML = '<b>' + $input.value + '</b>' + " not found :(" + '<br>';
					noResult.innerHTML += "You need to search with a valid movie title."
					$resultContainer.appendChild(noResult);
				}

				for (var i = 0; i < resultsArray.length; i++) {
					var tmdbPoster = resultsArray[i].poster_path;
					var tmdbId = resultsArray[i].id;
					var tmdbTitle = resultsArray[i].title;
					var tmdbYear;

					//	setting default image is poster not available
					if(tmdbPoster === null) {
						tmdbPoster = "'../img/noposter.png'";
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
					releaseYear.setAttribute('class', 'year');
					releaseYear.innerHTML = "(" + tmdbYear + ")";
					movieDetails.appendChild(releaseYear);
					
					moreDetails(tmdbId, movieDetails);

					resultRow.appendChild(moviePoster);
					resultRow.appendChild(movieDetails);
				}
				$input.value = "";
			}
		}
	    searchXHR.send();
	}
});

function moreDetails(id, movieDetails){
	var detailsXHR = new XMLHttpRequest();	

	var detailsUrl = detailsBaseUrl + id + "?api_key=" + api_key + appendDetails;
	
	detailsXHR.onreadystatechange = function(){
		if (detailsXHR.readyState == 4 && detailsXHR.status == 200) {
			
			var detailsJSON = JSON.parse(detailsXHR.responseText);
			
			var duration, slogan, imdbId, plot, youtubeKey, genresList, actorsList, crewList;
			
			// fetching and displaying movie tagline
			if(detailsJSON.tagline){
				slogan = detailsJSON.tagline;
				var movieTagline = document.createElement("p");
				movieTagline.setAttribute('class', 'tagline');
				movieTagline.innerHTML = slogan;
				movieDetails.appendChild(movieTagline);
			}
			
			// fetching and displaying movie overview
			plot = detailsJSON.overview;
			var moviePlot = document.createElement("p");
			moviePlot.innerHTML = plot;
			movieDetails.appendChild(moviePlot);

			// fetching and displaying movie runtime
			if(detailsJSON.runtime) {
				duration = detailsJSON.runtime || "-";
				var movieTime = document.createElement("p");
				movieTime.innerHTML = "<b>Runtime:</b> " + duration + " mins";
				movieDetails.appendChild(movieTime);
			}

			// fetching and displaying movie genres
			if(detailsJSON.genres.length !== 0) {
				
				genresList = detailsJSON.genres;
				var movieGenre = document.createElement('p');
				var genre = " ";

				for(var i = 0; i < genresList.length; i++) {
					genre += genresList[i].name + ", ";
				}

				movieGenre.innerHTML = "<b>Genres: </b>" + genre.substr(0, genre.length-2);
				movieDetails.appendChild(movieGenre);
			}

			// fetching and displaying movie actor
			if(detailsJSON.casts.cast.length !== 0) {
				
				actorsList = detailsJSON.casts.cast;
				var movieActors = document.createElement('p');
				var actor = " ";

				for(var i = 0; i < actorsList.length; i++) {
					actor += actorsList[i].name + ", ";
					if(i === 3) {break;}
				}

				movieActors.innerHTML = "<b>Actors: </b>" + actor.substr(0, actor.length-2);
				movieDetails.appendChild(movieActors);
			}

			// fetching and displaying movie director
			if(detailsJSON.casts.crew.length !== 0) {
				
				crewList = detailsJSON.casts.crew;

				for(var i = 0; i < crewList.length; i++) {
					if(crewList[i].job === "Director") {
						var movieDirector = document.createElement('p');
						movieDirector.innerHTML = "<b>Director: </b>" + crewList[i].name;
						movieDetails.appendChild(movieDirector);
					}
				}
			}
			
			// fetching and displaying imdb rating
			imdbId = detailsJSON.imdb_id;

			var movieRating = document.createElement("p");
			movieDetails.appendChild(movieRating);
			imdbRating(imdbId, movieRating);

			// fetching and displaying imdb link
			var imdbUrl = document.createElement("a");
			imdbUrl.setAttribute('href', "http://www.imdb.com/title/" + imdbId);
			imdbUrl.setAttribute('target', "_blank");
			imdbUrl.setAttribute('class', "button imdb");
			movieDetails.appendChild(imdbUrl);
			
			// Displaying Kickass link
			var kickassLink = document.createElement('a');
			kickassLink.setAttribute('href', "https://kat.cr/usearch/" 
									+ detailsJSON.title 
									+ " " 
									+ detailsJSON.release_date.slice(0, 4));
			kickassLink.setAttribute('target', "_blank");
			kickassLink.setAttribute('class', 'button kickass');
			movieDetails.appendChild(kickassLink);

			// fetching and displaying movie trailer link
			if(detailsJSON.videos.results.length !== 0) {
				youtubeKey = detailsJSON.videos.results[0].key;
				var movieTrailer = document.createElement("a");
				movieTrailer.setAttribute('href', "https://www.youtube.com/watch?v=" + youtubeKey);
				movieTrailer.setAttribute('class', 'button trailer');
				movieTrailer.setAttribute('target', "_blank");
				movieTrailer.innerHTML = "Watch Trailer";
				movieDetails.appendChild(movieTrailer);
			}

		}
	}
	detailsXHR.open("GET", detailsUrl, true);
	detailsXHR.send();
}

function imdbRating(id, movieRating) {
	
	var ratingXHR = new XMLHttpRequest();
	
	var ratingUrl = "http://www.omdbapi.com/?i=" + id + "&r=json";
	ratingXHR.open("GET", ratingUrl, true);
	
	ratingXHR.onreadystatechange = function(){
		if (ratingXHR.readyState == 4 && ratingXHR.status == 200) {
			var omdbJSON = JSON.parse(ratingXHR.responseText);
			if(omdbJSON.imdbRating) {
				var rating = omdbJSON.imdbRating;
				movieRating.innerHTML = "<b>IMDb Rating: </b>" + rating + "/10";
			}
		}
	}
	ratingXHR.send();
}