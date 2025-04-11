const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    arts:{
        type: [Buffer],
        default:[]
    },
    collaborations: {
    type: [{
        collaboratorId: String,
        collaboratorName: String,
        collaboratorGoal: String,
        collaboratorMessage: String,
        collaboratorStatus:Boolean
    }],
    default: []
},
});

module.exports= mongoose.model('User', userSchema);

