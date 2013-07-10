// File: test_mediacap.js
// Author: Luc Martel
// Updated: 8/7/13

// Check if it exists
function hasGetUserMedia() {
   // Note: Opera is unprefixed.
   // The !! is just a trick to go from (expression) -> false -> true
   return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

var localMediaStream = null;
var video = document.querySelector('#camera-window');

// Didn't work -> At least play Big Buck Bunny :) 
function capture_fallback(e) {
   console.log(e);
   video.src = 'big-buck-bunny_trailer.webm';
}

function capture_success(stream) {
   // Set the video source to the MediaStream object to render the video in the
   // browser
   video.src = window.URL.createObjectURL(stream);
   video.controls = true;
   localMediaStream = stream;
}

function capture(tracks) {
   if (hasGetUserMedia()) {
      // Browser independant code
      // Removing the prefix
      // Need: FireFox 20+
      //     : Chrome  18+
      window.URL = window.URL || window.webkitURL;
      navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia || navigator.msGetUserMedia;

      // Get user media -> pass the the MediaStream object to function(stream) if succesful  
      navigator.getUserMedia(tracks, capture_success, capture_fallback);
   } else {
      console.log("IN HERE");
      alert('getUserMedia() is not supported in your browser');
   }
}
function stop() {
   video.pause();
   localMediaStream.stop();
}
