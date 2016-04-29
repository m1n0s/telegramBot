(function(){

    'use strict';

    const telegram = require('telegram-bot-api'),
          http = require('http'),
          request = require('request'),
          fetch = require('node-fetch'),
          fs = require('fs'),
          API500px = require('500px'),
          photos500 = new API500px('fxbA5gQpzkR3NskiYH8eJGjEm7zgWY4Qiu9KomVR'),
          MongoClient = require('mongodb').MongoClient,
          assert = require('assert'),
          emoji = require('node-emoji');;

    let photoData = [];

    photos500.photos.searchByTag('cat', {'sort': 'created_at', 'rpp': '50', 'image_size': '600'},  function(error, results) {
        if (error) {
            // Error!
            return;
        }
        results.photos.forEach(item => photoData.push({name: item.name, url: item.image_url}));
    });






    const bot = new telegram({
        token: '202042596:AAH70-eStPEor76bG3LQG0RY6lkElWBPIIc',
        updates: {
            enabled: true,
            get_interval: 200
        }
    });


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


/*


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
*/


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




    bot.on('message', msg => {
        let messageChatId = msg.chat.id,
            messageText = msg.text,
            messageDate = msg.date,
            messageNick = msg.from.username,
            messageName = msg.from.first_name,
            messageSurname = msg.from.last_name;

        if (messageText.match(/\/hello/)) {

            MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);

                findData(db, (result) => {

                    if (result.length) {
                        let visits = result[0].visits + 1

                        updateData(db, () => db.close(), {"chatId" : messageChatId}, {"visits" : visits});
                        sendMessageByBot(
                            messageChatId,
                            '`Hello ' + messageName + emoji.get('heart') + '!` This is your *' + visits + ordinalSuffixOf(visits) + '* _greeting_ to me!',
                            'Markdown'
                        );
                    } else {
                        insertData(db, () => db.close(), {"chatId" : messageChatId, "visits" : 1});
                        sendMessageByBot(messageChatId, 'Hello ' + messageName + '! This is your first greeting to me!');
                    }

                } , {"chatId": messageChatId});
            });


            //sendMessageByBot(messageChatId, 'Hello ' + messageName + '!');
        }

        if (messageText === '/fuckleo' || messageText === '/fuckleo@leoslave_bot') {
            sendMessageByBot(messageChatId, 'Oh! Leo is the best! So fuck you ' + messageName +' '+ messageSurname + '!');
        }

        if (messageText === '/love' || messageText === '/love@leoslave_bot') {
            sendMessageByBot(messageChatId, 'Leo love\'s Sofi very much! Everybody knows it!');
        }

        if (messageText === '/football' || messageText === '/football@leoslave_bot') {
            //sendMessageByBot(messageChatId, 'Dynamo Kyiv is the best of the best!');

            var inlineKeyboard = {
                    inline_keyboard: [
                        [{
                            text: 'Dynamo Kyiv ' + emoji.get('muscle'),
                            callback_data: 'fcdk'
                        }], [{
                            text: 'Shakhtar Donetsk ' + emoji.get('joy'),
                            callback_data: 'fcsd'
                        }]
                    ]
            };


            bot.sendMessage({
                chat_id: messageChatId,
                text: 'Who is the champion?',
                reply_markup: JSON.stringify(inlineKeyboard)
            })
            .then(function(message) {
                console.log(message);
            })
            .catch(function(err) {
                console.log(err);
            });
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
                                .sendPhoto({
                                    chat_id: messageChatId,
                                    caption: photoData[index].name,
                                    photo: photo
                                })
                                .then(()=>{
                                    fs.unlinkSync(photo);
                                });
                        })
                    );
        }


        api.on('inline.query', function(message)
        {
            // Received inline query
            console.log(message);
        });

        api.on('inline.result', function(message)
        {
            // Received chosen inline result
            console.log(message);
        });

        api.on('inline.callback.query', function(message)
        {
            // New incoming callback query
            console.log(message);
        });

        api.on('update', function(message)
        {
            // Generic update object
            // Subscribe on it in case if you want to handle all possible
            // event types in one callback
            console.log(message);
        });

        console.log(msg);
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



    function sendMessageByBot(aChatId, aMessage, aParseMode) {
        bot.sendMessage({
            chat_id: aChatId,
            text: aMessage,
            parse_mode: aParseMode
        });
    }

    function ordinalSuffixOf(i) {
        var j = i % 10,
            k = i % 100;
        if (j === 1 && k !== 11) {
            return 'st';
        }
        if (j === 2 && k !== 12) {
            return 'nd';
        }
        if (j === 3 && k !== 13) {
            return 'rd';
        }
        return 'th';
    }

    /*квестов? у них нет отдельных исходников, доставай qm-файлы из пакетника, открывай через ТГЕ*/

})();