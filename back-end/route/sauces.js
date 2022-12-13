const express = require('express');
const router = express.Router();
const auth = require('../middlewears/auth')
const multer = require('../middlewears/multer-config');



const saucesCtrl = require('../controllers/sauces')


router.post('/', auth, multer, saucesCtrl.createSauces);
router.get('/', auth, saucesCtrl.getAllSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);




module.exports = router;
