const Discord = require("discord.js")
const client = new Discord.Client()
const config = require("./config.json")
const fs  = require('fs') 

client.on("ready", () => {
	console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.guilds.cache.size} guilds.`);
})

//these files need to be created manually
const lastMessages = require("./messages.json") // blank file should be just []
const r9kMutes = require("./mutes.json") // blank file should be just {}

setInterval(decay, 21600000) // run decay function every 6 hours

function decay(){ // loop through all id's and half their mute duration
	for (var id in r9kMutes){
		r9kMutes[id][0] = Math.floor(r9kMutes[id][0]/2)
	}
	fs.writeFileSync('mutes.json', JSON.stringify(r9kMutes))
}

client.on("message", async message => {
	if(message.author.bot) return

	if(message.channel.id === config.r9kChannelID){
		//apply primary filter - make all lowercase and remove non alphanumberic characters
		const r9kMessage = message.content.toLowerCase().replace(/[_\W]+/g, "")

		//check if author of message is currently muted
		if(message.author.id in r9kMutes && r9kMutes[message.author.id][1] > Date.now()){
			message.delete()
			return
		}

		//check if message is an infraction
		if(lastMessages.includes(r9kMessage)){
			message.delete()
			//either quadruple previous time or start with 1 (in seconds)
			const muteDuration = message.author.id in r9kMutes ? r9kMutes[message.author.id][0]*4 : 1
			const muteUntil = Date.now() + 1000*muteDuration
			r9kMutes[message.author.id] = [muteDuration, muteUntil] // add/update their mute variables
			fs.writeFileSync('mutes.json', JSON.stringify(r9kMutes))
			message.reply("you have been muted for " + muteDuration + " seconds")
		}

		lastMessages.push(r9kMessage)  // add message to log if message was successful
		fs.writeFileSync('messages.json', JSON.stringify(lastMessages))
	}
})

client.login(config.token);
