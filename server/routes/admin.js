const express = require('express');
const { getUsers, getViewers, getStats } = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/users', auth, adminAuth, getUsers);
router.get('/viewers', auth, adminAuth, getViewers);
router.get('/stats', auth, adminAuth, getStats);

module.exports = router;