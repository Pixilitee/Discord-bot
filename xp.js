const { EmbedBuilder } = require('discord.js');

const rank = {
  name: 'rank',
  description: 'Check your XP and level',
  async execute(message, args, { xpData }) {
    const target = message.mentions.users.first() || message.author;
    const data = xpData[target.id] || { xp: 0, level: 1 };
    const xpNeeded = data.level * 100;
    const progress = Math.round((data.xp / xpNeeded) * 20);
    const bar = '█'.repeat(progress) + '░'.repeat(20 - progress);

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle(`⭐ ${target.username}'s Rank`)
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: '🏆 Level', value: `${data.level}`, inline: true },
        { name: '✨ XP', value: `${data.xp} / ${xpNeeded}`, inline: true }
      )
      .setDescription(`**Progress:**\n${bar}`)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};

const leaderboard = {
  name: 'leaderboard',
  description: 'Show top 10 XP leaderboard',
  async execute(message, args, { xpData }) {
    const sorted = Object.entries(xpData)
      .sort(([, a], [, b]) => b.level * 100 + b.xp - (a.level * 100 + a.xp))
      .slice(0, 10);

    if (sorted.length === 0)
      return message.reply('❌ No XP data yet! Start chatting to earn XP.');

    const medals = ['🥇', '🥈', '🥉'];
    const lines = sorted.map(([id, data], i) => {
      const medal = medals[i] || `**#${i + 1}**`;
      return `${medal} <@${id}> — Level **${data.level}** (${data.xp} XP)`;
    });

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🏆 XP Leaderboard')
      .setDescription(lines.join('\n'))
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};

module.exports = { rank, leaderboard };
