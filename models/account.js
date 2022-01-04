const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const accountSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        password: {type: String, required: true},
        role: {type: Int32, required: true},
        birthday: {type: Date, required: false}
    }
);

accountSchema.plugin(uniqueValidator);

module.exports= mongoose.model('account', accountSchema);