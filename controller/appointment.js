const Appointment = require("../models/appointment.js");
const User = require("../models/user.js");
const auditLog = require("../utils/auditLog.js");

module.exports.index = async (req, res) => {
    const userId = req.user.user._id;
    const appointment = await Appointment.find(userId.mother, userId.doctor, userId.caregiver)
        .populate("mother")
        .populate("doctor")
        .populate("caregiver")
        .populate("createdBy");
    res.render("appointment/index.ejs", {appointment});
}

module.exports.newAppointment = async (req, res) => {
    const mothers = await User.find({ role: "mother" });
    const doctors = await User.find({ role: "doctor" });
    const caregivers = await User.find({ role: "caregiver" });
    const bookingUsers = await User.find({});

    res.render("appointment/create.ejs", { mothers, doctors, caregivers, bookingUsers });
}

module.exports.create = async (req, res) => {
    const {doctor, mother, appointmentDate, reason, notes, createdBy} = req.body;
    const newAppointment = new Appointment({
       doctor, mother, appointmentDate, reason, notes, createdBy
    });
  
    await newAppointment.save();

    await auditLog(req.user.user._id, "appointments/created", { 
        id: newAppointment._id, 
        doctor, 
        mother, 
        appointmentDate 
    });
    res.redirect(`/appointments`);
}

module.exports.show = async (req, res) => {
    const { userId } = req.params;
    const appointment = await Appointment.find(userId)
        .populate("mother")
        .populate("doctor")
        .populate("caregiver")
        .populate("createdBy");
    
    res.render("appointment/show.ejs", { appointment });
}

module.exports.edit = async (req, res) => {
    const {userId} = req.params;
    const appointment = await Appointment.find(userId)
        .populate("mother")
        .populate("doctor")
        .populate("caregiver")
        .populate("createdBy");
    
    res.render("appointment/edit.ejs", { appointment });
}

module.exports.update = async (req, res) => {
    let { id } = req.params;
    console.log(req.body)
    Appointment.findByIdAndUpdate(id, {...req.body});
    
    await auditLog(req.user.user._id, "appointments/updated", { id });

    res.redirect(`/appointments/${id}/show`);
}
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);
    
    await auditLog(req.user.user._id, "appointments/deleted", { id });
    res.redirect(`/admin/appointments`);
}

