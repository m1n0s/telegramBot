(function(){

    'use strict';

    const TelegramBot = require('node-telegram-bot-api'),
          http = require('http');

    const token = '202042596:AAH70-eStPEor76bG3LQG0RY6lkElWBPIIc';

    let botOptions = {
        polling: true
    };

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

        console.log(msg);
    });

    function sendMessageByBot(aChatId, aMessage)
    {
        bot.sendMessage(aChatId, aMessage, { caption: 'I\'m a cute bot!' });
    }

})();