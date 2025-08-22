const BabyActivity = require("../models/babyActivity.js");
const User = require("../models/user.js");
module.exports.index = async (req, res) => {
  const activities = await BabyActivity.find()
    .populate("baby")
    .populate("caregiver")
    .sort({ createdAt: -1 });

    res.render("babyActivity/index.ejs", { activities });
}

module.exports.newActivity = async (req, res) => {
  const babies = await User.find({role: "baby"});
  const caregivers = await User.find({ role: "caregiver" });
  res.render("babyActivity/create.ejs", {babies, caregivers});
}

// Create a new activity
module.exports.createActivity = async (req, res) => {
  const activity = new BabyActivity(req.body);
    await activity.save();
    res.redirect("/activities");
};

// Get all activities for a baby
module.exports.show = async (req, res) => {
  const { id } = req.params;
  const activities = await BabyActivity.findById(id).populate("baby").populate("caregiver");
  console.log(activities.baby.username, activities.caregiver.username);
  res.render("babyActivity/show.ejs", {activities});
};

// Get single activity
module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const activity = await BabyActivity.findById(id)
    .populate("baby", "name dob")
    .populate("caregiver", "name role");

    if (!activity) {
      return res.status(404).json({ success: false, message: "Activity not found" });
    }

    res.render("babyActivity/edit.ejs", {activity});
};

// Update activity
module.exports.updateActivity = async (req, res) => {
  const { id } = req.params;
  const activity = await BabyActivity.findByIdAndUpdate(id, req.body, { new: true });

  if (!activity) {
    return res.status(404).json({ success: false, message: "Activity not found" });
  }

  res.redirect("/activities");
};

// Delete activity
module.exports.deleteActivity = async (req, res) => {
  const { id } = req.params;
  const activity = await BabyActivity.findByIdAndDelete(id);

  if (!activity) {
    return res.status(404).json({ success: false, message: "Activity not found" });
  }

  res.redirect("/activities");
};
