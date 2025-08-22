const Timeline = require("../models/timeline.js");
const { GoogleGenAI } = require("@google/genai");

module.exports.create = (req, res) => {
    res.render("timeline/create.ejs");
}

module.exports.newTimeline = async (req, res) => {
    const { pregnancyStartDate } = req.body;

    if(!pregnancyStartDate) {
        return res.status(400).json({message: "Pregnancy start date is required"})
    }
         
    // Calculate due date (280 days after start date)
    const dueDate = new Date(pregnancyStartDate);
    dueDate.setDate(dueDate.getDate() + 280);

    // Create timeline in DB
    const newTimeline = new Timeline({
        userId: req.user.user._id, // comes from JWT middleware
        pregnancyStartDate,
        dueDate,
        
    });

    await newTimeline.save();

    res.redirect("/timeline");
}

module.exports.index = async (req, res) => {
    const userId = req.user.user._id;
    const timelines = await Timeline.find({userId}).populate("userId");

    if(timelines.length == 0) {
        return res.redirect("/timeline/create");
    }
    res.render("timeline/index.ejs", { timelines });
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
    if (!title || !eventDate) {
        return res.status(400).json({ message: "Title and eventdate are required" });
    }

    const timeline = await Timeline.findOne({_id: req.params.id});
    if (!timeline) {
        return res.status(404).json({ message: "Timeline not found" });
    }

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