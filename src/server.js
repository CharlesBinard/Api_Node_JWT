import express    from 'express';
import bodyParser from 'body-parser';
import morgan     from 'morgan';
import jwt        from 'jsonwebtoken';
import nconf      from 'nconf';

import routes from './routes';

const app = express();

app.set('Secret', nconf.get('jwt:secret'));

app.use(morgan('dev'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

app.listen(nconf.get('host'), () => {
    console.log(' -> API running on port  <-', nconf.get('host'));
})