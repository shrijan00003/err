const express = require('express');
const router = express.Router();

/**
 * @route GET api/posts/test
 * @description Test User Route
 * @access Public
 */
router.get('/test',(req,res)=>{
    res.json({
        msg : "Users works"
    })
})

module.exports = router;