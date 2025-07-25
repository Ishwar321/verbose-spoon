const { strikethrough } = require('colors')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is require']
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient',
        required: true
    },
    specialization: {
        type: String,
        required: function() { return this.role === 'doctor'; },
    },
    experience: {
        type: Number,
        required: function() { return this.role === 'doctor'; },
    }
})

const userModel = mongoose.model('users',userSchema)

module.exports=userModel