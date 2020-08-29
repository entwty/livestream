let mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    shortid = require('shortid'),
    Schema = mongoose.Schema;

let UserSchema = new Schema({
    userId:String,
    username: String,
    email : String,
    password: String,
    role : Role,
    stream_link:String,
    stream_key : String,
});
let Role = new Schema({
    roleId : String,
    roleName:String,
    userId:String,
});
let ChatLobby = new Schema({
    
});

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