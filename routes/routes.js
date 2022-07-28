!(function() {
require('mongoose');
const express = require('express');
const router = express();
const Model = require('../models/model');
module.exports = router;

// ENDPOINTS
// router.post('/post', async (req, res) => { 
//     const data = new Model({
//         key: req.body.name,
//         value: req.body.age
//     });
//     try {
//         const dataToSave = await data.save();
//         res.status(200).json(dataToSave);
//     } catch(err) {
//         res.status(400).json({message: err.message});
//     }
// });
// router.get('/getAll', async (req, res) => { 
//     try {
//         const data = await Model.find();
//         res.json(data);
//     } catch(err) {
//         res.status(500).json({message: err.message});
//     } 
// });
// router.get('/getOne/:id', async (req, res) => { 
//     try {
//         const data = await Model.findById(req.params.id);
//         res.json(data);
//     } catch(err) {
//         res.status(500).json({message: err.message});
//     }
// });
router.get('/getRandom', async (req, res) => { 
    try {
        const data = await Model.aggregate([{
            $sample: { size:1 }
        }]);
        res.json(data);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});
// router.patch('/update/:id', async (req, res) => { 
//     try {
//         const id = req.params.id;
//         const updatedData = req.body;
//         const options = { new: true };
//         const result = await Model.findByIdAndUpdate(id, updatedData, options);
//         res.send(result);
//     } catch(err) {
//         res.status(400).json({message: err.message});
//     }
// });
// router.delete('/delete/:id', async (req, res) => { 
//     try {
//         const id = req.params.id;
//         const data = await Model.findByIdAndDelete(id);
//         res.send(`success deleting record with name "${data.name}"`);
//     } catch(err) {
//         res.status(400).json({message: err.message});
//     }
// });
})();
