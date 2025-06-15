// commands/leaveQueue.js

const { SlashCommandBuilder } = require("discord.js");
const { leaveQueue } = require("../utils/queueManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Sal de la cola de lectura"),

  async execute(interaction) {
    const removed = leaveQueue(interaction.user);
    if (removed) {
      await interaction.reply(
        `🚪 Saliste de la cola de lectura, ${interaction.user.username}.`
      );
    } else {
      await interaction.reply({
        content: "⚠️ No estabas en la cola.",
        ephemeral: true,
      });
    }
  },
};
