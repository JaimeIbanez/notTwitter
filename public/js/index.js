// ESTE ES EL CLIENTE

$(document).ready(function() {
   var lastTime = 0;
   var dialog = document.getElementById('dialog');
   dialog.showModal();

   $('#ingresarBtn').on('click', function() {
       dialog.close();
       $('#userName').text($('#userInput').val());
   });

   $('#tweet').on('click', function() {
       // hacer POST a /tweet

       $.ajax({
           type: 'POST',
           url: '/tweet',
           data: JSON.stringify({
               text: $("#tweetContent").val()
           }),
           dataType: 'json',
           headers: {
               'timestamp': new Date().getTime(),
               'user': $('#userName').text()
           },
           success: function() {
               console.log('el server respondió la petición.');
           }
       });
   });

   // Cada X cantidad de segundos, hacer un GET a /data
   // Por cada elemento de la lista que responda el servidor,
   // agregarlo haciendo $('#contenedor .centre').append(htmlDelTweet)
   // HINT: usar la function getHTMLforTweet, que recibe un objeto que representa
   // un tweet y devuelve un objeto que representa su HTML

   function getTweets() {
       $.ajax({
           type: 'GET',
           url: '/data',
           dataType: 'json',
           headers: {
               'timestamp': lastTime,
               'user': $('#userName').text()
           },
           success: function(data) {

               data.forEach(function(curr) {

                   var htmlDelTweet = getHTMLforTweet(curr);
                   $('#contenedor .centre').append(htmlDelTweet);
               });
               lastTime = new Date().getTime();
               setTimeout(getTweets, 3000);
           }
       });
   };

   getTweets();


   function getHTMLforTweet(tweet) {
       var elemHTML = $('<div></div>');
       elemHTML.html('User:' + tweet.user.name +
           '<br>' + tweet.text);
       return elemHTML;
   }
});