const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        date: {
            min: {type: Number,required:true},
            hour: {type: Number,required:true},
            day: {type: Number,required:true},
            month: {type: Number,required:true},
            year: {type: Number,required:true}
        }
    }
);

module.exports= mongoose.model('booking', bookingSchema);