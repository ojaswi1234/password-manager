const mongoose = require('mongoose');

const accountsSchema = new mongoose.Schema({

    platform: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Accounts', accountsSchema);