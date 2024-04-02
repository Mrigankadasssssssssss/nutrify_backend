
const mongoose = require('mongoose');

const trackingSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    food_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'foods',
        required:true
    },
    quantity:{
        type:Number,
        min:1,
        required:true
    },
    eatenDate:{
        type:Date,
        default: Date.now()
    }

},{timestamps:true})

const trackingModel = mongoose.model('trackings',trackingSchema)

module.exports =trackingModel