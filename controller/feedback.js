const Feedback = require("../models/hospitalFeedback");

module.exports.index = (req, res) => {
    res.render("feedback/feedback.ejs");
}

module.exports.createFeedback = async (req, res) => {
  const {hospitalName, rating, comment} = req.body;
  console.log(hospitalName, rating, comment)
  const feedback = new Feedback({
    hospitalName, 
    rating,
    comment
  });
  await feedback.save();

  res.send("thankyou for giving feedback");
}

module.exports.viewGovDashboard = async (req, res) => {
  const feedbacks = await Feedback.find({});

  // Aggregate statistics
  const stats = await Feedback.aggregate([
    {
      $group: {
        _id: "$hospitalName",
        avgRating: { $avg: "$rating" },
        totalFeedbacks: { $sum: 1 }
      }
    }
  ]);

  res.render("feedback/view", { feedbacks, stats });
};
