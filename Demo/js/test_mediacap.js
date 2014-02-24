// File: test_mediacap.js
// Author: Luc Martel
// Updated: 8/7/13

// Helper functions
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

// Check if it exists
function hasGetUserMedia() {
   // Note: Opera is unprefixed.
   // The !! is just a trick to go from (expression) -> false -> true
   return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

// Multimedia elements
var localMediaStream = null;
var video  = document.querySelector('#camera-window');
var still  = document.querySelector('#still-window');
var context = still.getContext('2d');
var timer = undefined;
var recorder;

// WebSockets
var ws_vdata = new WebSocket("ws://127.0.0.1:8901");


// Didn't work -> At least play Big Buck Bunny :) 
function capture_fallback(e) {
   console.log(e);
   video.src = 'big-buck-bunny_trailer.webm';
}

// Stream is a MediaStream object ?
function capture_success(stream) {
   // Set the video source to the MediaStream object to render the video in the
   // browser
   video.src = window.URL.createObjectURL(stream);
   video.controls = true;
   localMediaStream = stream;
   
   still.width = video.clientWidth;
   still.height = video.clientHeight;
   
   // Blobed JPEG sent every second
   
   timer = setInterval( function () {
                           context.drawImage(video, 0, 0, still.width, still.height);
                           var data = still.toDataURL('image/jpeg', 1.0);
                           newBlob = dataURItoBlob(data);
                           ws_vdata.send(newBlob);
                        }, 1000);
   

   // Connect the MediaStream to the MediaStreamTransceiver
   
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
   if (localMediaStream) {
      localMediaStream.stop();
   }
   if (timer) {
      clearInterval(timer);
   }
}
 
