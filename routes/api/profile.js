const express = require('express');
const router = express.Router();


/**
 * @route GET api/posts/test
 * @description Test profile Route
 * @access Public
 */
router.get('/test', (req, res) => {
    res.json({
        msg: "Profile works"
    })
})

module.exports = router;