const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        date: { type: Date, required: true}
    }
);

module.exports= mongoose.model('booking', bookingSchema);