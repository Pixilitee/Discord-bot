const { EmbedBuilder, PermissionsBitField } = require('discord.js');

const announce = {
  name: 'announce',
  description: 'Send an announcement embed',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return message.reply('❌ You need Manage Messages permission to announce.');

    const text = args.join(' ');
    if (!text) return message.reply('❌ Usage: `!announce [your message]`');

    const embed = new EmbedBuilder()
      .setColor('#FF4500')
      .setTitle('📢 Announcement')
      .setDescription(text)
      .setFooter({ text: `Announced by ${message.author.tag}` })
      .setTimestamp();

    await message.channel.send({ content: '@everyone', embeds: [embed] });
    message.delete().catch(() => {});
  }
};

const say = {
  name: 'say',
  description: 'Make the bot say something',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return message.reply('❌ You need Manage Messages permission to use this.');

    const text = args.join(' ');
    if (!text) return message.reply('❌ Usage: `!say [message]`');

    await message.channel.send(text);
    message.delete().catch(() => {});
  }
};

module.exports = { announce, say };
