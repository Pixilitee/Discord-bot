const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Shows all available commands',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('📖 Bot Commands')
      .addFields(
        {
          name: '⚔️ Moderation',
          value: [
            '`!kick @user [reason]` — Kick a user',
            '`!ban @user [reason]` — Ban a user',
            '`!mute @user [minutes]` — Mute a user',
            '`!warn @user [reason]` — Warn a user',
            '`!clear [amount]` — Delete messages',
          ].join('\n')
        },
        {
          name: '🎉 Giveaways',
          value: [
            '`!giveaway [minutes] [prize]` — Start a giveaway',
            '`!greroll [messageId]` — Reroll a giveaway winner',
          ].join('\n')
        },
        {
          name: '📊 Polls',
          value: [
            '`!poll [question] | [option1] | [option2] ...` — Create a poll (up to 5 options)',
            '`!pollresults [messageId]` — View poll results',
          ].join('\n')
        },
        {
          name: '⭐ XP & Levels',
          value: [
            '`!rank` — See your XP & level',
            '`!leaderboard` — Top 10 users by XP',
          ].join('\n')
        },
        {
          name: '💬 Auto-Helper',
          value: [
            '`!announce [message]` — Send an announcement',
            '`!say [message]` — Bot says a message',
          ].join('\n')
        }
      )
      .setFooter({ text: 'Auto-moderation is always active ✅' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
