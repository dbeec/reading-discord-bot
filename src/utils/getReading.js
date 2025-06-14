const axios = require("axios");
const csv = require("csvtojson");

const SHEET_URLS = {
  beginner: process.env.SHEET_BEGINNER,
  intermediate: process.env.SHEET_INTERMEDIATE,
  advanced: process.env.SHEET_ADVANCED,
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function getReading(level) {
  const url = SHEET_URLS[level];
  if (!url) return "❌ No URL for that level.";

  try {
    const response = await axios.get(url);
    const data = response.data;
    const readings = await csv().fromString(data);

    if (!readings.length) return "❌ No readings found.";

    const random = readings[Math.floor(Math.random() * readings.length)];

    return (
      `📖 **${capitalize(random.title)}**\n` +
      `🧠 Level: ${capitalize(random.level)}\n\n` +
      `${random.text}`
    );
  } catch (error) {
    console.error("❌ Error fetching reading:", error);
    return "❌ Error loading reading.";
  }
}

module.exports = getReading;
