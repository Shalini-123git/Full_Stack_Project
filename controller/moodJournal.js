const MoodJournal = require("../models/moodJournal");

// Create Entry
module.exports.createEntry = async (req, res) => {
  try {
    const { moodEmoji, stressLevel, energyLevel, gratitudeNote, stressNote, freeThoughts, cbtResponse, scheduledMessage } = req.body;

    // Create a new entry
    const newJournal = new MoodJournal({
      user: req.user.user._id, // assumes user is logged in
      moodEmoji,
      stressLevel,
      energyLevel,
      gratitudeNote,
      stressNote,
      freeThoughts,
      cbtResponse,
      scheduledMessage,
    });

    await newJournal.save();
    console.log("Mood Journal saved:", newJournal);

    res.json({message: "Mood journal is created succesfully", newJournal});
  } catch (err) {
    console.error("Error creating mood journal:", err);
    res.status(500).send("Error saving mood journal");
  }
};

// Get All Entries
module.exports.getEntries = async (req, res) => {
  try {
    const entries = await MoodJournal.find({}).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Entry
module.exports.deleteEntry = async (req, res) => {
  try {
    await MoodJournal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Mood journal entry deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
