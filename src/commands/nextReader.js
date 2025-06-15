// commands/nextReader.js

const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { nextReader } = require("../utils/queueManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("next")
    .setDescription("Pasa al siguiente lector (solo moderadores)"),

  async execute(interaction) {
    // Verificar permisos
    const member = interaction.member;
    const hasPermission = member.permissions.has(
      PermissionsBitField.Flags.ManageMessages
    );

    if (!hasPermission) {
      return interaction.reply({
        content: "❌ No tienes permiso para usar este comando.",
        ephemeral: true,
      });
    }

    const next = nextReader();

    if (!next) {
      return interaction.reply("📭 La cola está vacía.");
    }

    await interaction.reply(`🎙️ Es el turno de: <@${next.id}>`);
  },
};
