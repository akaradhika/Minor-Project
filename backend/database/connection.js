const mongoose = require('mongoose')
const config = require('config')
const dbgr = require("debug")("development:mongoose")
require('dotenv').config();

exports.connectToDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/MANIT'; // Default to local MongoDB
        mongoose
            .connect(mongoURI)
            .then(function () {
                console.log("connected to the database")
            })
            .catch(function (err) {
                console.log(err)
            })

    } catch(err){
        console.log(err)
    }
}