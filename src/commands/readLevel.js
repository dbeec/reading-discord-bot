const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { isInQueue } = require("../utils/queueManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("read")
    .setDescription("Get a reading for your level"),

  async execute(interaction) {
    const member = interaction.member;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        content:
          "❌ Debes estar en un canal de voz para solicitar una lectura.",
        ephemeral: true,
      });
    }

    const inQueue = isInQueue(
      interaction.guild.id,
      voiceChannel.id,
      member.user.id
    );

    if (!inQueue) {
      return interaction.reply({
        content:
          "❌ Debes unirte a la cola con `/join` antes de solicitar una lectura.",
        ephemeral: true,
      });
    }

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
      content: "✅ Estás en la cola. Ahora elige un idioma para comenzar:",
      components: [langRow],
    });
  },
};
