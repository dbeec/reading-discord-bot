const axios = require("axios");
const csv = require("csvtojson");

const SHEET_URLS = {
  es: {
    principiante: process.env.SHEET_ES_PRINCIPIANTE,
    intermedio: process.env.SHEET_ES_INTERMEDIO,
    avanzado: process.env.SHEET_ES_AVANZADO,
  },
  en: {
    beginner: process.env.SHEET_EN_BEGINNER,
    intermediate: process.env.SHEET_EN_INTERMEDIATE,
    advanced: process.env.SHEET_EN_ADVANCED,
  },
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Ahora recibe el usuario como parámetro
async function getReading(lang, level, user) {
  const url = SHEET_URLS[lang]?.[level];
  if (!url) return "❌ No se encontró URL para ese idioma o nivel.";

  try {
    const response = await axios.get(url);
    const data = response.data;
    const readings = await csv().fromString(data);

    if (!readings.length) return "❌ No se encontraron lecturas.";

    const random = readings[Math.floor(Math.random() * readings.length)];

    return (
      `👤 **Lectura por:** <@${user.id}>\n\n` +
      `🧠 Nivel: ${capitalize(random.level)}\n\n` +
      `${random.text}`
    );
  } catch (error) {
    console.error("❌ Error al obtener la lectura:", error);
    return "❌ Hubo un error cargando la lectura.";
  }
}

module.exports = getReading;
