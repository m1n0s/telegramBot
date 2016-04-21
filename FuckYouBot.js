(function(){

    'use strict';

    const TelegramBot = require('node-telegram-bot-api'),
          http = require('http'),
          request = require('request'),
          fetch = require('node-fetch'),
          API500px = require('500px'),
          photos500 = new API500px('fxbA5gQpzkR3NskiYH8eJGjEm7zgWY4Qiu9KomVR');

    const token = '202042596:AAH70-eStPEor76bG3LQG0RY6lkElWBPIIc';

    let photoURL = [];

    photos500.photos.searchByTag('cat', {'sort': 'created_at', 'rpp': '20', 'image_size': '600'},  function(error, results) {
        if (error) {
            // Error!
            return;
        }
        results.photos.forEach(item => photoURL.push(item.image_url));
    });

    let botOptions = {
        polling: true
    };

    /*var options = {
        url: 'https://api.github.com/users/m1n0s',
        headers: {
            'User-Agent': 'request'
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            console.log(info.name);
            //console.log(info.forks_count + " Forks");
        }
    }

    request(options, callback);*/

    let botData;
    const bot = new TelegramBot(token, botOptions);

    bot.getMe().then(me => {
        botData = me;
        console.log('Hello! My name is %s!', me.first_name);
        console.log('My id is %s.', me.id);
        console.log('And my username is @%s.', me.username);
    });

    bot.on('text', msg => {
        let messageChatId = msg.chat.id,
            messageText = msg.text,
            messageDate = msg.date,
            messageNick = msg.from.username,
            messageName = msg.from.first_name,
            messageSurname = msg.from.last_name;

        if (messageText.match(/\/hello/)) {
            sendMessageByBot(messageChatId, 'Hello ' + messageName + '!');
        }

        if (messageText === '/fuckleo' || messageText === '/fuckleo@leoslave_bot') {
            sendMessageByBot(messageChatId, 'Oh! Leo is the best! So fuck you ' + messageName +' '+ messageSurname + '!');
        }

        if (messageText === '/love' || messageText === '/love@leoslave_bot') {
            sendMessageByBot(messageChatId, 'Leo love\'s Sofi very much! Everybody knows it!');
        }

        if (messageText === '/football' || messageText === '/football@leoslave_bot') {
            sendMessageByBot(messageChatId, 'Dynamo Kyiv is the best of the best!');
        }

        if (messageText.match(/\/today/)) {
            sendMessageByBot(messageChatId, 'kurwa');
        }

        if (messageText.match(/\/photo/)) {
            /*bot.sendPhoto({
                chat_id: messageChatId,
                caption: 'This is my test image',

                // you can also send file_id here as string (as described in telegram bot api documentation)
                photo: 'stock-photo-150348819.jpg'
            });*/
            sendMessageByBot(messageChatId, photoURL[Math.round(Math.random() * photoURL.length)]);
        }

        console.log(msg);
    });

    function sendMessageByBot(aChatId, aMessage)
    {
        bot.sendMessage(aChatId, aMessage, { caption: 'I\'m a cute bot!' });
    }

    /*квестов? у них нет отдельных исходников, доставай qm-файлы из пакетника, открывай через ТГЕ*/

})();