const Discord = require("discord.js")
const client = new Discord.Client()
const config = require("./config.json")
const fs  = require('fs')

var nlFilterArray = []


client.on("ready", () => {
	console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.guilds.cache.size} guilds.`);
	client.user.setActivity("a-help")
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
	
	//MESSAGE IN R9K CHANNEL
	
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
		return
	}
	
	//COMMANDS WITHOUT PREFIX

	mre1 = /^h+e+ll+o+/i
	if(mre1.test(message)){
		message.reply("Hello to you")}
	
	mre2 = /grimacing/i
	if(mre2.test(message)){
		message.react("😬")}
	
	mre3 = /nuclear reactor/i
	if(mre3.test(message)){
		message.channel.send(":warning: WARNING: Core meltdown immanent. :warning:")}
	
	mre4 = /shut up qorp/i
	if(mre4.test(message) && message.author.id != "690702589461004319"){
		message.reply("SHUT THE FUCK UP IM BANNING YOU")}
	
	mre5 = /^test$/i
	if(mre5.test(message)){
		message.channel.send(":white_check_mark:")}
	
	const mre6 = /owo|uwu|uwo|owu/i
	if(mre6.test(message)){
		message.channel.send("5c(xii)")}

	mre7 = /^qorp$/i
	if(mre7.test(message)){
		message.react("🥳")
		message.react("🎊")
		message.react("🙏")
		message.react("🇮")
		message.react("♥️")
		message.react("🇶")
		message.react("🇴")
		message.react("🇷")
		message.react("🇵")
	}

	mre8 = /zoop/i
	if(mre8.test(message)){
		message.channel.send(":point_right: :sunglasses: :point_right:")
	}

	mre9 = /pooz/i
	if(mre9.test(message)){
		message.channel.send(":point_left: :sunglasses: :point_left:")
	}

	mre10 = /monkaEyes/
	if(mre10.test(message) && message.channel.guild == config.anonServerID){
		message.channel.send("<:monkaEyes1:727383924740849664><:monkaEyes2:727383934736007259><:monkaEyes3:727383947528372274><:monkaEyes4:727384422692945960>")
	}
	
	//COMMANDS WITH PREFIX

	if(!message.content.startsWith(config.prefix)) return
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
	const command = args.shift().toLowerCase()
	
	if(command === "help" || command === "h"){
		message.channel.send("**__Anonymous Messaging__**\na-anon [message] *or*\na-a [message]\nhttps://discord.gg/YjppxRg")
		return
	}
	
	if(command === "shit"){
		message.channel.send("i shit")
	}

	if(command === "pfp"){
		message.channel.send("https://cdn.discordapp.com/attachments/485564315714453534/726322343365968012/1f921.png")
	}        

	if(command === "anon" || command === "a"){
		const anonMessage = args.join(" ")
		//message.delete().catch(O_o=>{}) // wtf is this and why is it here

		//Newline filter (max 5)
		nlre = /\n/g
		if(nlre.test(anonMessage)){
			nlFilterArray = anonMessage.match(nlre)
			if(nlFilterArray.length > 5){
				message.react("❌")
				return
			}
		}
		
		//@everyone filter
		aere = /@everyone|@here/
		if(aere.test(anonMessage)){
			if(message.author.id != config.qorpID){
				message.react("❌")
				return
			}
		}

		//Whitespace filter
		wsre = /_\s+_|\*\* *\*\*/
		if(wsre.test(anonMessage)){
			message.react("❌")
			return
		}

		//Character limit filter
		if(anonMessage.length > 1000){
			message.react("❌")
			return
		}

		//Blank message filter
		if(anonMessage === ""){
			message.react("❌")
			return
		}

		//Ban filter
		for(i in config.banList){
			if(message.author.id == config.banList[i]){
				message.react("❌")
				return
			}
		}

		//Send Message
		if(anonMessage != "test"){
			client.channels.cache.get(config.anonChannelID).send(anonMessage)
		}
		message.react("✅")
	}
})

client.login(config.token);

