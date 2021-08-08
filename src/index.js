console.clear();

const config = require("./Data/config.json");


const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


var isReady = true;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});




client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.content === '험해야~') message.reply("아직 공부중이니까 부르지마세요.");


  if(!message.content.startsWith(config.prefix)) return;
  const args = message.content.substring(config.prefix.length).split(/ +/);

  switch (args[0]) {
    case "뭐해":
      message.reply("공부중인데요?");

      break;
    
  }
});
/*
client.on('messageDelete', message => {
  console.log(message);
  if (message.guild.name !== "워터길드") return;
  message.reply("어멋! 무슨 메세지길래 삭제 했을까요???");
});
*/


// 워터 디코에서만
client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.guild.name !== "워터길드") return;
  
  // 자랑방에서만
  if (message.channel.name !== "자랑방") return;
  message.attachments.forEach(attachment => {
    const ImageLink = attachment.proxyURL;
    message.reply("와~ 너무 축하드려요!\n험해봇도 언젠가 자랑할 날이 오겠죠!!!?").catch()
  });
});



client.login(config.token);


