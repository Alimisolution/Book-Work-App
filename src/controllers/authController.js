import User from "../models/userModel.js";
import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '10d'})
}

const registerUser = async (req,res) => {
   const {username, email, password} = req.body;

   try {

    if(!username || !email || !password){
        return res.status(400).json({message: 'All fields are required'});
    }   

    if(password.length < 6){
        return res.status(400).json({message: 'password should be at least 6 characters long'});
    }
    
    if(username.length < 3){
        return res.status(400).json({message: 'username should be at least 3 characters long'});
    }
    
    // check if user already exists

       const existingUsername = await User.findOne({username});
    if(existingUsername){
        return res.status(400).json({message: 'Username already exists'});
    }

    const existingEmail = await User.findOne({email});
    if(existingEmail){
        return res.status(400).json({message: 'Email already exists'});
    }
    
    // get random avatar
    const profileImage = `https://api.dicebear.com/9.x/adventurer/svg?seed=${username}`;

    const user = await User.create({username, email, password, profileImage});
    const token = generateToken(user._id)
    
    res.status(201).json({
        message: 'success',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage
        }
    })
    
} catch (error) {
    console.log('Error while registering user', error)
    return res.status(500).json({message: 'Internal server error'});
   }
};



const loginUser = async (req,res) => {
    const {email, password} = req.body;

    try {
         if(!email || !password){
        return res.status(400).json({message: 'Input email and password to login'});
         }

         // check if user exist
         const user = await User.findOne({email});
         if(!user) {
            return res.status(400).json({message: 'Invalid email or password'});
         }

         //check if password is correct
         const isPasswordCorrect = await user.comparePassword(password);
         if(!isPasswordCorrect) {
            return res.status(400).json({message: 'Invalid email or password'});
         }
         
         const token = generateToken(user._id);
         return res.status(200).json({
            message: 'success',
            token,
              user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage
        }
        });

    } catch (error) {
          console.log('Error while login user', error)
        return res.status(500).json({message: 'Internal server error'});
    }
};


export {registerUser, loginUser}