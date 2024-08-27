import mongoose from "mongoose";

let connection = null;

const connectDB = async () => {
    try {

        if (connection) {
            return connection;
        }

        connection = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log('Database Connected');
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB