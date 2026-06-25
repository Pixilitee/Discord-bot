const { EmbedBuilder } = require('discord.js');

const EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

const poll = {
  name: 'poll',
  description: 'Create a poll',
  // Usage: !poll Question | Option1 | Option2 | Option3
  async execute(message, args, { polls }) {
    const input = args.join(' ').split('|').map(s => s.trim());
    const question = input[0];
    const options = input.slice(1);

    if (!question) return message.reply('❌ Usage: `!poll Question | Option1 | Option2`');
    if (options.length < 2) return message.reply('❌ You need at least 2 options.');
    if (options.length > 5) return message.reply('❌ Maximum 5 options allowed.');

    const description = options.map((opt, i) => `${EMOJIS[i]} ${opt}`).join('\n\n');

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`📊 ${question}`)
      .setDescription(description)
      .setFooter({ text: `Poll by ${message.author.tag} • React to vote!` })
      .setTimestamp();

    const msg = await message.channel.send({ embeds: [embed] });

    // Add reaction options
    for (let i = 0; i < options.length; i++) {
      await msg.react(EMOJIS[i]);
    }

    polls[msg.id] = { question, options, messageId: msg.id, channelId: message.channel.id };
    message.delete().catch(() => {});
  }
};

const pollresults = {
  name: 'pollresults',
  description: 'Show poll results',
  async execute(message, args, { polls }) {
    const msgId = args[0];
    if (!msgId) return message.reply('❌ Usage: `!pollresults [messageId]`');

    const pollData = polls[msgId];
    if (!pollData) return message.reply('❌ Poll not found. Make sure you copy the correct message ID.');

    const msg = await message.channel.messages.fetch(msgId).catch(() => null);
    if (!msg) return message.reply('❌ Could not fetch the poll message.');

    const lines = [];
    let totalVotes = 0;

    for (let i = 0; i < pollData.options.length; i++) {
      const reaction = msg.reactions.cache.get(EMOJIS[i]);
      const count = reaction ? reaction.count - 1 : 0; // -1 to exclude bot's own reaction
      totalVotes += count;
      lines.push({ option: pollData.options[i], count });
    }

    const description = lines.map(({ option, count }) => {
      const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
      const bar = '█'.repeat(Math.round(percent / 10)) + '░'.repeat(10 - Math.round(percent / 10));
      return `**${option}**\n${bar} ${count} votes (${percent}%)`;
    }).join('\n\n');

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`📊 Results: ${pollData.question}`)
      .setDescription(description)
      .setFooter({ text: `Total votes: ${totalVotes}` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};

module.exports = { poll, pollresults };
