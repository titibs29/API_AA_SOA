const mongoose = require('mongoose');

const articleSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        desc: {type: String, required: true},
        prix: {type: mongoose.Types.Decimal128, min: 0, default: 4.99}
    }
);

module.exports= mongoose.model('article', articleSchema);