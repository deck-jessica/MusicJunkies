// Global variables
var userSongName = "";
var userArtistName = "";

// // Modal button/function
$(document).ready(function(){
  $('#modalIntro').modal();
  $('#modalIntro').modal('open');
});
          
// function to save user input to local storage for persistent data
function saveToStorage(newDate) {
  var currentData = JSON.parse(localStorage.getItem("saved-dates")) || [];
  currentData.push(newDate);
  localStorage.setItem("saved-dates", JSON.stringify(currentData));
}

// function to make a button for the search history dates using saved info from local storage
function renderSaveSearchBtns() {
  var currentData = JSON.parse(localStorage.getItem("saved-dates")) || [];
  currentData.forEach(function (searchData) {
    var btnDate = $("<button>");
    console.log(btnDate);
    btnDate.addClass("waves-effect waves-light btn-large search-history-btn");
    btnDate.text(searchData);
    $(".searchHistory").prepend(btnDate);
  });
}

// function call to append search history buttons to page
renderSaveSearchBtns();

// allows search history buttons to rerun through the APIs to pull info back up to page
$(".search-history-btn").on("click", function () {
  var searchHistoryDate = $(this).text();
  inputDate(searchHistoryDate);
});

// this is where the first and second API calls are made, once a user has input a date to search for
$(".submit").on("click", function () {
  let inputUserDate = $(".inputValue").val();
  inputDate(inputUserDate);
  saveToStorage(inputUserDate);
  $(".inputValue").val("");
});

// function to search for user's chosen date and run it through the Billboard API to find #1 song that day
function inputDate(userDate) {

  billBox.style.display = "block";

	// rowContainer.classList.add("hide");

  const settings = {
    async: true,
    crossDomain: true,
    url:
      "https://billboard-api2.p.rapidapi.com/hot-100?date=" +
      userDate +
      "&range=1-5",
    method: "GET",
    headers: {
      "x-rapidapi-key": "a7a119ea37msh093d314a936d441p161292jsn2b645c9b5683",
      "x-rapidapi-host": "billboard-api2.p.rapidapi.com",
    },
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    let imageEl = $("<img src = " + response.content[1].image + ">");
    userSongName = response.content[1].title;
    userArtistName = response.content[1].artist;

	// Added elements to space out card content
    dateToStandard = moment(response.info.date).format("ddd MMM Do, YYYY");
	  artistDate = $("<h2>").text("This Day in History: " + dateToStandard);
	  displaySongName = $("<h3>").text("Song #1: " + userSongName);
	  displayArtistName = $("<h3>").text("Artist: " + userArtistName);

    $(".card-content").empty();
    $(".card-image").empty();
    $(".card-content").append(artistDate, displaySongName, displayArtistName);
    $(".card-image").append(imageEl);


    renderVideoLink(userSongName, userArtistName);




    var headline = $("<h3>").text("Other Top Songs: ")
    var songTwo = $("<p>").text("#2: " + response.content[2].title + " by " + response.content[2].artist);
    var songThree = $("<p>").text("#3: " + response.content[3].title + " by " + response.content[3].artist);
    var songFour = $("<p>").text("#4: " + response.content[4].title + " by " + response.content[4].artist);
    var songFive = $("<p>").text("#5: " + response.content[5].title + " by " + response.content[5].artist);

  $(".top5").empty();
  $(".top5").append(headline, songTwo, songThree, songFour, songFive);



  });
}


// Once targeted song is chosen, this function will run through the second API, AudioDB to get a link to the music video
function renderVideoLink() {
  const settingsTwo = {
    async: true,
    crossDomain: true,
    url:
      "https://theaudiodb.p.rapidapi.com/searchtrack.php?t=" +
      userSongName +
      "&s=" +
      userArtistName,
    method: "GET",
    headers: {
      "x-rapidapi-key": "07be92493emshea6401a64571b97p134b1ejsn07c4838e18d4",
      "x-rapidapi-host": "theaudiodb.p.rapidapi.com",
    },
  };

  $.ajax(settingsTwo).done(function (responseTwo) {
    console.log(responseTwo);

// // If/Else for if video link not available prompts modal


    if (responseTwo && responseTwo.track) {
      var videoEl = $("<a>", {
        href: responseTwo.track[0].strMusicVid,
        text: "Link to Music Video",
        target: "_blank",
      });
      
      $(".vidlink").empty();
      $(".vidlink").append(videoEl);
     
    }
    else {
      $('#modalVid').modal(); 
      $('#modalVid').modal('open');
      console.log("Video Not Found!");
    };
   
	artistSearchWiki(userArtistName);

  });
}




async function artistSearchWiki(data) {
    //event.preventDefault();
    // const inputValue = document.querySelector('.js-search-input').value;
    var searchQuery = userArtistName;
  
    try {
      const results = await searchWikipedia(data);
	  console.log(results);
    var artistWikiPageId = results.query.search[0].pageid;
    var artistLink = $("<a>", 
        {target: "_blank", 
        href: "https://en.wikipedia.org/?curid="+ artistWikiPageId, 
        text: "Link to " + userArtistName + " Wikipedia Page"});
        $(".artistlink").empty();
      $(".artistlink").append(artistLink);
    } catch (err) {
      console.log(err);
      alert('Failed to search wikipedia');
    }
  }
  
  async function searchWikipedia(searchQuery) {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=` + searchQuery ;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    const json = await response.json();
    return json;
  }
  

// Datepicker
$(document).ready(function () {
  $(".datepicker").datepicker({
    format: "yyyy-mm-dd",
  });
  
});
