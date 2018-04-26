(function (){

    var player = document.getElementById('video-player'); // element video

    // przyciski i formularze
    var syncPlayer = document.getElementById('sync-player');
    var playButton = document.getElementById('play-button');
    var fullscreenButton = document.getElementById('fullscreen-button');
    var muteButton = document.getElementById('mute-button');
    var inputForm = document.getElementById('input-form');
    var messageTemplate = document.getElementById('message-template');
    var messageContainer = document.getElementById('message-container');

    // Inicjujemy pustą tablice na wiadomości
    var messages = [];

    // Obsługa przycisku play
    // Nasłuchujemy zarzenia click i wywołujemy funkcję
    playButton.addEventListener('click', function() {
        if(player.paused){
            player.play();
        } else {
            player.pause();
        }
    });

    // Obsługa wyciszania
    muteButton.addEventListener('click', function() {
        player.muted = !player.muted;
    });

    // Obsługa fullscreena
    fullscreenButton.addEventListener('click', function(){
        syncPlayer.requestFullscreen = syncPlayer.requestFullscreen || syncPlayer.webkitRequestFullscreen || syncPlayer.mozRequestFullScreen;
        document.fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
        document.exitFullscreen = document.exitFullscreen || document.webkitCancelFullScreen || syncPlayer.mozRequestExitFullScreen;

        if(document.fullscreenElement) {
            document.exitFullscreen();
            document.fullscreenElement = null;
        } else {
            syncPlayer.requestFullscreen(); 
        }
    })

    // Formularz z wiadomościami
    inputForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var form = event.target;
        var myMessage = form.elements.wiadomosc.value;

        var messageObj = createMessage({
            text: myMessage,
            time: Date.now()
        });


       // messages.push(messageObject);

        console.log(messages);
    });

    function createMessage(msg){

        var newMessage = messageTemplate.cloneNode(true);

        newMessage.removeAttribute('id'); //usunięcie ID, żeby nie tworzylo sie wiecej obiektow z takim ID

        var textContainer = newMessage.getElementsByClassName('text')[0];
        var timeContainer = newMessage.getElementsByClassName('time')[0];

        textContainer.innerText = msg.text;
        var date = new Date(msg.time);
        timeContainer.innerText = date.toDateString();

        newMessage.className = 'message';

        msg.element = newMessage;

        messageContainer.insertBefore(newMessage, messageContainer.firstChild);

        return msg;
    }

    function removeMessage (messageElement){
        var index = null;

        messages.map(function(message, i ) //map wywoluje petle po kazdym elemencie tablicy
            {
            if(message.element === messageElement){
                index = i;
            }
        });
        messageContainer.removeChild(messageElement);
        messages.splice(index, 1); //usuwamy elementy zaczynające sie od tego indexu i podajemy ile chcemy ich usunąć
    }

    function crawlMessages(){
         messages.forEach(function(message, index){
            var now = Date.now();
            if(now - message.time > 10000)
            {
                removeMessage(message.element);
            }
         });
         setTimeout(crawlMessages, 1000);
    }
    crawlMessages;


})();


