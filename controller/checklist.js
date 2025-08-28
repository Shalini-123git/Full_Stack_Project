const Checklist = require("../models/checklist");

module.exports.getWeekChecklist = async (req, res) => {
    const weekNum = parseInt(req.params.week);
    const checklist = await Checklist.findOne({ week: weekNum });

    if (!checklist) {
      return res.status(404).json({ error: "Checklist not found" });
    }

    res.status(200).json({message: checklist});
}

module.exports.addChecklist = async (req, res) => {
    const { week, tasks } = req.body;
    const newChecklist = new Checklist({ week, tasks });

    await newChecklist.save();
    res.status(201).json(newChecklist);
}