const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        date: {
            min: {type: Int32Array,required:true},
            hour: {type: Int32Array,required:true},
            day: {type: Int32Array,required:true},
            month: {type: Int32Array,required:true},
            year: {type: Int32Array,required:true}
        }
    }
);

module.exports= mongoose.model('booking', bookingSchema);