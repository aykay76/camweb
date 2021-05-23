var width = 320;    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream

var streaming = false;

var video = null;
var canvas = null;
var photo = null;
var startbutton = null;
var context = null
var first = true

function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();

        window.setInterval(frame => {
            takepicture()
        }, 100)
    })
    .catch(function(err) {
        console.log("An error occurred: " + err);
    });

    video.addEventListener('canplay', function(ev){
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);
  
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true;
        }
    }, false);
      
    startbutton.addEventListener('click', function(ev){
        takepicture();
        ev.preventDefault();
    }, false);
    
    clearphoto();
}

function clearphoto() {
    context = canvas.getContext('2d')
    context.globalAlpha = 0.5

    var data = canvas.toDataURL('image/png')
    photo.setAttribute('src', data)
}

function takepicture() {
    if (width && height) {
        canvas.width = width
        canvas.height = height

        if (first === true)
        {
            first = false
            context.drawImage(video, 0, 0, width, height) 
        }
        else
        {
            context.globalAlpha = 1.0
            context.drawImage(photo, 0, 0, width, height)
            context.globalCompositeOperation = 'lighten'
            context.globalAlpha = 0.5
            context.drawImage(video, 0, 0, width, height)
            context.globalAlpha = 1.0
        }

        var data = canvas.toDataURL('image/png')
        photo.setAttribute('src', data)
    } else {
        console.log("clearing")
        clearphoto()
    }
}

window.addEventListener('load', (event) => {
    startup();
});