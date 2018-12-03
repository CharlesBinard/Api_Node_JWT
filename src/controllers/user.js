import UserDb from '../models/user';

class User {
    load(req, res, next, id) {
        UserDb.findById(id)
            .exec()
            .then((user) => {
                if (!user) {
                    return res.status(404).json({
                        status: 400,
                        message: "User not found"
                    });
                }
                req.dbUser = user;
                return next();
            })
            .catch ((e) => next(e));
    }

    get(req, res) {
        return res.json(req.dbUser);
    }

    create(req, res, next) {
        console.log(req.body);
        UserDb.create({
            email: req.body.email,
            password: req.body.password
        })
        .then((savedUser) => {
            return res.json(savedUser);
        })
        .catch((e) => next(e));
    }

    update(req, res, next) {
        const user = req.dbUser;

        user.patch(req.body)
            .then(() => res.sendStatus(204))
            .catch((e) => next(e));
    }

    list(req, res, next) {
        const { limit = 50, skip = 0 } = req.query;
        UserDb.find()
            .skip(skip)
            .limit(limit)
            .exec()
            .then((users) => res.json(users))
            .catch((e) => next(e));
    }

    remove(req, res, next) {
        const user = req.dbUser;
        user.remove()
            .then(() => res.sendStatus(204))
            .catch((e) => next(e));
    }
}

export default new User;