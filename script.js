document.addEventListener('DOMContentLoaded', function () {
    var roomName = getRoomNameFromURL(); // Obtener el nombre de la sala de la URL actual

    var generateLinkButton = document.getElementById('generate-link');
    var videoElement = document.getElementById('my-video');
    var startStreamButton = document.getElementById('start-stream');
    var stopStreamButton = document.getElementById('stop-stream');
    var connectedDevices = document.getElementById('connected-devices');
    var streamLink = document.getElementById('stream-link');
    var mediaStream;
    var mediaRecorder;

    generateLinkButton.addEventListener('click', function () {
        var link = window.location.href.split('?')[0] + '?room=' + roomName;
        streamLink.innerHTML = '<a href="' + link + '" target="_blank">Unirse a la llamada</a>';
    });

    startStreamButton.addEventListener('click', function () {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                mediaStream = stream;
                videoElement.srcObject = stream;
                startStreamButton.disabled = true;
                stopStreamButton.disabled = false;
                startStream();
            })
            .catch(function (error) {
                console.error('Error al obtener el acceso a la cámara:', error);
            });
    });

    stopStreamButton.addEventListener('click', function () {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            mediaStream.getTracks().forEach(track => track.stop());
            startStreamButton.disabled = false;
            stopStreamButton.disabled = true;
        }
    });

    function startStream() {
        var chunks = [];
        mediaRecorder = new MediaRecorder(mediaStream);

        mediaRecorder.ondataavailable = function (event) {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        mediaRecorder.onstop = function () {
            var blob = new Blob(chunks, { type: 'video/webm' });
            var formData = new FormData();
            formData.append('video', blob, 'stream.webm');

            // Simplemente mostrar el enlace generado en lugar de transmitirlo a un servidor
            streamLink.innerHTML = '<a href="' + window.location.href.split('?')[0] + '">Ver transmisión</a>';
        };

        mediaRecorder.start();
    }

    // Función para obtener el nombre de la sala desde la URL actual
    function getRoomNameFromURL() {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('room') || 'default-room';
    }
});
