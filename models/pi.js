const mongoose = require('mongoose');

const piSchema = mongoose.Schema(
    {
        name:{type: String, required: true},
        x: {type: mongoose.Types.Decimal128, required: true},
        y: {type: mongoose.Types.Decimal128, required: true},
        desc_fr: {type: String, required: true},
        desc_en: {type: String, required: false},
        video: {type: String, required: false},
        artisan: {type: String, required: false}
    }
);

module.exports= mongoose.model('pi', piSchema);