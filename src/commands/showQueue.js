const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../utils/queueManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Muestra los usuarios en la cola de lectura del canal de voz en el que estás"),

  async execute(interaction) {
    const member = interaction.member;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        content: "❌ Debes estar en un canal de voz para ver la cola.",
        ephemeral: true,
      });
    }

    const queue = getQueue(interaction.guild.id, voiceChannel.id);

    if (queue.length === 0) {
      return interaction.reply("📭 La cola está vacía en este canal de voz.");
    }

    const list = queue.map((user, index) => `${index + 1}. <@${user.id}>`).join("\n");

    return interaction.reply(`📚 **Cola en ${voiceChannel.name}:**\n${list}`);
  },
};
