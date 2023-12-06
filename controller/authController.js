const userModel = require('../models/user.models')
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt')
// sign up
const signUp = async (req, res) => {

    const { name, email, password, confirmPassword } = req.body

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Every field is required'
        })
    }

    //    email check
    const validEmail = emailValidator.validate(email);

    if (!validEmail) {
        return res.status(400).json({
            success: false,
            message: 'please provide a valid email id'
        })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "password and confirm password doesn't match"
        })
    }

    try {

        const userInfo = userModel(req.body)
        const result = await userInfo.save();

        return res.status(200).json({
            success: true,
            data: result
        })

    } catch (e) {

        if (e.code === 11000) {

            return res.status(400).json({
                success: false,
                message: 'Account already exists with provided email id'
            })
        }
        return res.status(400).json({
            success: false,
            message: e.message
        })

    }

}


// sign in

const signin = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Every field is required'
        })
    }

    try {

        const user = await userModel.findOne({
            email
        }).select('+password');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'user not exist'
            })
        } else {
            if (!(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({
                    success: false,
                    message: 'Password invalid'
                })
            }
        }

        const token = user.jwtToken();
        user.password = undefined;

        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        }

        res.cookie("token", token, cookieOption);

        res.status(200).json({
            success: true,
            data: user
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error
        })

    }
}


// GET DATA

const  getUser = async(req, res)=>{

    const userId = req.user.id;

    try {
        const user = await userModel.findById(userId);
        return res.status(200).json({
            success: true,
            data: user
        })
  
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
        
    }
}


// logout

const logout = async (req, res)=>{

    try {
        
        const cookieOption = {
            expires: new Date(),
            httpOnly: true
        };

        res.cookie("token", null, cookieOption);
        res.status(200).json({
            success: true,
            message: 'Logged Out'
        })

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }

}


module.exports = {
    signUp, 
    signin,
    getUser,
    logout

}