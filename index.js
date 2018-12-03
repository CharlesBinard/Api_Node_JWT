const nconf    = require('nconf');
const mongoose = require('mongoose');

nconf
    .argv()
    .file({ file: __dirname + '/config.json' });

const urlMongo = `mongodb://${nconf.get('mongo:url')}:${nconf.get('mongo:port')}/${nconf.get('mongo:dataBase')}`;
mongoose.connect(urlMongo, { 
    useNewUrlParser: true,
    useCreateIndex: true
});

require('./src/server');
