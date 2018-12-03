import jwt from 'jsonwebtoken';
import nconf from 'nconf';
import User from '../models/user';

class Auth {

    authenticate(req, res, next) {
        if (!req.body.email || !req.body.password) 
            return res.send({ success: false, message: 'Please enter email and password.' });

        User.findOne({
            email: req.body.email
        })
        .exec()
        .then((user) => {
            if (!user) 
                return next();
            user.comparePassword( req.body.password, (err, isMatch) => {
                if (err) 
                    return next(err);
                if (isMatch) {
                    req.user = user;
                    next();
                } else {
                    return next();
                }
            });
        })
        .catch((e) => next(e))
    }
    
    generateToken(req, res, next) {
        if (!req.user) 
            return next();
      
        const jwtPayload = {
            id: req.user._id
        };

        const jwtData = {
            expiresIn: nconf.get('jwt:duration'),
        };

        const secret = nconf.get('jwt:secret');
        req.token = jwt.sign(jwtPayload, secret, jwtData);

        req.user.token = req.token;
        req.user.save((err) => {
            if(err)
                next(err);
            next();
        })
    }

    respondJWT(req, res) {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized'
            });
          
        } else {
            res.status(200).json({
                jwt: req.user.token
            });
        }
      }
}

export default new Auth;