const mongoose = require('ws-chat/chat/tools/mongoose');
const config = require('../config');
mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

module.exports = mongoose;
