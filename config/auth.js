module.exports = {
  //For Patient Section
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash(
      "error_msg",
      "Please log in to view that resource of patient panel"
    );
    res.redirect("/patient/login");
  },

  //For Doctor Section
  ensureAuthenticated1: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash(
      "error_msg",
      "Please log in to view that resource of doctor panel"
    );
    res.redirect("/doctor/Dlogin");
  },

  //For Admin Section
  ensureAuthenticatedadmin: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash(
      "error_msg",
      "Please log in to view that resource of admin panel"
    );
    res.redirect("/admin/login");
  },
};
