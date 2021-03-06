const connection = require('../app');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(newUser.password, salt, (error, hash) => {
            if(error){
                callback(error);
            } else{
                newUser.password = hash;
                const queryString = `INSERT INTO User (username, password, name) VALUES ("${newUser.username}", "${newUser.password}", "${newUser.name}")`;
                connection.query(queryString, (error, rows, fields) => {
                    if(error){
                        callback(error);
                    } else{
                        callback(rows);
                    }
                });
            }
        });
    });
}

module.exports.getUserByUsername = function(username, callback){
    const queryString = `SELECT * FROM User WHERE username="${username}"`;
    connection.query(queryString, (error, rows, fields) => {
        if(error){
            callback(error);
        } else{
            callback(rows);
        }
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err){
            return err;
        } else{
            callback(null, isMatch);
        }
    });
}

module.exports.deleteUser = function(username, callback){
    const queryString = `DELETE FROM User WHERE username="${username}"`;
    connection.query(queryString, (error, rows, fields) => {
        if(!error){
            callback(rows);
        } else{
            return error;
        }
    });
}