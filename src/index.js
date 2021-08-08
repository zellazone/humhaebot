const { executionAsyncResource } = require('async_hooks');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const config = require('./Data/config.json'); 

const { YTSearcher } = require('ytsearcher');
 
const searcher = new YTSearcher({
    key: "AIzaSyD9PZPeCPnxS2SbYVH85uq1I9Jn4l8h90s",
    revealed: true
});
 
const client = new Discord.Client();
 
const queue = new Map();
 
client.on("ready", () => {
    console.log("I am online!")
})
 


client.on("message", async(message) => {
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

// 워터 디코에서만
client.on("message", async(message) => {
    if (message.author.bot) return;
    if (message.guild.name !== "워터길드") return;
    
    // 자랑방에서만
    if (message.channel.name !== "자랑방") return;
    message.attachments.forEach(attachment => {
      const ImageLink = attachment.proxyURL;
      message.reply("와~ 너무 축하드려요!\n험해봇도 언젠가 자랑할 날이 오겠죠!!!?").catch()
    });
  });






client.on("message", async(message) => {
    const prefix = '험해야 ';
 
    const serverQueue = queue.get(message.guild.id);
 
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase();
 
    switch(command){
        case '재생':
            execute(message, serverQueue);
            break;
        case '멈춰':
            stop(message, serverQueue);
            break;
        case '넘겨':
            skip(message, serverQueue);
            break;
    }
 
    async function execute(message, serverQueue){
        let vc = message.member.voice.channel;
        if(!vc){
            return message.channel.send("런너님, 먼저 음성채널에 들어가서 절 불러주시겠어요?");
        }else{
            let result = await searcher.search(args.join(" "), { type: "video" })
            const songInfo = await ytdl.getInfo(result.first.url)
 
            let song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url
            };
 
            if(!serverQueue){
                const queueConstructor = {
                    txtChannel: message.channel,
                    vChannel: vc,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true
                };
                queue.set(message.guild.id, queueConstructor);
 
                queueConstructor.songs.push(song);
 
                try{
                    let connection = await vc.join();
                    queueConstructor.connection = connection;
                    play(message.guild, queueConstructor.songs[0]);
                }catch (err){
                    console.error(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(`Unable to join the voice chat ${err}`)
                }
            }else{
                serverQueue.songs.push(song);
                return message.channel.send(`The song has been added ${song.url}`);
            }
        }
    }
    function play(guild, song){
        const serverQueue = queue.get(guild.id);
        if(!song){
            serverQueue.vChannel.leave();
            queue.delete(guild.id);
            return;
        }
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on('finish', () =>{
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            serverQueue.txtChannel.send(`Now playing ${serverQueue.songs[0].url}`)
    }
    function stop (message, serverQueue){
        if(!message.member.voice.channel)
            return message.channel.send("You need to join the voice chat first!")
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }
    function skip (message, serverQueue){
        if(!message.member.voice.channel)
            return message.channel.send("You need to join the voice chat first");
        if(!serverQueue)
            return message.channel.send("There is nothing to skip!");
        serverQueue.connection.dispatcher.end();
    }
})
 
client.login("")