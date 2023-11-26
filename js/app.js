let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let track_index = 0;
let isPlaying = false;
let updateTimer;

// Create new audio element
let curr_track = document.createElement('audio');

// Define the tracks that have to be played

function getJson() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //  document.getElementById("demo").innerHTML = this.responseText.songs;
      myArray = this.responseText;
      myJson = JSON.parse(myArray);
      // mySongs = myJson.songs;
      mySongs = myJson.list;
      loadTrack(track_index);
      mediaSessionStart()

    }
  };
  // xhttp.open("GET", "https://mysaavnapi.herokuapp.com/result/?query=https://www.jiosaavn.com/s/playlist/fd15cad99c0fdf20e82c2bc80969d2fb/Gazal/GGvPNWTD1tFYufGtEEFmDA__", true);
  let link = prompt("Enter Link", "https://www.jiosaavn.com/api.php?__call=webapi.get&token=GGvPNWTD1tFYufGtEEFmDA__&type=playlist&p=1&n=50&includeMetaTags=0&ctx=web6dot0&api_version=4&_format=json&_marker=0");
  link = encodeURIComponent(link)
  xhttp.open("GET", "https://bizzcard.info/saavnapi/?urll=" + link, true);
  xhttp.send();
}
getJson()

function random_bg_color() {

  // Get a number between 64 to 256 (for getting lighter colors)
  let red = Math.floor(Math.random() * 256) + 64;
  let green = Math.floor(Math.random() * 256) + 64;
  let blue = Math.floor(Math.random() * 256) + 64;

  // Construct a color withe the given values
  let bgColor = "rgb(" + red + "," + green + "," + blue + ")";

  // Set the background to that color
  document.body.style.background = bgColor;
}

function decodeURL(encryptedMediaUrl) {
  // var encryptedMediaUrl = "ID2ieOjCrwfgWvL5sXl4B1ImC5QfbsDyPWnb3SDh+33hBRUVAyh8rpVMNy6UZZqPxV695BkpJaBHkm5jxu2nIBw7tS9a8Gtq";

  const key = "38346591";

  const decrypted = CryptoJS.DES.decrypt(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { ciphertext: CryptoJS.enc.Base64.parse(encryptedMediaUrl) },
    CryptoJS.enc.Utf8.parse(key),
    { mode: CryptoJS.mode.ECB }
  );

  const decryptedLink = decrypted.toString(CryptoJS.enc.Utf8);
  return decryptedLink;
  // console.log(decryptedLink)
}

function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();
  // curr_track.src = mySongs[track_index].media_url.replace("_160.mp4", "_320.mp4");
  encrypted_url = mySongs[track_index].more_info.encrypted_media_url;
  curr_track.src = decodeURL(encrypted_url);
  console.log(curr_track.src)
  // console.log(curr_track.src)
  curr_track.load();

  track_art.style.backgroundImage = "url(" + mySongs[track_index].image + ")";
  track_name.textContent = mySongs[track_index].album;
  track_artist.textContent = mySongs[track_index].music;
  now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + mySongs.length;

  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("ended", nextTrack);
  random_bg_color();
}

// ===================
function mediaSessionStart() {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: mySongs[track_index].album,
    artist: mySongs[track_index].music,
    // album: 'MainStay',
    artwork: [
      { src: mySongs[track_index].image.replace("500x500.jpg", "150x150.jpg"), sizes: '150x150', type: 'image/png' }
    ]
  });

  navigator.mediaSession.setActionHandler('pause', () => {
    playpauseTrack();
  });
  navigator.mediaSession.setActionHandler('play', () => {
    playpauseTrack()
  });

  navigator.mediaSession.setActionHandler('seekbackward', (details) => {
    audio.currentTime = audio.currentTime - (details.seekOffset || 10);
  });

  navigator.mediaSession.setActionHandler('seekforward', (details) => {
    audio.currentTime = audio.currentTime + (details.seekOffset || 10);
  });

  navigator.mediaSession.setActionHandler('previoustrack', () => {
    prevTrack()
    mediaSessionStart()
  });

  navigator.mediaSession.setActionHandler('nexttrack', () => {
    nextTrack()
    mediaSessionStart()
  });
}
// ===================

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

// Load the first track in the tracklist
// loadTrack(track_index);

function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';;
}

function nextTrack() {
  if (track_index < mySongs.length - 1)
    track_index += 1;
  else track_index = 0;
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0)
    track_index -= 1;
  else track_index = mySongs.length;
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);

    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}
