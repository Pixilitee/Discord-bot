const { EmbedBuilder, PermissionsBitField } = require('discord.js');

// ─── KICK ──────────────────────────────────────────────────────────────────
const kick = {
  name: 'kick',
  description: 'Kick a member',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return message.reply('❌ You do not have permission to kick members.');

    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Please mention a user to kick.');

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await target.kick(reason);

    const embed = new EmbedBuilder()
      .setColor('#FF4444')
      .setTitle('👢 Member Kicked')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Reason', value: reason, inline: true }
      )
      .setTimestamp();
    message.reply({ embeds: [embed] });
  }
};

// ─── BAN ───────────────────────────────────────────────────────────────────
const ban = {
  name: 'ban',
  description: 'Ban a member',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply('❌ You do not have permission to ban members.');

    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Please mention a user to ban.');

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await target.ban({ reason });

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('🔨 Member Banned')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Reason', value: reason, inline: true }
      )
      .setTimestamp();
    message.reply({ embeds: [embed] });
  }
};

// ─── MUTE ──────────────────────────────────────────────────────────────────
const mute = {
  name: 'mute',
  description: 'Timeout (mute) a member',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return message.reply('❌ You do not have permission to mute members.');

    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Please mention a user to mute.');

    const minutes = parseInt(args[1]) || 10;
    await target.timeout(minutes * 60 * 1000, 'Muted by moderator');

    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle('🔇 Member Muted')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Duration', value: `${minutes} minutes`, inline: true }
      )
      .setTimestamp();
    message.reply({ embeds: [embed] });
  }
};

// ─── WARN ──────────────────────────────────────────────────────────────────
const warnings = {};
const warn = {
  name: 'warn',
  description: 'Warn a member',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return message.reply('❌ You do not have permission to warn members.');

    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Please mention a user to warn.');

    const reason = args.slice(1).join(' ') || 'No reason provided';
    const userId = target.user.id;
    if (!warnings[userId]) warnings[userId] = [];
    warnings[userId].push({ reason, date: new Date().toLocaleString() });

    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle('⚠️ Member Warned')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Reason', value: reason, inline: true },
        { name: 'Total Warnings', value: `${warnings[userId].length}`, inline: true }
      )
      .setTimestamp();
    message.reply({ embeds: [embed] });
    target.send(`⚠️ You have been warned in **${message.guild.name}**.\nReason: ${reason}`).catch(() => {});
  }
};

// ─── CLEAR ─────────────────────────────────────────────────────────────────
const clear = {
  name: 'clear',
  description: 'Delete messages',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return message.reply('❌ You do not have permission to delete messages.');

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100)
      return message.reply('❌ Please provide a number between 1 and 100.');

    await message.channel.bulkDelete(amount + 1, true);
    const msg = await message.channel.send(`✅ Deleted **${amount}** messages.`);
    setTimeout(() => msg.delete(), 3000);
  }
};

module.exports = { kick, ban, mute, warn, clear };
