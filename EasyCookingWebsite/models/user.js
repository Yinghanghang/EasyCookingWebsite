var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

const SALT_FACTOR = 10;

var userSchema = mongoose.Schema({  // data representation
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    like: {type: Array, required: false},
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", function (done) {  // hash password before saving
    var user = this;  

    if (!user.isModified("password")) {
        return done();  // don't need to encrypt
    }

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) { return done(err); } // get out of the method 
        bcrypt.hash(user.password, salt, function (err, hashedPassword) {
            if (err) { return done(err); }
            user.password = hashedPassword;
            done();
        });
    });

});

userSchema.methods.checkPassword = function (guess, done) {
    if (this.password != null) {
        bcrypt.compare(guess, this.password, function (err, isMatch) {
            done(err, isMatch); // compare password provided with hashed password in the database
        });
    }
}

var User = mongoose.model("User", userSchema);

module.exports = User;
