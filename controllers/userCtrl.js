// Get user profile (for /profile route)
const getProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found' });
    }
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};
const userModel = require('../models/userModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(200).send({ message: 'User Already Exist', success: false })
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword
        // Only keep doctor fields if role is doctor
        if (req.body.role !== 'doctor') {
            delete req.body.specialization;
            delete req.body.experience;
        }
        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(201).send({ message: 'Register Successfully', success: true })

    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: `Register Controller ${error.message}` })
    }
}

//login handler
const loginController = async(req,res) => {
    try{
        const user=await userModel.findOne({email:req.body.email})
        if(!user){
            return res.status(200).send({message:'user not found', success:false})
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if(!isMatch){
            return res.status(200).send({message:'Invalid email or password', success:false})
        }
        // Include role in JWT
        const token = jwt.sign({id:user._id, role:user.role},process.env.JWT_SECRET,{expiresIn: '1d'})
        res.status(200).send({
            message:'Login Success',
            success:true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    }catch(error){
        console.log(error)
        res.status(500).send({message:`Error in Login CTRL ${error.message}`})
    }
}

const authController = async(req,res) =>{
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        if(!user){
            return res.status(200).send({
                message:'user not found',
                success:false
            })
        }else{
            // Return the entire user object (without the password) for easier state management
            res.status(200).send({ success:true, data: user });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:'auth error',
            success:false,
            error
        })
    }
}


module.exports = { loginController, registerController, authController, getProfileController }