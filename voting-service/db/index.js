const mongoose = require('mongoose');

mongoose
    .connect('mongodb://127.0.0.1:27017/c09', { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db
