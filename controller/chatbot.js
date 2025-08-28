const twilio = require("twilio");
const axios = require("axios");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Emergency contacts
const emergencyContacts = [
  "whatsapp:+918082230966", // Family member 1
  "whatsapp:+919873958109", // Family member 2
  "whatsapp:+918744924602", // Hospital
];

// Handle incoming WhatsApp messages
module.exports.handleIncomingMessage = async (req, res) => {
    const incomingMsg = req.body.Body.toLowerCase();
    const fromNumber = req.body.From; // User's WhatsApp number
    
    if (incomingMsg === "sos") {
      // Send SOS to all contacts
      for (let number of emergencyContacts) {
        await client.messages.create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: number,
          body: `Emergency Alert from ${fromNumber}! Immediate help is required.`,
        });
      }

      // Confirm back to user
      await client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: fromNumber,
        body: "SOS alert sent to your family and hospital.",
      });
    } 
    else if (incomingMsg.includes("week")) {
      const weekNum = incomingMsg.match(/\d+/)?.[0]; // Extract number
      if (weekNum) {
        try {
          // Fetch checklist from API
          const response = await axios.get(
            `http://localhost:5000/api/checklist/${weekNum}`
          );
          const checklist = response.data.message;

          // Format tasks as bullet points
          const tasksText = checklist.tasks
            .map((task, idx) => `${idx + 1}. ${task}`)
            .join("\n");
          await client.messages.create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: fromNumber,
            body: `Week ${checklist.week} Checklist:\n${tasksText}`,
          });
        } catch (error) {
          await client.messages.create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: fromNumber,
            body: "No checklist found for that week.",
          });
        }
      } else {
        await client.messages.create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: fromNumber,
          body: "Invalid input. Try 'week 1 checklist', 'week 2 checklist', etc.",
        });
      }
    }

    else {
      await client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: fromNumber,
        body:  `Hello! Welcome to *MotherLine*
        
You can choose one of the following options:
1️⃣ Type *week 1 checklist*, *week 2 checklist*, etc. – to get doctor’s weekly checklist.  
2️⃣ Type *SOS* – to immediately alert your family and hospital.  

Try sending: "week 1 checklist" or "SOS".`
      });
    }

    res.sendStatus(200); // Required for Twilio
};

