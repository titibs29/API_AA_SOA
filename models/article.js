const mongoose = require('mongoose');

const articleSchema = mongoose.Schema(
    {
        titre: {type: String, required: true},
        desc: {type: String, required: true},
        prix: {type: mongoose.Types.Decimal128, required: true}
    }
);

module.exports= mongoose.model('article', articleSchema);