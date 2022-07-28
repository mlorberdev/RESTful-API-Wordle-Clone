!(function(){
const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    // key: {
    //     required: true,
    //     type: String
    // },
    // key: {
    //     required: true,
    //     type: Number
    // }
});
module.exports = mongoose.model('Data', dataSchema);
})();