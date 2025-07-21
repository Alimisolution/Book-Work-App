import mongoose from 'mongoose';

const connectDB = async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log(`DATABASE CONNECTED ${connect.connection.host}`)
    } catch (error) {
        console.log('Error connecting to database', error)
        process.exit(1) // exit with failure
    }
}

export default connectDB;