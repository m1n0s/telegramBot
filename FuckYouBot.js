(function(){

    'use strict';

    const TelegramBot = require('node-telegram-bot-api'),
          http = require('http'),
          log = console.log,
          request = require('request'),
          fetch = require('node-fetch'),
          fs = require('fs'),
          API500px = require('500px'),
          photos500 = new API500px('fxbA5gQpzkR3NskiYH8eJGjEm7zgWY4Qiu9KomVR'),
          MongoClient = require('mongodb').MongoClient,
          assert = require('assert');


    const token = '202042596:AAH70-eStPEor76bG3LQG0RY6lkElWBPIIc';

    let photoData = [];

    photos500.photos.searchByTag('cat', {'sort': 'created_at', 'rpp': '50', 'image_size': '600'},  function(error, results) {
        if (error) {
            // Error!
            return;
        }
        results.photos.forEach(item => photoData.push({name: item.name, url: item.image_url}));
    });

    let botOptions = {
        polling: true
    };
    const bot = new TelegramBot(token, botOptions);

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

    //var filename = './123.jpg';
    //var filename = 'http://24gadget.ru/uploads/posts/2013-07/1374125688_samsung-ssd-840-evo.jpg';

    let botData;


    bot.getMe().then(me => {
        botData = me;
        console.log('Hello! My name is %s!', me.first_name);
        console.log('My id is %s.', me.id);
        console.log('And my username is @%s.', me.username);
    });

    var ObjectId = require('mongodb').ObjectID,
        url = 'mongodb://localhost:27017/visit';

    MongoClient.connect(url, function(err, db) {
        //assert.equal(null, err);
        console.log("Connected correctly to server.");
        db.close();
    });




    const insertData = (db, callback, data) => {
        db.collection('visits').insertOne( data, function(err, result) {
            //assert.equal(err, null);
            console.log("Inserted a data in VISITS.");
            if ( typeof callback !== "function" ) {
                console.error('callback is not a function');
            } else {
                callback();
            }
        });
    };

    const findData = (db, callback, query) => {
        let cursor = db.collection('visits').find( query ),
            result = [];
        cursor.each(function(err, doc) {
            //assert.equal(err, null);
            if (doc != null) {
                console.dir(doc);
                result.push(doc);
                //result = Object.assign(result, doc);
            } else {
                console.log('END SEARCH');
                if ( typeof callback !== "function" ) {
                    console.error('callback is not a function');
                } else {
                    callback(result);
                }
            }
        });
    };

    const updateData = (db, callback, target, values) => {
        db.collection('visits').updateOne(
            target,
            {
                $set: values
            }, function(err, results) {
                console.log(results);
                if ( typeof callback !== "function" ) {
                    console.error('callback is not a function');
                } else {
                    callback();
                }
            });
    };

    const removeAllData = (db, callback, query) => {
        db.collection('visits').deleteMany(
            query,
            function(err, results) {
                console.log(results);
                if ( typeof callback !== "function" ) {
                    console.error('callback is not a function');
                } else {
                    callback();
                }
            }
        );
    };








    MongoClient.connect(url, function(err, db) {
        //assert.equal(null, err);
        let kurwa;

        insertData(db, false, {"name": "leo", "visits" : 0});
        removeAllData(db, false, {"name" : "leo"});
        findData(db, (result) => {
            doKurwa(result);
            db.close();
        } , {});


    });

    const doKurwa = (suka) => log(suka);


   MongoClient.connect(url, function(err, db) {
        //assert.equal(null, err);

       //updateData(db, () => db.close(), {"name" : "leo"}, {"visits" : "over9000"} );
    });


    MongoClient.connect(url, function(err, db) {
        //assert.equal(null, err);

        //removeAllData(db, () => db.close(), {"name" : "leo"});
        //findData(db, () => db.close(), {});
    });

    MongoClient.connect(url, function(err, db) {
        //assert.equal(null, err);
        //findData(db, () => db.close(), {});
    });




    bot.on('text', msg => {
        let messageChatId = msg.chat.id,
            messageText = msg.text,
            messageDate = msg.date,
            messageNick = msg.from.username,
            messageName = msg.from.first_name,
            messageSurname = msg.from.last_name;

        if (messageText.match(/\/hello/)) {

            /*MongoClient.connect(url, function(err, db) {
                //assert.equal(null, err);
                //insertData(db, () => db.close(), {"name": "leo", "visits" : 0});
            });*/


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

            let index = Math.round(Math.random() * photoData.length),
                photo = 'tempPhoto' + messageChatId + messageDate + '.jpg';

            request(photoData[index].url)
                .pipe(
                    fs.createWriteStream(photo)
                        .on('finish', function(){
                            bot
                                .sendPhoto( messageChatId, photo, {caption: photoData[index].name})
                                .then(()=>{
                                    fs.unlinkSync(photo);
                                });
                        })
                    );
        }

        console.log(msg);
    });

    function sendMessageByBot(aChatId, aMessage)
    {
        bot.sendMessage(aChatId, aMessage, { caption: 'I\'m a cute bot!' });
    }

    /*квестов? у них нет отдельных исходников, доставай qm-файлы из пакетника, открывай через ТГЕ*/

})();