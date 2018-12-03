import nconf from 'nconf';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export const authenticate = (req,res,next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
      jwt.verify(token, nconf.get('jwt:secret'), (err, decoded) => {
          if (err) {
              return res.json({
                  error: ['Bad Token']
              });
          }
          User.findOne({token: token})
          .then(user => {
              req.user = user;
              req.decoded = decoded;
              next();
          })
          .catch(err => {
            if (err) {
              return res.json({
                  error: ['Bad Token or token expired']
              });
            }
          })
      });
  }
  else {
      return res.status(403).send({
          error: ['Token is required, use \'/user\' in post for create user and get your token']
      });
  }
};

