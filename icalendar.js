let activityCount = 1;

function addActivity() {
  activityCount++;
  const activities = document.getElementById("activities");
  const newActivity = document.createElement("div");
  newActivity.innerHTML = `
    <label for="activity${activityCount}">Activity ${activityCount}:</label>
    <input type="text" id="activity${activityCount}" required>
    <label for="duration${activityCount}">Duration (minutes):</label>
    <input type="number" id="duration${activityCount}" required>
  `;
  newActivity.classList.add("activity");
  activities.appendChild(document.createElement("br"));
  activities.appendChild(newActivity);
}

document.getElementById("form").addEventListener("submit", function(event) {
  event.preventDefault();
  const startTime = document.getElementById("startTime").value;
  let icalendar = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//hacksw/handcal//NONSGML v1.0//EN\r\n";
  const date = new Date();
  let currentTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startTime.substring(0, 2), startTime.substring(3, 5));
  for (let i = 1; i <= activityCount; i++) {
    const activity = document.getElementById(`activity${i}`).value;
    const duration = document.getElementById(`duration${i}`).value;
    icalendar += "BEGIN:VEVENT\r\n";
    icalendar += `DTSTAMP:${formatDateTime(currentTime)}\r\n`;
    icalendar += `UID:${formatDateTime(currentTime)}-${activity}\r\n`;
    icalendar += `DTSTART:${formatDateTime(currentTime)}\r\n`;
    currentTime.setMinutes(currentTime.getMinutes() + Number(duration));
    icalendar += `DTEND:${formatDateTime(currentTime)}\r\n`;
    icalendar += `SUMMARY:${activity}\r\n`;
    icalendar += "END:VEVENT\r\n";
    currentTime.setMinutes(currentTime.getMinutes() + 5);
  }
  icalendar += "END:VCALENDAR";
  const blob = new Blob([icalendar], {type: "text/calendar;charset=utf-8"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "calendar.ics";
  link.click();
});

function formatDateTime(date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}