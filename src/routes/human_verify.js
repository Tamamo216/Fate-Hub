const express = require("express");
const router = express.Router();

router.get("/", (req,res,next) => {
  try {
    res.render("human_verify");
  }
  catch(err) {
    next(err);
  }
});
router.post("/", async (req,res,next) => {
  const SECRET_KEY = "0x4AAAAAAAEfa_YusE0L4QOu0Oeb41bCzlI";
  const token = req.body.token;
  try {
    const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: 'POST',
      headers: {"Content-type" : "application/json"},
      body: JSON.stringify({secret: SECRET_KEY, response: token})
    });
    const outcome = await result.json();
    if (outcome.success)
      res.status(200)
      .cookie("human-verify", "true", {expires: 0})
      .json({msg: "You passed the human verification test"});
    else
      res.status(400).json({msg: "You failed to pass the human verification test"});
  }
  catch(err) {
    next(err);
  } 
});

module.exports = router;