import mongoose from 'mongoose';

const usersCollection = 'users';

const userSchema = new mongoose.Schema({

    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
    }
});

const userModel = mongoose.model(usersCollection, userSchema);

export default userModel;

