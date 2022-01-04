const mongoose = require('mongoose');

const piSchema = mongoose.Schema(
    {
        name:{type: String, required: true},
        x: {type: double, required: true},
        y: {type: double, required: true},
        desc_fr: {type: String, required: true},
        desc_en: {type: String, required: false},
        video: {type: String, required: false}
    }
);

module.exports= mongoose.model('pi', piSchema);