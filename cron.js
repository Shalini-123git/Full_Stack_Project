const nodemailer = require("nodemailer");
const cron = require("node-cron");
const User = require("./models/user");
const BabyActivity = require("./models/babyActivity");

const sendMailAllUser = () => {

    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASSWORD, // app password
    },
    });

    // Cron job runs every 30 minutes
    cron.schedule("0 */4 * * *", async () => {
    console.log("Running caregiver reminder job...");

    try {
        const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
        const babies = await User.find({ role: "baby" });

        for (let baby of babies) {
        // Get latest feed log for this baby
        const lastFeed = await BabyActivity.findOne({
            baby: baby._id,
            activityType: "feed",
        }).sort({ createdAt: -1 }).populate("baby").populate("caregiver");

        if (!lastFeed || lastFeed.createdAt < fourHoursAgo) {
            console.log(`Baby ${baby.username} needs reminder`);

            if (lastFeed && lastFeed.caregiver) {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: lastFeed.caregiver.email,
                    subject: `Reminder: Baby ${baby.username} needs feeding`,
                    text: `Hello ${lastFeed.caregiver.username},\n\nBaby ${baby.username} has not been fed for over 4 hours.\nPlease take care.`,
                };

                await transporter.sendMail(mailOptions);
                console.log(`Reminder sent to ${lastFeed.caregiver.email}`);
                }
            } else {
                console.log(`Baby ${baby.username} has been fed recently.`);
            }
            }
        } catch (err) {
            console.error("Error in cron job:", err);
    }
    });
}
module.exports = {
    sendMailAllUser
}