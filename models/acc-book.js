const mongoose = require('mongoose');

const accBookSchema = mongoose.Schema(
    {
        acc: {type: String, required: true},
        book: {type: String, required:true}
    }
);

module.exports= mongoose.model('acc-book', accBookSchema);