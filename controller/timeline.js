const Timeline = require("../models/timeline.js");
const { GoogleGenAI } = require("@google/genai");
const { generatePregnancyWeeks, getCurrentPregnancyWeek } = require("../utils/pregnancyChecklist.js");
const generatePdfFromRoute = require("../utils/pdfGenerator.js");

module.exports.create = (req, res) => {
    res.render("timeline/create.ejs");
}

module.exports.newTimeline = async (req, res) => {
    const { pregnancyStartDate } = req.body;
    // Calculate due date (280 days after start date)
    const dueDate = new Date(pregnancyStartDate);
    dueDate.setDate(dueDate.getDate() + 280);
    const timeline = new Timeline({
        userId: req.user.user._id,
        pregnancyStartDate,
        dueDate,
        weeks: generatePregnancyWeeks(),   // <-- auto-fill weeks
    });
    console.log(timeline)
    await timeline.save();

    res.redirect("/timeline");
}

module.exports.index = async (req, res) => {
    const timelines = await Timeline.find({ userId: req.user.user._id });
    
    if (!timelines) {
      return res.redirect("/timeline/create");
    }

    res.render("timeline/index.ejs", {timelines});
}

//Print
module.exports.printView = async (req, res) => {
    const timeline = await Timeline.findOne({ userId: req.user.user._id });

    if (!timeline) {
      return res.status(404).json({ message: "Timeline not found" });
    }
    getCurrentPregnancyWeek(timeline.pregnancyStartDate);

    res.render("timeline/timeline", {timeline});
}

module.exports.generatePdf = async (req, res) => {
    const url = `${req.protocol}://${req.get("host")}/timeline/printView`;
    const fileName = `Timeline.pdf`;

    await generatePdfFromRoute(url, fileName, req, res);
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const timeline = await Timeline.findById(id);
    res.render("timeline/edit", { timeline });
}
module.exports.update = async (req, res) => {
    
    const { id } = req.params;
    const pregnancyStartDate = req.body.pregnancyStartDate;
    const dueDate = new Date(pregnancyStartDate);
    dueDate.setDate(dueDate.getDate() + 280)
    const updatedTimeline = await Timeline.findByIdAndUpdate(
        id,
        {
            pregnancyStartDate,
            dueDate
        }
    );
    if (!updatedTimeline) {
        return res.status(404).send("Timeline not found");
    }
    res.redirect("/timeline");
    
}

module.exports.delete = async (req, res) => {
    await Timeline.findByIdAndDelete(req.params.id);
    res.redirect("/timeline");
    
}

module.exports.getEvent = async (req, res) => {
    const { id }= req.params;
    const timeline = await Timeline.findById(id);
    if (!timeline) {
        return res.status(404).json({ message: "Timeline not found" });
    }

    res.render("timeline/createEvent.ejs", { timeline });
}

module.exports.createEvent = async (req, res) => {
   
    const { title, description, eventDate } = req.body;
    console.log("title", title, description, eventDate)
    if (!title || !eventDate) {
        return res.status(400).json({ message: "Title and eventdate are required" });
    }

    const timelines = await Timeline.find({_id: req.params.id});
    if (!timelines) {
        return res.status(404).json({ message: "Timeline not found" });
    }

    const timeline = timelines[0];

    timeline.events.push({
        title,
        description,
        eventDate
    });
    
    await timeline.save();
    res.redirect("/timeline");
}

module.exports.showEvent = async (req, res) => {
    const { id } = req.params;
    const timeline = await Timeline.findById(id);
    if (!timeline) {
        return res.status(404).send("Timeline not found");
    }
    res.render("timeline/viewTimeline.ejs", { timeline });
};

module.exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    const timeline = await Timeline.findById(id);

    const eventId = timeline.events[0]._id.toString();

    timeline.events.id(eventId).deleteOne();
    await timeline.save();
    res.redirect(`/timeline`);
}

module.exports.aiResponse = async (req, res) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

    const { prompt } = req.body;
    const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    });
    console.log(response.text)
    res.render("includes/aiResponse.ejs", {response});
}