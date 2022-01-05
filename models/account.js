const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const accountSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        password: {type: String, required: true},
        role: {type: Number, required: true, min: 0, max: 2},
        birthday: {type: Date, required: false}
    }
);

accountSchema.plugin(uniqueValidator);

module.exports= mongoose.model('account', accountSchema);