require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const getReading = require("./utils/getReading.js");
const {
  Client,
  Collection,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const {
  isInQueue,
} = require("./utils/queueManager.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();

const commands = [];

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
(async () => {
  try {
    console.log("⏳ Registrando comandos...");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("✅ Comandos registrados.");
  } catch (err) {
    console.error(err);
  }
})();

client.once(Events.ClientReady, () => {
  console.log(`🟢 Bot listo como ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // Validación si es /read y está en la cola
    if (interaction.commandName === "read") {
      const member = interaction.member;
      const voiceChannel = member.voice.channel;

      if (!voiceChannel || !isInQueue(interaction.guild.id, voiceChannel.id, member.user.id)) {
        return interaction.reply({
          content: "❌ Debes estar en un canal de voz y haber ingresado a la cola para usar este comando.",
          ephemeral: true,
        });
      }
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "❌ There was an error executing this command.",
        ephemeral: true,
      });
    }
  }

  // Botones para idioma y nivel
  if (interaction.isButton()) {
    if (interaction.customId.startsWith("lang_")) {
      const lang = interaction.customId.split("_")[1];

      const labels = {
        en: {
          prompt: "Select the reading level:",
          beginner: "Beginner 📘",
          intermediate: "Intermediate 📗",
          advanced: "Advanced 📕",
        },
        es: {
          prompt: "Selecciona el nivel de lectura:",
          beginner: "Principiante 📘",
          intermediate: "Intermedio 📗",
          advanced: "Avanzado 📕",
        },
      };

      const i18n = labels[lang] || labels.en;

      const levelRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`read_${lang}_beginner`).setLabel(i18n.beginner).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`read_${lang}_intermediate`).setLabel(i18n.intermediate).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`read_${lang}_advanced`).setLabel(i18n.advanced).setStyle(ButtonStyle.Secondary)
      );

      return interaction.update({
        content: i18n.prompt,
        components: [levelRow],
      });
    }

    if (interaction.customId.startsWith("read_")) {
      const [, lang, level] = interaction.customId.split("_");

      try {
        const user = interaction.user;
        const message = await getReading(lang, level, user);
        return interaction.update({
          content: message,
          components: [],
        });
      } catch (error) {
        console.error("❌ Error getting read:", error);
        return interaction.update({
          content: "❌ Error loading reading.",
          components: [],
        });
      }
    }
  }
});

client.login(process.env.TOKEN);