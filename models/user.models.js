
const mongoose = require('mongoose')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt');


const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'User name is require'],
        minLength: [5, 'Name must be at least 5 characters'],
        maxLength: [50, 'Name must be less then 50 characters'],
        trim : true
    },

    email: {
        type: String,
        unique: true,
        lowercase: true,
        unique: [true, 'already registered'],
        required: [true, 'email  is require'],
        
    },

    password:{
        type: String,
        required: [true, 'password is require'],
    },

    forgotPasswordToken:{
        type: String,
    },

    forgotPasswordExpiryDate:{
        type: Date,
    },
    password:{
        type: String,
    },
});

userSchema.pre('save', async function(next){

    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods = {
    jwtToken(){
        return JWT.sign(
            {
                id: this._id, email: this.email
            },
            process.env.SECRET,
            {expiresIn: '24h'}
        )
    }
}

const userModel  = mongoose.model('user', userSchema)
module.exports = userModel;