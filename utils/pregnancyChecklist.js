function generatePregnancyWeeks() {
  const weeks = [];
  for (let i = 1; i <= 42; i++) {
    let trimester =
      i <= 13 ? "First" : i <= 27 ? "Second" : "Third";

    let defaultTasks = [
      { task: "Take vitamins", status: "pending" },
      { task: "Maintain healthy diet", status: "pending" },
    ];

    // Add trimester-specific tasks
    if (i === 12) defaultTasks.push({ task: "First ultrasound", status: "pending" });
    if (i === 20) defaultTasks.push({ task: "Anomaly scan", status: "pending" });
    if (i === 28) defaultTasks.push({ task: "Glucose tolerance test", status: "pending" });

    weeks.push({
      week: i,
      trimester,
      checklist: defaultTasks,
    });
  }
  return weeks;
}

function getCurrentPregnancyWeek(pregnancyStartDate) {
  if (!pregnancyStartDate) return null;

  const today = new Date();
  const start = new Date(pregnancyStartDate);

  const diffInMs = today - start; // difference in ms
  const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7)) + 1;

  return diffInWeeks > 42 ? 42 : diffInWeeks; // cap at 42
}

module.exports = {
    generatePregnancyWeeks,
    getCurrentPregnancyWeek 
};
