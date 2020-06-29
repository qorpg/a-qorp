const Discord = require("discord.js")
const client = new Discord.Client()
const config = require("./config.json")

var nlFilterArray = []


client.on("ready", () => {
	console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.guilds.cache.size} guilds.`);
	client.user.setActivity("a-help")
})

const lastMessages = []

client.on("message", async message => {
	if(message.author.bot) return
	
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
		message.delete().catch(O_o=>{})

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

		/*
		if (lastMessages.filter(msg => msg === message).length >= 3) {
			message.react("❌")
			return
		}
		*/


		//Ban filter
		for(i in config.banList){
			if(message.author.id == config.banList[i]){
				message.react("❌")
				return
			}
		}

		//Send Message
		client.channels.cache.get("726238293582282763").send(anonMessage)
		message.react("✅")

		lastMessages.push(message)
		if (lastMessages.length > 10) lastMessages.shift()
	}
})

client.login(config.token);