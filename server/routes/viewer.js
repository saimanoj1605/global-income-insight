const express = require('express');
const { createViewer, getTotalLikes } = require('../controllers/viewerController');
const router = express.Router();

router.post('/', createViewer);
router.get('/likes', getTotalLikes);

module.exports = router;