const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("read")
    .setDescription("Get a reading for your level"),

  async execute(interaction) {
    const langRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("lang_en")
        .setLabel("English 🇺🇸")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("lang_es")
        .setLabel("Español 🇪🇸")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: "Select a language to get started:",
      components: [langRow]
    });
  },
};
