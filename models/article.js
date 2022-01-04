const mongoose = require('mongoose');

const articleSchema = mongoose.Schema(
    {
        titre: {type: String, required: true},
        desc: {type: String, required: true},
        prix: {type: decimal128, required: true}
    }
);

module.exports= mongoose.model('article', articleSchema);