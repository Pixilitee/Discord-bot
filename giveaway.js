const { EmbedBuilder, PermissionsBitField } = require('discord.js');

const giveaway = {
  name: 'giveaway',
  description: 'Start a giveaway',
  async execute(message, args, { giveaways }) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
      return message.reply('❌ You need the Manage Server permission to start giveaways.');

    const minutes = parseInt(args[0]);
    if (isNaN(minutes) || minutes < 1)
      return message.reply('❌ Usage: `!giveaway [minutes] [prize]`');

    const prize = args.slice(1).join(' ');
    if (!prize) return message.reply('❌ Please specify a prize!');

    const endsAt = Date.now() + minutes * 60 * 1000;
    const endTime = new Date(endsAt).toLocaleTimeString();

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🎉 GIVEAWAY! 🎉')
      .setDescription(`**Prize:** ${prize}\n\nReact with 🎉 to enter!\n\n⏰ Ends in **${minutes} minute(s)** (at ${endTime})`)
      .setFooter({ text: `Hosted by ${message.author.tag}` })
      .setTimestamp();

    const msg = await message.channel.send({ embeds: [embed] });
    await msg.react('🎉');

    giveaways[msg.id] = {
      prize,
      endsAt,
      entries: [],
      channelId: message.channel.id,
    };

    message.delete().catch(() => {});
  }
};

const greroll = {
  name: 'greroll',
  description: 'Reroll a giveaway winner',
  async execute(message, args, { giveaways }) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
      return message.reply('❌ You need Manage Server permission.');

    const msgId = args[0];
    if (!msgId) return message.reply('❌ Usage: `!greroll [messageId]`');

    // Try to fetch the original message to get entries from reactions
    const msg = await message.channel.messages.fetch(msgId).catch(() => null);
    if (!msg) return message.reply('❌ Could not find that giveaway message.');

    const reaction = msg.reactions.cache.get('🎉');
    if (!reaction) return message.reply('❌ No reactions found on that message.');

    const users = await reaction.users.fetch();
    const entries = users.filter(u => !u.bot).map(u => u.id);
    if (entries.length === 0) return message.reply('❌ No valid entries to reroll from.');

    const winnerId = entries[Math.floor(Math.random() * entries.length)];
    message.channel.send(`🎉 New winner: <@${winnerId}>! Congratulations!`);
  }
};

module.exports = { giveaway, greroll };
