const mongoose = require('mongoose');

const accountsSchema = new mongoose.Schema({

    platform: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Accounts', accountsSchema);