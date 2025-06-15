const { SlashCommandBuilder } = require("discord.js");
const { addToQueue, getQueue } = require("../utils/queueManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Únete a la cola de lectura del canal de voz en el que estás"),

  async execute(interaction) {
    const member = interaction.member;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        content: "❌ Debes estar en un canal de voz para unirte a la cola.",
        ephemeral: true,
      });
    }

    const added = addToQueue(interaction.guild.id, voiceChannel.id, member.user);
    const queue = getQueue(interaction.guild.id, voiceChannel.id);

    if (added) {
      await interaction.reply(`✅ Te uniste a la cola en **${voiceChannel.name}**. Hay ${queue.length} en total.`);
    } else {
      await interaction.reply({
        content: "⚠️ Ya estás en la cola.",
        ephemeral: true,
      });
    }
  },
};