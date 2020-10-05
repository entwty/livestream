let mongoose = require("mongoose"),
 bcrypt = require('bcrypt-nodejs'),
 shortid = require('shortid'),
 Schema = mongoose.Schema;
 
 let UserSchema = new Schema(
  {
    userId: {
      type: String
    },
    username: {
      type: String,
      required: "Name is required!",
    },
    email: {
      type: String,
      required: "Email is required!",
    },
    password: {
      type: String,
      required: "Password is required!",
    },
    stream_link: {
      type: String
    },
    stream_key: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateStreamKey = () => {
  return shortid.generate();
};


module.exports = UserSchema;
