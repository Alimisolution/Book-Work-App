import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protectedRoute = async(req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {

            // get token
            token = req.headers.authorization.split(' ')[1];

            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);


            // find user
            req.user = await User.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            return res.status(401).json({message: 'Not authorized, token failed'})
        }
    }else{
        return res.status(401).json({message: 'Not authorized, no token was provided'})

    }
}


export default protectedRoute;