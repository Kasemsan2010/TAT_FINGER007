const express = require('express');
const router = new express.Router();
const C_CheckTimeInOut = require('../Contorllers/Contorllers.CheckTimeInOut');

router.get("/CheckTimeInOut", C_CheckTimeInOut.ChecktimeInOut);

module.exports = router;