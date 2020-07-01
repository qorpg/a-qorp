const Discord = require("discord.js")
const client = new Discord.Client()
const config = require("./config.json")
const sqlite = require('sqlite3').verbose();

client.on("ready", () => {
	console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.guilds.cache.size} guilds.`);
})

const lastMessages = []
const mutes = {}
const r9kMutes = {}


client.on("message", async message => {
	if(message.author.bot) return

	if(message.channel.id === "727603494097387590"){

		const r9kMessage = message.content.toLowerCase().trim()

		/*

		//r9k filter
		//maybe move these variables into a text file for persistence later
		//first check if muted
		if (message.author.id in mutes && mutes[message.author.id][1] > Date.now()){
			message.delete()
			return
		}
		//then check if new message is an infraction
		if (lastMessages.includes(r9kMessage.toLowerCase().trim())){
			message.delete()
			//if previously muted, mute again and double the mute time
			//otherwise mute for 30 seconds
			const muteDuration = message.author.id in mutes ? mutes[message.author.id][0] * 2 : 30
			const unmuteTime = Date.now() + (muteTime*1000) //convert mute duration into epooch time
			mutes[message.author.id] = [muteTime, unmuteTime]
			message.author.send("Muted for " + muteTime + " seconds.")
			return
		}		

		*/

		//r9kMutes[userID][x]
		//x=0 number of times muted
		//x=1 unix time that user will be unmuted

		

		/*if(!(message.author.id in r9kMutes)){
			r9kMutes[message.author.id][0] = 0
		}*/

		if(message.author.id in r9kMutes && r9kMutes[message.author.id][1] > Date.now()){
			message.delete()
			return
		}

		if(lastMessages.includes(r9kMessage)){
			message.delete()
			const muteNumber = message.author.id in r9kMutes ? r9kMutes[message.author.id][0] + 1 : 1
			const unmuteTime = Date.now() + 250*4**muteNumber
			r9kMutes[message.author.id] = [muteNumber, unmuteTime]
			message.channel.send("you have been muted for " + (250*4**r9kMutes[message.author.id][0])/1000 + " seconds")
		}

		

		lastMessages.push(r9kMessage)  // add message to log if it was successful
	}
})

client.login(config.token);