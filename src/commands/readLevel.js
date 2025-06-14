const { SlashCommandBuilder } = require("discord.js");
const getReading = require("../utils/getreading");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("read-level")
    .setDescription("Get a reading for your level")
    .addStringOption(option =>
      option
        .setName("level")
        .setDescription("Select your level")
        .setRequired(true)
        .addChoices(
          { name: "Beginner", value: "beginner" },
          { name: "Intermediate", value: "intermediate" },
          { name: "Advanced", value: "advanced" }
        )
    ),

  async execute(interaction) {
    const level = interaction.options.getString("level");
    const message = await getReading(level);
    await interaction.reply({ content: message });
  },
};
