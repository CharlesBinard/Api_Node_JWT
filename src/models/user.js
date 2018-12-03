// Connection
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const schema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Client', 'Admin'],
        default: 'Client'
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    token: {
        type: String,
        default: false
    }
}, {
    timestamps: true
});

// Enregistrement de l'utilisateur (toujours hasher les mots de passe en production)
schema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                this.password = hash;
                next();
            });
        });
    }
    else {
        return next();
    }
});

schema.methods.patch = function (hash) {
    if ('email' in hash) {this.email = hash.email;}
    if ('role' in hash) {this.role = hash.role;}
    if ('password' in hash) {this.password = hash.password;}
    if ('token' in hash) {this.token = hash.token;}
    if ('firstname' in hash) {this.firstname = hash.firstname;}
    if ('lastname' in hash) {this.lastname = hash.lastname;}
};

schema.methods.override = function (hash) {
    this.email = hash.email;
    this.role = hash.role;
    this.password = hash.password;
    this.token = hash.token;
    this.firstname = hash.firstname;
    this.lastname = hash.lastname;
    this.description = hash.description;
    this.salaryClaims = hash.salaryClaims;
};


schema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', schema);
