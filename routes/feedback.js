const express = require("express");
const router = express.Router();

//call model
const Feedback = require("../models/feedback");

//authentication
const { ensureAuthenticated } = require("../config/auth");
const { ensureAuthenticatedadmin } = require("../config/auth");

//admin sees feedback
router.get("/seefeedbacks", ensureAuthenticatedadmin, async (req, res) => {
  const feedback = await Feedback.find({});
  const date = feedback.date;
  res.render("seefeedbacks", {
    user: req.user,
    feedback,
  });
});

//patient sends feedback
router.get("/sendfeedbacks", ensureAuthenticated, async (req, res) => {
  res.render("feedback", {
    user: req.user,
    pageTitle: "Feedback",
  });
});

// feedback form
router.post("/feedbackform", async (req, res) => {
  const { message } = req.body;
  let errors = [];

  if (!message) {
    errors.push({ msg: "Please fill in all fields" });
  }
  if (errors.length > 0) {
    res.render("feedback", {
      errors,
      user: req.user,
      message,
    });
  } else {
    const sender = new Feedback({ message });
    sender.tokennumber = req.user.tokennumber;
    sender.name = req.user.name;
    sender.message = req.body.message;
    sender.senderavatar = req.user.imageUrl;
    await sender.save();
    req.flash("success_msg", "Feedback Sent.Thank you for your feedbacks!");
    res.redirect("/sendfeedbacks");
  }
});

module.exports = router;
