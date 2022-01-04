const mongoose = require('mongoose');

const accBookSchema = mongoose.Schema(
    {
        account: {type: String, required: true},
        booking: {type: String, required:true}
    }
);

module.exports= mongoose.model('acc-book', accBookSchema);