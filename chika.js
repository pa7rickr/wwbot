
process.on('uncaughtException', console.error)
require('./config')
const {
	BufferJSON,
	WAMessageStubType,
	WA_DEFAULT_EPHEMERAL,
	generateWAMessageFromContent,
	areJidsSameUser,
	proto
} = require('@adiwajshing/baileys')
 const { 
 	formatDate,
     formatJSON,
 	getRandom,
 	fetchBuffer, 
     fetchURL,
     checkURL,
     clockString,
     runtime, 
     formatp,
     sleep, 
     tanggal,
     pickRandom, 
     generateImage
} = require("./lib/function")
const Ikky = require("ikyy")
const moment = require("moment-timezone")
const { exec, spawn } = require("child_process")
const { serialize } = require("./lib/simple")
const { webp2mp4File, UploadFileUgu, TelegraPh, Top4top } = require("./lib/uploader")
const { Aki } = require("aki-api")
const bochil = require('@bochilteam/scraper')
const speed = require('performance-now')
const similarity = require("similarity") 
const yts = require('yt-search')
const scrape = require('./lib/scraper')
const fetch = require("node-fetch")
const gtts = require('node-gtts')
const os = require('os')
const xa = require("xfarr-api")
const chalk = require("chalk")
const ikyy = new Ikky()
const util = require("util") 
const fs = require("fs")


this.anonymous = this.anonymous ? this.anonymous : {}
this.akinator = this.akinator ? this.akinator : {}
this.menfess = this.menfess ? this.menfess : {}

// Membuat object game untuk menyimpan data permainan
this.game = {
  groupId: "6288989029718-1624806045@g.us",
  allPlayers: {}, // Array untuk menyimpan data pemain
  players: {}, // Array untuk menyimpan data pemain
  roles: [], // Array untuk menyimpan peran pemain
  votes: {}, // Objek untuk menyimpan data voting
  dayDuration: 90 * 1000, // Durasi sesi siang (voting) dalam milisecond
  nightDuration: 90 * 1000, // Durasi sesi malam (aksi werewolf/seer/guardian) dalam milisecond
  discussionDuration: 90 * 1000, // Durasi sesi diskusi dalam milisecond
  state: 'lobby', // Menyimpan status permainan ('lobby', 'day', 'night', 'finished')
  minimumPlayers: 4, // Jumlah pemain minimal
  maximumPlayers: 32, // Jumlah pemain maksimal
  totalPlayers: 0, // Jumlah pemain yang bergabung
  totalWerewolf: 0, // Jumlah pemain werewolf
  totalSeer: 0, // Jumlah pemain seer
  totalGuardian: 0, // Jumlah pemain guardian
  totalVillagers: 0, // Jumlah pemain villagers
  total: 0, // Jumlah hari yang dimainkan
  werewolfKilled: [], // Array untuk menyimpan pemain yang dibunuh werewolf
  protectedPlayer: [], // Menyimpan pemain yang dilindungi guardian
  villagerVoted: null, // Menyimpan pemain yang terpilih sebagai target voting sesi siang
  killedPlayer: [], // Menyimpan pemain yang terbunuh di sesi malam
  seenPlayer: null // Menyimpan pemain yang diterawang di sesi malam
}

let game = this.game

module.exports = async(conn, m, message, store, Command) => {
    try {
        const body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : 'unknown'
		const budy = (typeof m.text == 'string' ? m.text : '')
		const prefix = /^[_!#$%^&./\\©^]/.test(body) ? body.match(/^[_!#$%^&./\\©^]/gi) : '#'
		const command = body.trim().split(/ +/).shift().toLowerCase()
        const cmd = command.split(prefix)[1]
		const args = body.trim().split(/ +/).slice(1)
		const username = m.pushName || "No Name"
		const botNumber = await conn.decodeJid(conn.user.id)
		const isCreator = [...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
		const text = args.join(" ") ? args.join(" ") : ''
		const quoted = ((m.quoted || m).mtype == 'templateMessage') ? m.quoted.hydratedFourRowTemplate[Object.keys(m.quoted.hydratedFourRowTemplate)[1]] : ((m.quoted || m).mtype == 'buttonsMessage') ? m.quoted[Object.keys(m.quoted)[1]] : m.quoted ? m.quoted : m
		const mime = (quoted.msg || quoted).mimetype || ''
		const time = moment.tz('Asia/Jakarta').format('HH:mm:ss')
		
        const metadata = m.isGroup ? await conn.groupMetadata(m.chat) : ''
	    const participants = m.isGroup ? metadata.participants : ''
	    const groupAdmin = m.isGroup ? conn.getGroupAdmins(participants) : ''
	    const isBotAdmin = groupAdmin.includes(botNumber) || false
	    const isAdmin = groupAdmin.includes(m.sender) || false
        
        
        const used = process.memoryUsage()
        const cpus = os.cpus().map(cpu => {
            cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
			return cpu
        })
        const cpu = cpus.reduce((last, cpu, _, { length }) => {
            last.total += cpu.total
			last.speed += cpu.speed / length
			last.times.user += cpu.times.user
			last.times.nice += cpu.times.nice
			last.times.sys += cpu.times.sys
			last.times.idle += cpu.times.idle
			last.times.irq += cpu.times.irq
			return last
        }, {
            speed: 0,
			total: 0,
			times: {
			    user: 0,
			    nice: 0,
			    sys: 0,
			    idle: 0,
			    irq: 0
            }
        })
        
        if (m.mtype == 'reactionMessage' && m.msg.key.id == game.quotedReactID) {
          if (message.reaction == '🐺') { 
            if (Object.keys(game.players).length > game.maximumPlayers) return conn.sendMessage(message.id.remote, `Jumlah pemain dalam room terdapat 32 pemain! Anda tidak dapat bergabung. Jika anda Moderator, silahkan ketik /start-ww`);
            let player = game.players[message.senderId];
            if (player) return conn.sendMessageWithMentions(message.id.remote, `Anda sudah terdaftar di game ini.\n\n📜 List pemain yang bergabung:\n${getPlayerListString ()}`);
            // Jika belum terdaftar, daftarkan pemain ke database
            game.players[message.senderId] = { id: message.senderId, alive: true, votes: 0 };
            conn.sendTextWithMentions(m.chat, `*[ Werewolf - Game ]*\n\n📜 List pemain yang bergabung:\n${getPlayerListString ()}\n\nKamu telah berhasil didaftarkan di game ini. ${Object.keys(game.players).length >= game.minimumPlayers ? 'Permainan ini dapat dimulai, ketik /start-ww untuk memulai permainan.' : 'Permainan ini tak dapat dimulai, karena pemain yang bergabung kurang dari 5.'}`);
          } else if (message.reaction = '') {
            delete game.players[message.senderId]        
          }
        }
        
        if (budy.startsWith(">")) { 
        	if (!isCreator) return
            try {
                let evaled = await eval(budy.slice(2))
                if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                await m.reply(evaled)
            } catch (err) {
                ma = util.format(err)
                console.log(ma)
                await m.reply(ma)
            } 
        }
        if (budy.startsWith("<")) { 
        	if (!isCreator) return 
            try {
                let evaled = await eval(`(async () => { ${budy.slice(2)} })()`)
                if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                await m.reply(evaled)
            } catch (err) {
                ma = util.format(err)
                console.log(ma)
                await m.reply(ma)
            } 
        }
        
	    switch (command) {
		    // Werewolf Game
		    case "/werewolf": {
        	    if (m.from !== game.groupId) return m.reply('Perintah hanya dapat digunakan di grup (https://chat.whatsapp.com/FIdMh612Iru1ZQgrXLp8KN)')
                if (!isGroup) return global.mess("group", m)
                if (game.state !== 'lobby') return conn.sendMessage(m.from, `${game.state == 'waiting' ? 'Silahkan mereaksi 🐺 pesan itu untuk bergabung dalam permainan.' : 'Game sudah dimulai. Anda tidak dapat lagi bergabung.'}`, { quotedMessageId: game.state == 'waiting' ? game.quotedReactID : '' });
                game.state = 'waiting'
                let reactID = await conn.sendMessageWithMentions(m.from, `Permainan telah berhasil dibuat. Silahkan me-reaksi pesan ini dengan emoji 🐺`, { quotedMessageId: m.id._serialized });
                game.quotedReactID = reactID.id._serialized
            }
            break
            case "/start-ww": {
              if (m.from !== game.groupId) return
              if (!isGroup) return global.mess("group", m)
              if (!isOwner) return m.reply('Anda bukan moderator!')
              if (game.state !== 'waiting') return m.reply('Game sudah dimulai atau sedang dalam proses.');
              if (Object.keys(game.players).length < game.minimumPlayers) return conn.sendMessage(m.from, `Belum terdapat minimal ${game.minimumPlayers - Object.keys(game.players).length} pemain yang dibutuhkan untuk memulai game.\n\n📜 List pemain yang bergabung:\n${getPlayerListString ()}`);
              let shufflePlayers = shuffleArray(game.players)
              game.players = shufflePlayers 
              conn.sendMessage(m.from, '*[ Werewolf - Game ]*\n\nBerhasil memulai permainan. Silahkan melihat chat pribadi bot masing-masing untuk melihat role yang didapatkan. 🐺💂🔮', { quotedMessageId: m.id._serialized })
              setTimeout(startGame, 5 * 1000);
            }
            break; 
            case "list-ww": {
              if (game.state == 'waiting') return m.reply('Game belum dimulai');
              let listPlayers = getPlayersAliveOrDead() 
              let teks = `*[ Werewolf - Game ]*
 
📝 Berikut ini adalah list semua pemain: 
${listPlayers}`
              conn.sendMessageWithMentions(m.from, teks)
            }
            break;
            case "/end-ww": {
              if (game.state == 'waiting') return conn.sendMessage(m.from, 'Game belum dimulai');
              endGame()
            }
            break

		    // Main Menu
            case ["creator"]:
            case prefix+"owner": {
                conn.sendContact(m.chat, global.owner, true)
            }
            break 
            case prefix+"ping":
            case prefix+"status":
    		case prefix+"info": {
                let timestampi = speed()
                let latensii = speed() - timestampi
                respon = 
`🤖 PatrickBot Info
▸ *Response Speed:* ${latensii.toFixed(4)} _second_
▸ *Runtime:* ${runtime(process.uptime())}
▸ *Database:* Mongo DB

💻 *Info Server:*
RAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}

👨‍💻 *NodeJS Memory Usage:*
${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v=>v.length)),' ')}: ${formatp(used[key])}`).join('\n')}

${cpus[0] ? `▸ Total CPU Usage
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}
CPU Core(s) Usage (${cpus.length} Core CPU)
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}`.trim()
                m.reply(respon)
            }
            break
            case prefix+"help":
            case prefix+"list":
            case prefix+"menu": { 
                let image = await generateImage(thumb)
                let timestampi = speed()
                let latensii = speed() - timestampi
            	let anu = 
`Hai, *${username}* 👋
▸ *Kecepatan Respon:* ${latensii.toFixed(4)}s
▸ *Runtime:* ${runtime(process.uptime())}
▸ *Database:* MongoDB
Berikut ini adalah semua
command yang ada di PatrickBot

- *Werewolf Commands* 
▸ /werewolf 
▸ /start-ww
▸ /end-ww 
▸ /list-ww 

- *Maker Commands* 
▸ #sticker *<reply foto|video>*
▸ #stickerwm *<reply foto|video>*
▸ #toimage *<reply foto|video>*

- *Group Commands* 
▸ #caripesan *<query>*
▸ #announce *<teks>*
▸ #revokegc
▸ #linkgc 

- *Private Commands* 
▸ #confess *<nomor|nama|pesan>*

- *Social Media* 
▸ #play *<query>*
▸ #ytmp3 *<url>*
▸ #ytmp4 *<url>*
▸ #instagram *<url>*
▸ #tiktok *<url>*
▸ #mediafire *<url>*

- *Owner Commands* 
▸ > *<code>*
▸ < *<code>*
▸ #info`
                conn.sendHydrated(m.chat, anu, 'WhatsApp Bot', image.location, [ 
                    [pickRandom([ 
                        'https://chat.whatsapp.com/JoCChCVDEi7KxOSn1Oxj2b', 
                        'https://chat.whatsapp.com/FIdMh612Iru1ZQgrXLp8KN',
                        'https://chat.whatsapp.com/GGOuzrH1EeIB97mKftMMNZ', 
                    ]), 'Group Support' ]
                ], [], [ 
                    [ '#dashboard', 'Dashboard' ], ['#ping', 'Info Bot' ], 
                    [ '#leaderboard', 'Leaderboard' ]
                ], m, { asLocation: true })
            }
            break

            // Owner Commands 
            case prefix+"block": {
    			if (!isCreator) return global.mess("owner", m)
    			let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    			await conn.updateBlockStatus(users, 'block').then((res) => m.reply(formatJSON(res))).catch((err) => m.reply(formatJSON(err)))
    		}
    		break 
    		case prefix+"unblock": {
    			if (!isCreator) return global.mess("owner", m)
    			let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    			await conn.updateBlockStatus(users, 'unblock').then((res) => m.reply(formatJSON(res))).catch((err) => m.reply(formatJSON(err)))
    		}
    		break 
    		case prefix+"bc":
            case prefix+"bcgc":
    		case prefix+"broadcastgroup":
    		case prefix+"broadcast": {
    			if (!isCreator) return global.mess("owner", m)
    			let getGroups = await conn.groupFetchAllParticipating()
    			let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
    			let anu = groups.map(v => v.id)
    			cc = await conn.serializeM(text ? m : m.quoted ? await m.quoted.fakeObj : false || m)
    			cck = text ? text : cc.text
    			m.reply(`Mengirim pesan siaran ke *${anu.length}* grup. (${anu.length * 1.5}s)`)
    			for (let i of anu) {
    				await sleep(1500)
    				await conn.copyNForward(i, conn.cMod(m.chat, cc, /bc|broadcast|bcgc/i.test(cck) ? cck : `${cck}`), true).catch(_ => _)
    			}
    			m.reply(`Berhasil mengirim siaran ke *${anu.length}* grup.`)
    		}
    		break 
            case prefix+"join": {
                if (!isCreator) return global.mess("owner", m)
                if (!text) return m.reply(`Kirim perintah *${command}* query`)
                if (!checkURL(text)) return m.reply(`Kirim perintah *${command}* query`)
                if (!text.includes('chat.whatsapp.com')) return m.reply(`URL harus *chat.whatsapp.com* link.`)
                let query = text.split('https://chat.whatsapp.com/')[1]
                await conn.groupAcceptInvite(query).then(v => m.reply(v))
            }
            break 
            
            // Group Commands
    		case prefix+"pengumuman":
            case prefix+"announce":
    		case prefix+"hidetag":
    		case "@everyone": {
    			if (!m.isGroup) return global.mess("group", m)
        		if (!(isAdmin || isCreator)) return global.mess("admin", m)
        		let users = participants.map(u => conn.decodeJid(u.id))
                let message = m.quoted ? m.quoted : m.msg
                const msg = conn.cMod(m.chat, generateWAMessageFromContent(m.chat, {
                    [message.toJSON ? quoted.mtype : 'extendedTextMessage']: message.toJSON ? message.toJSON() : {
                        text: message || ''
                    }
                }, {
                    quoted: m,
                    userJid: botNumber
               }), text || quoted.text, botNumber, { contextInfo: { mentionedJid: users }, mentions: users })
               await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
            }
    		break
            case prefix+"liston":
            case prefix+"listonline": {
             	if (!m.isGroup) return global.mess("group", m)
                 if (!(isAdmin || isCreator)) return global.mess("admin", m)
                 let id = args && /\d+\-\d+@g.us/.test(text) ? text : m.chat
                 let online = [...Object.keys(store.presences[id]), botNumber]
                 conn.sendTextWithMentions(m.chat, 'List Online:\n\n' + online.map(v => '▸ @' + v.replace(/@.+/, '')).join`\n`, m)
             }
             break 
             
            // Other Commands
            case prefix+"listgc": {
                 let anu = await conn.groupFetchAllParticipating()
                 let teks = `▣ *LIST GROUP CHAT*\nTotal Group: *${Object.entries(anu).map(v => v[0]).length}* Group\n\n`
                 teks += Object.entries(anu).map(([jid, metadata], index) => 
`▸ *ID Grup:* ${jid}
▸ *Judul:* ${metadata.subject}
▸ *Owner:* ${metadata.owner !== undefined ? '@' + metadata.owner.split`@`[0] : 'unknown'}
▸ *Dibuat pada:* ${moment(metadata.creation * 1000).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss')}
▸ *Total Member:* ${metadata.participants.length}
────────────────────`).join('\n\n')
                 conn.sendTextWithMentions(m.chat, teks, m)
             }
             break 
             case prefix+"listblock": {
                 let anu = await conn.fetchBlocklist()
                 let blocked = anu.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != botNumber)
                 let teks = `▣ *LIST BLOCK USER*\nTotal: *${anu.length}* User\n\n`
                 for (let contacts of blocked) {
                     teks += `▸ @${contacts.split`@`[0]}\n`
                 }
                 conn.sendTextWithMentions(m.chat, teks, m)
             }
            break  
            
            /** 
                * It's a Private Commands
                * Please add features related with group in here
                * @pa7rick
            **/
            case '/next':
            case '/leave': {
            	if (isGroup) return global.mess("private", m)
                let room = Object.values(this.anonymous).find(room => room.check(m.sender))
                if (!room) return m.reply(`Kamu tidak sedang berada di dalam anonymous chat\nKetik */start* untuk mencari partner chat!`)
                m.reply(`Berhasil meninggalkan partner chat.`)
                let other = room.other(m.sender)
                if (other) conn.sendMessage(other, `Partner meninggalkan chat.\nKetik */start* untuk mencari partner chat.`)
                delete this.anonymous[room.id]
                if (command === '/leave') break
            }
            case '/start': {
            	if (isGroup) return global.mess("private", m)
                if (Object.values(this.anonymous).find(room => room.check(m.sender))) return m.reply(`Kamu masih berada di dalam anonymous chat\nKetik */next* untuk melewati partner chat!\nKetik */leave* untuk meninggalkan partner chat!`)
                let room = Object.values(this.anonymous).find(room => room.state === 'WAITING' && !room.check(m.sender))
                if (room) {
                    conn.sendMessage(room.a, `Partner telah ditemukan.\nKetik */next* untuk melewati partner chat.\nKetik */leave* untuk meninggalkan partner chat.`)
                    room.b = m.sender
                    room.state = 'CHATTING'
                    m.reply(`Partner telah ditemukan.\nKetik */next* untuk melewati partner chat.\nKetik */leave* untuk meninggalkan partner chat.`)
                } else {
                    let id = + new Date
                    this.anonymous[id] = {
                        id,
                        a: m.sender,
                        b: '',
                        state: 'WAITING',
                        check: function (who = '') {
                            return [this.a, this.b].includes(who)
                        },
                        other: function (who = '') {
                            return who === this.a ? this.b : who === this.b ? this.a : ''
                        },
                    }
                    m.reply(`Silahkan tunggu sebentar untuk mencari partner. Ketik *${prefix}leave* untuk meninggalkan anonymous chat!`)
                }
            }
            break 
            case '/akinator': {
    			if (isGroup) return global.mess("private", m)
    			if (m.sender in this.akinator) return m.reply('Kamu sedang ada sesi akinator.')
                this.akinator[m.sender] = {
                	aki: new Aki({ region: 'id', childMode: false, proxy: undefined }),
                    state: 'PLAYING' 
                }
                let aki = this.akinator[m.sender].aki
                await aki.start()
                teks = `*${aki.question}*\n`
                teks += `*Progress:* ${aki.progress}\n\n`
                teks += `1. Iya\n`
                teks += `2. Tidak\n`
                teks += `3. Tidak tahu\n`
                teks += `4. Mungkin\n`
                teks += `5. Mungkin tidak\n\n`
                teks += `Ketik angka/teksnya!\n`
                teks += `Ketik *#delakinator* untuk hapus sesi!`
                m.reply(teks)
    		}
    		break 
    		case '/delakinator': {
    			if (m.isGroup) return m.reply(mess.private)
    			if (!(m.sender in this.akinator)) return m.reply('Tidak ada sesi akinator!')
    			delete this.akinator[m.sender]
    			m.reply('Sukses menghapus sesi akinator!')
    		} 
    
            /** 
                * It's a Social Media 
                * Please add features related with socmed in here
                * @pa7rick
            **/
            case prefix+'play': {
    			if (!text) return m.reply(`Kirim perintah *${command}* query`)
    			let url = await yts(text)
    			if (!url) return m.reply("Video tidak ditemukan!")   
                let data = await bochil.youtubedlv2(url.all[0].url).catch((e) => { return m.reply(`Terjadi kesalahan\n\n${e}`) }) 
                let { title, thumbnail, audio } = data
    			let { quality, fileSizeH, fileSize, download } = audio['128kbps']
                let teks = `Berhasil mendapatkan data.\n`    
    		    teks += `▸ *Judul:* ${title}\n` 
                teks += `▸ *Kualitas:* 128kbps\n`
                teks += `▸ *Ukuran file:* ${fileSizeH}\n` 
                if (fileSize > 100000) { 
                    teks += `Ukuran file lebih dari 100 MB (Batas >= 100 MB)`
                    return conn.sendMessage(m.from, thumb, { caption: teks, quotedMessageId: m.id._serialized })
                } else teks += `Tunggu bentar, file lagi dikirim segera.`
        	    let thumb = await MessageMedia.fromUrl(thumbnail)
                let media = await download()
                conn.sendText(m.chat, thumb, teks, m)
        	    conn.sendFile(m.from, media, title, m)
            }
    		break 
            case prefix+'mp3':
    		case prefix+'ytmp3': {
    			if (!text) return m.reply(`Kirim perintah *${command}* url`)
                if (!(text.includes("youtu.be") || text.includes("youtube.com"))) return m.reply(`URL harus *youtube.com* atau *youtu.be* link.`)
                let url = checkURL(text)[0].replace('youtube.com', 'youtu.be').replace('/shorts', '').replace('?feature=share', '').replace('watch?v=', '')
    			let data = await bochil.youtubedlv2(url).catch((e) => { return m.reply(`Terjadi kesalahan\n\n${e}`) }) 
                let { title, thumbnail, audio } = data 
    			let { quality, fileSizeH, fileSize, download } = audio['128kbps']
                let teks = `Berhasil mendapatkan data.\n`    
    		    teks += `▸ *Judul:* ${title}\n` 
                teks += `▸ *Kualitas:* 128kbps\n`
                teks += `▸ *Ukuran file:* ${fileSizeH}\n` 
                if (fileSize > 100000) { 
                    teks += `Ukuran file lebih dari 100 MB (Batas >= 100 MB)`
                    return conn.sendMessage(m.from, thumb, { caption: teks, quotedMessageId: m.id._serialized })
                } else teks += `Tunggu bentar, file lagi dikirim segera.`
        	    let thumb = await MessageMedia.fromUrl(thumbnail)
                let media = await download()
                conn.sendMessage(m.from, thumb, { caption: teks, quotedMessageId: m.id._serialized })
        	    conn.sendFile(m.from, media, title, { quotedMessageId: m.id._serialized })
            }
            break 
            case prefix+'mp4':
    		case prefix+'ytmp4': {
    			if (!text) return m.reply(`Kirim perintah *${command}* url`)
                if (!(text.includes("youtu.be") || text.includes("youtube.com"))) return m.reply(`URL harus *youtube.com* atau *youtu.be* link.`)
                let url = checkURL(text)[0].replace('youtube.com', 'youtu.be').replace('/shorts', '').replace('?feature=share', '').replace('watch?v=', '')
    			let data = await bochil.youtubedlv2(url).catch((e) => { return m.reply(`Terjadi kesalahan\n\n${e}`) }) 
                let { title, thumbnail, video } = data
    			let { quality, fileSizeH, fileSize, download } = video['360p'] || video['480p']  
                let teks = `Berhasil mendapatkan data.\n`    
    		    teks += `▸ *Judul:* ${title}\n` 
                teks += `▸ *Kualitas:* 360p\n`
                teks += `▸ *Ukuran file:* ${fileSizeH}\n` 
                if (fileSize > 100000) { 
                    teks += `Ukuran file lebih dari 100 MB (Batas >= 100 MB)`
                    return conn.sendMessage(m.from, thumb, { caption: teks, quotedMessageId: m.id._serialized })
                } else teks += `Tunggu bentar, file lagi dikirim segera.`
        	    let thumb = await MessageMedia.fromUrl(thumbnail)
                let media = await download()
                conn.sendImage(m.from, thumb, teks, m)
        	    // conn.sendFile(m.from, media, title, m, { contextInfo: { externalAdReply: { title, )
            }
    		break
    	    case prefix+'instagram': { 
    		    if (!text) return m.reply(`Kirim perintah *${command}* url`)
    			if (!text.includes("instagram.com")) return m.reply(`URL harus *instagram.com* link.`) 
                let data = await bochil.instagramdlv2(checkURL(text)[0]).catch((e) => { return m.reply(`Terjadi kesalahan.\n\n${e}`) })
                for (let i of data) conn.sendFile(m.sender, i.url, 'Instagram Downloader', m)
            }
    		break  
            case prefix+'tiktoknowm':
    	    case prefix+'tiktok': {
    			if (!text) return m.reply(`Kirim perintah *${command}* url`)
    			if (!text.includes("tiktok.com")) return m.reply(`URL harus *tiktok.com* link.`)
                let { video } = await bochil.tiktokdlv3(checkURL(text)[0]).catch((e) => { return m.reply(`Terjadi kesalahan\n\n${e}`) }) 
    			conn.sendFile(m.chat, video.no_watermark, 'Tiktok Downloader', m)
    		}
    		break 
    		case prefix+'mediafire': {
    			if (!text) return m.reply(`Kirim perintah *${command}* url`)
    			if (!text.includes("mediafire.com")) return m.reply(`URL harus *mediafire.com* link.`)
    			global.mess("wait", m)
                let data = await bochil.mediafiredl(checkURL(text)[0]).catch((e) => { return m.reply(`Terjadi kesalahan.\n\n${e}`) })
    		    let teks = `▣ Mediafire Download\n`
    		    teks += `▸ *Judul file:* ${data.filename}\n`
    		    teks += `▸ *Tipe file:* ${data.filetype}\n` 
    		    teks += `▸ *Ekstensi:* ${data.ext}\n`
    		    teks += `▸ *Upload:* ${data.aploud}\n`
    		    teks += `▸ *Ukuran file:* ${data.filesizeH}\n`
    		    teks += `Tunggu bentar, file lagi dikirim segera.` 
               if (filesize > 100000) { 
                    teks += `Ukuran file lebih dari 100 MB (Batas >= 100 MB)`
                    return conn.sendMessage(m.from, teks, { quotedMessageId: m.id._serialized })
                } else teks += `Tunggu bentar, file lagi dikirim segera.`
    		    conn.sendText(m.from, teks, m)
    		    conn.sendFile(m.chat, data.url, data.filename, m, { asDocument: true })
            }
    		break 

            // Convert and Media 
            case prefix+"toaudio":
    		case prefix+"tomp3": {
    			if (!quoted || !/video/.test(mime)) return m.reply(`Reply video dengan caption *${command}*`)
        		let media = await conn.downloadAndSaveMediaMessage(quoted)
        		ran = await getRandom('.mp3')
        		exec(`ffmpeg -i ${media} ${ran}`, (err) => {
        			if (err) return global.mess("error", m)
        			result = fs.readFileSync(ran)
        			conn.sendAudio(m.chat, ran, m) 
                    fs.unlinkSync(media)
                    fs.unlinkSync(ran)
        		})
            }
            break 
            case prefix+"toimg":
            case prefix+"tovid":
            case prefix+"tovideo":
            case prefix+"toimage": {
    			if (!quoted || !/webp/.test(mime)) return m.reply(`Reply sticker dengan caption *${command}*`)
    		    let media = await conn.downloadAndSaveMediaMessage(quoted)
    		    let ran = await getRandom('.png')
    		    if (!m.quoted.isAnimated) {
    		        exec(`ffmpeg -i ${media} ${ran}`, (e) => {    			    
        			    if (e) return global.mess("error", m)
        			    conn.sendImage(m.chat, ran, 'Convert Sticker to Image', m)
                        fs.unlinkSync(media)
        			    fs.unlinkSync(ran)
        		    })
                } else if (m.quoted.isAnimated || /tovideo/.test(command)) {
                    let { result } = await webp2mp4File(media)
                    await conn.sendVideo(m.chat, result, 'Convert Sticker to Video' , m)
                    await fs.unlinkSync(media)
                } 
    		}
		    break 
		    case prefix+"s":
            case prefix+"sgif":
            case prefix+"swm":
            case prefix+"stickergif":
            case prefix+"stickerwm":
        	case prefix+"sticker": {
    			if (!quoted) return m.reply(`Reply foto/video dengan caption *${command}*`)  
                let [authors, packnames] = text.split`|`
    			if (/image/.test(mime)) {
    				let media = await conn.downloadMediaMessage(quoted)
    				let encmedia = await conn.sendImageAsSticker(m.chat, media, m, { packname: packnames ? packnames : global.packname, author: authors ? authors : global.author })
    				await fs.unlinkSync(encmedia)
    			} else if (/video/.test(mime)) {
    				if ((quoted.msg || quoted).seconds > 11) return m.reply(`Max 10 seconds.`)
    				let media = await conn.downloadMediaMessage(quoted)
    				let encmedia = await conn.sendVideoAsSticker(m.chat, media, m, { packname: packnames ? packnames : global.packname, author: authors ? authors : global.author })
    				await fs.unlinkSync(encmedia)
    			} else m.reply(`Reply foto/video dengan caption *${command}*`)
    		}
    		break
            default:  
            conn.sendMessageWerewolf = async (chatId, text, options = {}) => { 
               let message = await generateWAMessageFromContent(chatId ? chatId : m.chat, { 
                   extendedTextMessage: {
                       text: text.replace(/@c\.us/g, ''),
                       mentions: [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net'), 
                       ...options,
                       contextInfo: {
                           externalAdReply: {
                               title: `🐺 Werewolf - Game`,
                               body: 'Multiplayer Game',
                               sourceUrl: 'https://werewolf-game',
                               thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSHUAML1JteFKe4cDEQJXTx_FayMvXfmBk9w&usqp=CAU'
                           }
                       }
                   }
               }, { ...options })
               conn.relayMessage(chatId ? chatId : m.chat, message.message, { messageId: message.key.id })
               return message 
           }
          // Fungsi untuk mengacak peran pemain
          function shuffleRoles() {
              const { players } = game;
              const playerIds = Object.keys(players);
              game.totalPlayers = playerIds.length;
              game.totalWerewolf = Math.floor(game.totalPlayers / 3);
              game.totalSeer = 1;
              game.totalGuardian = 1;
              game.totalVillagers = game.totalPlayers - game.totalWerewolf - game.totalSeer - game.totalGuardian;
              game.roles = [
                ...Array(game.totalWerewolf).fill('werewolf'),
                ...Array(game.totalSeer).fill('seer'),
                ...Array(game.totalGuardian).fill('guardian'),
                ...Array(game.totalVillagers).fill('villager'),
              ];
              game.roles = shuffleArray(game.roles);
              playerIds.forEach((playerId, index) => {
                game.players[playerId].role = game.roles[index];
              });
            }
           
            function shuffleArray(array) {
              let keys = Object.keys(array);
              for (let i = keys.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [keys[i], keys[j]] = [keys[j], keys[i]];
              }
              let shuffledArray;
              if (!Array.isArray(array)) {
                shuffledArray = {};
                for (let key of keys) shuffledArray[array[key].id] = array[key]; 
              } else { 
                shuffledArray = [];
                for (let key of keys) shuffledArray.push(array[key]); 
              }          
              return shuffledArray;
            }

          
            // Fungsi untuk menampilkan list pemain dalam bentuk string
            function getPlayerListString() {
              let listString = '';
              let i = 1;
              for (let playerId in game.players) {
                let player = game.players[playerId];
                listString += `${i}. @${player.id}\n`;
                i++;
              }
              return listString.trim();
            }
            
            // Fungsi untuk mencari pemain yang terpilih sebagai target voting sesi siang
            function findVotedPlayer() {
              let voteCount = {};
              for (let player of Object.values(game.players)) {
                voteCount[player.id] = player.votes;
              }
              let sortedPlayers = Object.values(game.players).sort((a, b) => {
                return b.votes - a.votes;
              });
              let tie = false;
              for (let i = 1; i < sortedPlayers.length; i++) {
                if (sortedPlayers[i].votes === votes) tie = true
              }
              let votedPlayer = sortedPlayers[0];
              console.log(votedPlayer)
              return votedPlayer;
            }
            
            // Fungsi untuk mengurutkan pemain sesuai jumlah suara yang didapatkan
            function getVotedListString() {
              let sortedPlayers = Object.values(game.players).sort((a, b) => {
                return b.votes - a.votes;
              });          
              let listString = '';
              for (let i = 0; i < sortedPlayers.length; i++) {
                let player = sortedPlayers[i];
                if (player.votes > 0) {
                    let votedPlayers = player.votedPlayers;
                    listString += `- @${player.id} *(${player.votes} votes)* `;
                    listString += '\n';
                }
              }      
              return listString.trim();
            }
            
            // Fungsi untuk menentukan tim yang menang
            function findWinner() {
              let werewolfCount = 0;
              let otherCount = 0;
              for (let playerId in game.players) {
                let player = game.players[playerId];
                if (player.role === 'werewolf') {
                  werewolfCount++;
                } else {
                  otherCount++;
                }
              }
              
              if (werewolfCount >= otherCount) {
                let teks = [
`*[ Werewolf - Game ]*

🥳 Selamat kepada tim werewolf! 
🎉 Kalian berhasil mengalahkan tim villagers!
🎮 Permainan telah selesai. Terimakasih telah bermain!`, 
`[ Werewolf - Game ]

😌 Yahhh! Tim werewolf berhasil memenangkan permainan! 🐺🔥 

🎮 Permainan telah selesai, terima kasih telah bermain bersama kami. Semoga menyenangkan! 😁`, 
`[ Werewolf - Game ]
Gila! Tim werewolf berhasil mengalahkan tim villagers! 🌙🌟 

🎮 Permainan ini sudah berakhir, terima kasih telah bergabung. Sampai jumpa di permainan selanjutnya! 🙌`,
`*[ Werewolf - Game ]*

Wahh, kemenangan untuk tim werewolf! 🐺🎉 

🎮 Permainan telah selesai, terima kasih atas kesediaan bermain bersama kami. Sampai jumpa di permainan selanjutnya!`][Math.floor(Math.random() * 3)]
                conn.sendText(game.groupId, teks, null);
                return true
              } else if (werewolfCount == 0) {
                let teks = [
`*[ Werewolf - Game ]*

🥳 Selamat kepada tim villagers! 
🎉 Kalian berhasil mengalahkan werewolf dan menyelamatkan desa kalian!
🎮 Permainan telah selesai. Terimakasih telah bermain!`, 
`[ Werewolf - Game ]*

🎮 Permainan telah selesai, dan hasilnya adalah kemenangan untuk tim villagers! Yuhuu 🎉

Terima kasih telah bermain bersama kami. 😄😄😄`, 
`*[ Werewolf - Game ]*

🎉 Horeee, tim villagers menang! Kalian telah membuktikan bahwa kalian memiliki kekuatan dan kecerdasan yang tidak terkalahkan. 🎉🎉🎉

Terima kasih telah bermain bersama kami, semoga kita bisa bermain lagi suatu saat nanti. 😍😍😍`][Math.floor(Math.random() * 3)]
                conn.sendMessageWerewolf(game.groupId, teks);
                return true
              } else {
                return false 
              }
            }


            // Fungsi untuk memulai sesi siang (voting)
            async function startDay() {
              if (game.state !== 'day') return 
              let winner = findWinner();
              if (winner) { 
              	setTimeout(endGame, 20 * 1000)
              } else { 
                game.total += 1
                // Reset semua database
                game.votes = {};
                game.werewolfKilled = [];
                game.protectedPlayer = [];
                game.villagerVoted = null;
                game.killedPlayer = [];
                game.seenPlayer = null;
                for (let player in game.players) { 
                  console.log('player', player)
                  game.players[player].votes = 0;
                  delete game.players[player].hasVoted  
                  delete game.players[player].hasChosenTarget 
                  delete game.players[player].hasSeenTarget  
                  delete game.players[player].hasProtectTarget 
                }

                game.state = 'day'; 
                let discussText = [
`*[ Werewolf - Game ]*

🌞🏡 Selamat siang, semuanya! 

📜 Berikut list pemain yang masih hidup/mati: 
${getPlayersAliveOrDead()}

🕵️‍♀️ Saatnya menguji kemampuan detektif kita. Kita cuman punya waktu ⏰ ${game.discussionDuration / 1000} detik sebelum pemungutan suara dimulai. Jadi mari gunakan waktu ini untuk menyampaikan bukti dan argumen kita. 

📆 Hari ke - ${game.total}`, 
`*[ Werewolf - Game ]*

🌞🏡 Selamat siang, semuanya! 

📜 Berikut list pemain yang masih hidup/mati: 
${getPlayersAliveOrDead()}

⏰ Waktu diskusi sebelum voting telah tiba! Siapkan strategimu dan pertimbangkan baik-baik sebelum memutuskan pemain yang akan dibunuh hari ini. Jangan lupa, kita semua adalah villagers yang bekerja sama mengalahkan werewolf 🐺

📆 Hari ke - ${game.total}`, 
`*[ Werewolf - Game ]*

🌞🏡 Selamat siang, semuanya! 

📜 Berikut list pemain yang masih hidup/mati: 
${getPlayersAliveOrDead()}

💡 Saatnya untuk berdiskusi dan memutuskan pemain yang akan dibunuh hari ini! Jangan lupa untuk mendengarkan pendapat orang lain dan memberikan alasanmu yang kuat. Kita harus bersatu untuk mengalahkan werewolf 🐺

📆 Hari ke - ${game.total}`, 
`*[ Werewolf - Game ]*

🌞🏡 Selamat siang, semuanya! 

📜 Berikut list pemain yang masih hidup/mati: 
${getPlayersAliveOrDead()}

⏳ ${game.discussionDuration / 1000} detik lagi sebelum voting dimulai! Siapkan strategimu dan pertimbangkan baik-baik sebelum memutuskan pemain yang akan dibunuh hari ini. Jangan lupa, kita harus bekerja sama untuk mengalahkan werewolf 🐺

📆 Hari ke - ${game.total}`, 
`*[ Werewolf - Game ]*

🌞🏡 Selamat siang, semuanya! 

📜 Berikut list pemain yang masih hidup/mati: 
${getPlayersAliveOrDead()}

🤔 Sudah waktunya untuk berdiskusi. Kalian memiliki waktu ${game.discussionDuration / 1000} detik untuk memutuskan pemain yang akan dibunuh hari ini. Kita harus bekerja sama untuk mengalahkan werewolf 🐺 Jangan lupa untuk mendengarkan pendapat orang lain dan memberikan alasanmu yang kuat sebelum memutuskan.

📆 Hari ke - ${game.total}`][Math.floor(Math.random() * 5)]
                let discussMessage = await conn.sendMessageWerewolf(game.groupId, discussText)
                // Setelah waktu diskusi habis, beritahukan pemain untuk mulai voting
                setTimeout(async function() {
                  game.state = 'vote' 
                  let teks = `*[ Werewolf - Game ]*
     
🚨 Waktu diskusi telah selesai! 🚨

🗳️ Voting sesi siang telah dimulai! Reply pesan ini dengan mengirim */vote <nomor pemain>* untuk memilih pemain yang akan dihukum gantung. Kalian hanya mempunyai ⏰ ${game.discussionDuration / 1000} detik untuk memilih suara.

📝 List pemain yang dapat divoting: 
${getPlayerListString()}

⚠️ *Peringatan:* Anda hanya bisa vote sekali saat voting sesi siang. Jadi pastikan pilihanmu sudah tepat sebelum mengirimkan suara.`
                  let stanzaID = await conn.sendMessageWerewolf(game.groupId, teks, { quotedMessageId: discussMessage.id._serialized })
                  game.quotedStanzaID = stanzaID.id._serialized
                  setTimeout(endDay, game.dayDuration);
                }, game.discussionDuration)
              }
            }
            
            
            async function endDay() {
              if (game.state !== 'vote') return
              let votedPlayers = Object.values(game.players).filter(player => player.votes > 0);
              let highestVotes = votedPlayers[0] ? votedPlayers[0].votes : 0;
              let tiedPlayers = votedPlayers.filter(player => player.votes === highestVotes);
              let nonVoters = Object.values(game.players).filter(player => player.votes === 0);
              let nonVotersListString = '';
              if (nonVoters.length > 1) {
                for (let i = 0; i < nonVoters.length; i++) {
                  nonVotersListString += `${i + 1}. @${nonVoters[i].id}\n`;
                }
               }
               
               // Jika ada pemain yang memiliki jumlah voting yang sama dan tertinggi
              if (tiedPlayers.length > 1) {
                let teks = `*[ Werewolf - Game ]*

Pemberian hasil voting telah selesai! 

🗳️ Berikut adalah list pemain yang memiliki jumlah voting terbanyak:
${getVotedListString()}

✖️ Pemain yang tidak ikut voting: 
${nonVotersListString}

📊 Karena terdapat jumlah voting yang sama-sama tinggi,
👤 Tidak ada pemain yang akan dibunuh.
🌙 Sepertinya hari mulai menjadi gelap.

🔥 Semangat untuk malam hari yang akan datang!`
                conn.sendMessageWerewolf(game.groupId, teks);
                game.state = 'night';
                setTimeout(startNight, 10 * 1000);
                return;
              }
              if (tiedPlayers.length == 0) {
                let teks = `*[ Werewolf - Game ]*

Pemberian hasil voting telah selesai! 

📊 Tidak ada pemain yang memberikan suara.
🗣️ Mari kita sama-sama lebih aktif dan bertanggung jawab dalam voting nanti.
🌙 Sepertinya hari mulai menjadi gelap.

🔥 Semangat untuk malam hari yang akan datang!`
                conn.sendMessageWerewolf(game.groupId, teks);
                game.state = 'night';
                setTimeout(startNight, 10 * 1000);
                return;
              }
              
              let killedPlayer = tiedPlayers[0];
              let teks = `*[ Werewolf - Game ]*

Pemberian hasil voting telah selesai! 

🗳️ Berikut adalah list pemain yang memiliki jumlah voting terbanyak:
${getVotedListString()}

✖️ Pemain yang tidak ikut voting: 
${nonVotersListString}`
              let messageResult = await conn.sendMessageWerewolf(game.groupId, teks);
              await sleep(5 * 1000)
              let messageAgain = [
`*[ Werewolf - Game ]*\n\n😱 Oh tidak, @${killedPlayer.id} telah dibunuh dengan dihukum gantung! Kamu tidak bisa melanjutkan permainan lagi. ${killedPlayer.role == 'werewolf' ? 'Tetapi' : 'Sayang sekali'}, peran dia adalah ${killedPlayer.role == 'werewolf' ? 'werewolf 🐺' : killedPlayer.role + ' 🙁'}. Sepertinya hari mulai menjadi gelap 🌙. Semangat untuk malam hari yang akan datang! 🔥`,
`*[ Werewolf - Game ]*\n\n💔 Sayang sekali, @${killedPlayer.id} telah dibunuh dengan dihukum gantung. Kamu tidak bisa melanjutkan permainan lagi. ${killedPlayer.role == 'werewolf' ? 'Tapi ternyata' : 'Ternyata'} peran dia adalah ${killedPlayer.role == 'werewolf' ? 'werewolf 🐺' : killedPlayer.role + ' yang tidak beruntung 🙁'}. Sepertinya hari mulai menjadi gelap 🌙. Semangat untuk malam hari yang akan datang! 🔥`,
`*[ Werewolf - Game ]*\n\n😢 @${killedPlayer.id} telah dibunuh dengan dihukum gantung karena memiliki jumlah voting terbanyak. ${killedPlayer.role == 'werewolf' ? 'Tapi ternyata' : 'Ternyata'} peran dia adalah ${killedPlayer.role == 'werewolf' ? 'werewolf 🐺' : killedPlayer.role + ' yang tidak beruntung 💔'}. Sepertinya hari mulai menjadi gelap 🌙. Semangat untuk malam hari yang akan datang! 🔥`][Math.floor(Math.random() * 3)] 
              conn.sendMessageWerewolf(game.groupId, messageAgain, { quotedMessageId: messageResult.id._serialized });
              let killMessage = [
"*[ Werewolf - Game ]*\n\nYahh! Kamu telah dibunuh dengan dihukum gantung 💀 Sayang sekali, permainanmu di sini sudah berakhir 💔 Tapi jangan menyerah, coba lagi di permainan berikutnya 💪🏼",
"*[ Werewolf - Game ]*\n\nGantung!!! Kamu telah terbunuh dan tidak bisa melanjutkan permainan 💀 Selamat tinggal, semoga bisa bertemu lagi di permainan berikutnya 😅",
"*[ Werewolf - Game ]*\n\nAduh, kamu tertangkap basah oleh voting terbanyak dan terpaksa harus dihukum gantung 💀 Sayang sekali, permainanmu di sini sudah berakhir 💔 Tapi jangan menyerah, coba lagi di permainan berikutnya 💪🏼",
"*[ Werewolf - Game ]*\n\nGame over! Kamu telah dibunuh dengan dihukum gantung 💀 Sayang sekali, permainanmu di sini sudah berakhir 💔 Tapi jangan menyerah, coba lagi di permainan berikutnya 💪🏼",
"*[ Werewolf - Game ]*\n\nKamu terkena imbas dari voting terbanyak dan harus dihukum gantung 💀 Sayang sekali, permainanmu di sini sudah berakhir 💔 Tapi jangan menyerah, coba lagi di permainan berikutnya 💪🏼"][Math.floor(Math.random() * 5)]
              conn.sendMessageWerewolf(killedPlayer.id, killMessage, { quotedMessageId: messageResult.id._serialized });
              delete game.players[killedPlayer.id];
              game.allPlayers[killedPlayer.id].alive = false 
              game.state = 'night';
              let winner = findWinner();
              if (winner) { 
              	setTimeout(endGame, 10 * 1000)
                  return
              }
              setTimeout(startNight, 10 * 1000);
            }

            // Fungsi untuk memulai sesi malam (aksi werewolf/seer/guardian)
            async function startNight() {
              if (game.state !== 'night') return
              let winner = findWinner();
              if (winner) { 
              	setTimeout(endGame, 10 * 1000)
                  return
              }
              game.state = 'night';
              let nightText = [
`*[ Werewolf - Game ]*

🌙 Malam telah tiba, desa semakin sepi. Sebagian telah tertidur kelelahan, sebagian masih memikirkan gebetan. (ง•‌-•‌)ง  

🌃 Pemain malam hari: kalian punya 90 detik untuk menjalankan aksimu!

Untuk pemain *werewolf/seer/guardian*, silahkan melihat pesan yang dikirim oleh bot 🤖.

Jangan lupa, selama malam hari kita harus tetap diam dan menjaga rahasia kita 🤫

Semoga malam ini kita bisa memenangkan permainan 🏆`, 
`*[ Werewolf - Game ]*

🌙 Malam hari telah tiba! Ini saatnya werewolf, seer, dan guardian melakukan tugas mereka. Semua pemain harus tenang dan membiarkan aksi terjadi. Jangan sampai terlalu terlena, ya! 💤

Untuk pemain *werewolf/seer/guardian*, silahkan melihat pesan yang dikirim oleh bot 🤖.

Jangan lupa, selama malam hari kita harus tetap diam dan menjaga rahasia kita 🤫

Semoga malam ini kita bisa memenangkan permainan 🏆`, 
`*[ Werewolf - Game ]*

🌙 Saatnya werewolf, seer, dan guardian melakukan tugas mereka! Jangan lupa, semua pemain harus tenang dan membiarkan aksi terjadi. 🌙

Untuk pemain *werewolf/seer/guardian*, silahkan melihat pesan yang dikirim oleh bot 🤖.

Jangan lupa, selama malam hari kita harus tetap diam dan menjaga rahasia kita 🤫

Semoga malam ini kita bisa memenangkan permainan 🏆`, 
`*[ Werewolf - Game ]*

🌝 Malam hari sudah datang, werewolf dan guardian harus siap untuk menjalankan tugasnya. Jangan sampai terlalu terlena, ya! 💤

Untuk pemain *werewolf/seer/guardian*, silahkan melihat pesan yang dikirim oleh bot 🤖.

Jangan lupa, selama malam hari kita harus tetap diam dan menjaga rahasia kita 🤫

Semoga malam ini kita bisa memenangkan permainan 🏆`, 
`*[ Werewolf - Game ]*

🌝 Ini saatnya *werewolf/seer/guardian* melakukan aksinya di malam hari! Jangan lupa, semua pemain harus tenang dan membiarkan aksi terjadi. 🌑

Untuk pemain *werewolf/seer/guardian*, silahkan melihat pesan yang dikirim oleh bot 🤖.

Jangan lupa, selama malam hari kita harus tetap diam dan menjaga rahasia kita 🤫

Semoga malam ini kita bisa memenangkan permainan 🏆`, 
`*[ Werewolf - Game ]*

🌒 90 detik untuk werewolf/guardian/seer akan menjalankan tugas mereka. Jangan lupa, semua pemain harus tenang dan membiarkan aksi terjadi. 🌒

Untuk pemain *werewolf/seer/guardian*, silahkan melihat pesan yang dikirim oleh bot 🤖.

Jangan lupa, selama malam hari kita harus tetap diam dan menjaga rahasia kita 🤫

Semoga malam ini kita bisa memenangkan permainan 🏆`][Math.floor(Math.random() * 6)]
              let messageNight = await conn.sendMessageWerewolf(game.groupId, nightText);
              await sleep(5 * 1000)
              for (let playerId in game.players) {
                let player = game.players[playerId];
                if ((player.role === 'werewolf' || player.role === 'seer' || player.role === 'guardian')) {
                  let listString = getPlayerListString();
                  if (player.role === 'werewolf') {
                    let teks = [
`*[ Werewolf - Game ]*

🌙 Malam hari telah tiba, waktunya untuk beraksi sebagai werewolf 🐺 Ayo lihat role pemain yang berperan sebagai werewolf! Ketik */kill <nomor pemain>* untuk membunuh pemain yang dipilih 💀.

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa membunuh satu pemain saat ini!`,
`*[ Werewolf - Game ]*

🌙 Malam hari telah tiba, waktunya untuk 🐺 Werewolf untuk menjalankan tugasnya. Gunakan command */kill <nomor pemain>* untuk membunuh pemain yang kamu pilih 💀 Siapkan strategimu dengan baik!

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa membunuh satu pemain saat ini!`,
`*[ Werewolf - Game ]*

Werewolf, saatnya kamu menunjukkan aksimu di malam hari ini 🌙 Gunakan command */kill <nomor pemain>* untuk membunuh pemain yang kamu pilih.

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa membunuh satu pemain saat ini!`,
`*[ Werewolf - Game ]*

🌃 Malam hari telah tiba, saatnya Werewolf menjalankan aksinya 🌙 Gunakan command */kill <nomor pemain>* untuk membunuh pemain yang kamu pilih.

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa menerawang satu pemain saat ini!`,
`*[ Werewolf - Game ]*

🌃 Malam hari telah tiba, waktunya Werewolf untuk menjalankan tugasnya 🌙 Gunakan command */kill <nomor pemain>* untuk membunuh pemain yang kamu pilih.

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa membunuh satu pemain saat ini!`][Math.floor(Math.random() * 5)]
                    conn.sendMessageWerewolf(player.id, teks, { quotedMessageId: messageNight.id._serialized });
                  } else if (player.role === 'seer') {
                    let teks = [
`*[ Werewolf - Game ]*

🌙 Malam hari telah tiba, waktunya untuk beraksi sebagai seer 🔮 Ayo lihat role pemain yang berperan sebagai werewolf! Ketik */see <nomor pemain>* untuk melihat perannya 🧐.

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa menerawang satu pemain saat ini!`,
`*[ Werewolf - Game ]*

🌙 Malam hari telah tiba, waktunya untuk 🔮 Seer untuk menjalankan tugasnya. Gunakan command */see <nomor pemain>* untuk mengetahui role dari pemain yang kamu pilih 🔮 Siapkan strategimu dengan baik!

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa menerawang satu pemain saat ini!`,
`*[ Werewolf - Game ]*

Seer, saatnya kamu menunjukkan kemampuanmu di malam hari ini 🌙 Gunakan command */see <nomor pemain>* untuk mengetahui role dari pemain yang kamu pilih. Berhati-hatilah dalam memilih, karena keputusanmu dapat menentukan keberlangsungan permainan 🔮

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa menerawang satu pemain saat ini!`,
`*[ Werewolf - Game ]*

🌃 Malam hari telah tiba, saatnya Seer menjalankan tugasnya 🌙 Gunakan command */see <nomor pemain>* untuk mengetahui role dari pemain yang kamu pilih. Jangan lupa, tidak semua pemain seperti yang terlihat 🔮

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa menerawang satu pemain saat ini!`,
`*[ Werewolf - Game ]*

Seer, saatnya kamu menggunakan kekuatanmu di malam hari ini 🌙 Gunakan command */see <nomor pemain>* untuk mengetahui role dari pemain yang kamu pilih. Ingatlah, setiap keputusan yang kamu ambil dapat menentukan keberlangsungan permainan 🔮

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa menerawang satu pemain saat ini!`,
`*[ Werewolf - Game ]*

🌃 Malam hari telah tiba, waktunya Seer untuk menjalankan tugasnya 🌙 Gunakan command '/see <nomor pemain>' untuk mengetahui role dari pemain yang kamu pilih. Jangan sia-siakan kesempatanmu, segera gunakan kekuatanmu untuk mengalahkan werewolf 🔮

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa menerawang satu pemain saat ini!`][Math.floor(Math.random() * 6)]
                    conn.sendMessageWerewolf(player.id, teks, { quotedMessageId: messageNight.id._serialized });
                  } else if (player.role === 'guardian') {
                    let teks = [
`*[ Werewolf - Game ]*

🌙 Malam hari telah tiba, waktunya untuk beraksi sebagai guardian 👼 Ayo lindungi pemain yang berperan sebagai villagers/seer! Ketik */protect <nomor pemain>* untuk melindunginya 🛡️.

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa melindungi satu pemain saat ini!`,
`*[ Werewolf - Game ]*

🌙 Malam hari telah tiba, waktunya untuk 👼 Guardian untuk menjalankan tugasnya. Gunakan command */protect <nomor pemain>* untuk melindungi pemain yang kamu pilih 🔮 Siapkan strategimu dengan baik!

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa melindungi satu pemain saat ini!`,
`*[ Werewolf - Game ]*

Guardian, saatnya kamu menunjukkan kemampuanmu di malam hari ini 🌙 Gunakan command */see <nomor pemain>* untuk melindungi pemain yang kamu pilih. Berhati-hatilah dalam memilih, karena keputusanmu dapat menentukan keberlangsungan permainan 👼

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa melindungi satu pemain saat ini!`,
`*[ Werewolf - Game ]*

🌃 Malam hari telah tiba, saatnya Guardian menjalankan tugasnya 🌙 Gunakan command */see <nomor pemain>* untuk melindungi pemain yang kamu pilih. Jangan sampai kamu melindungi pemain werewolf 💀

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa melindungi satu pemain saat ini!`,
`*[ Werewolf - Game ]*

Guardian, saatnya kamu melindungi pemain di malam hari ini 🌙 Gunakan command */protect <nomor pemain>* untuk melindungi pemain yang kamu pilih. Ingatlah, setiap keputusan yang kamu ambil dapat menentukan keberlangsungan permainan 👼

📜 List pemain yang dapat dipilih:
${listString}

⚠️ *Ingat*, kamu hanya bisa melindungi satu pemain saat ini!`][Math.floor(Math.random() * 5)]
                    conn.sendMessageWerewolf(player.id, teks, { quotedMessageId: messageNight.id._serialized });
                  }
                }
              }
              setTimeout(endNight, game.nightDuration);
            }

            function endNight() {
          	if (game.state !== 'night') return console.log('oi')
              game.state = 'day';
              let killedPlayers = game.killedPlayer;
              let protectedPlayers = game.protectedPlayer;
              let killedPlayerList = [];
              let protectedPlayerList = [];
              for (let killedPlayer of killedPlayers) {
                if (protectedPlayers.length > 0) { 
                  for (let protectedPlayer of protectedPlayers) {
                    if (protectedPlayer.id == killedPlayer.id) protectedPlayerList.push(killedPlayer.id);
                  }
                  conn.sendMessageWerewolf(killedPlayer.id, `*[ Werewolf - Game ]*

🎉 Wow, selamat @${killedPlayer.id}! 

😅 Kamu hampir terbunuh oleh werewolf tapi ternyata kamu dilindungi oleh guardian. Kamu masih bisa melanjutkan permainan dengan selamat ??

☀️ Siang hari hampir tiba, siapkan strategimu untuk mengalahkan werewolf 🐺`);
                } else {          
                  if (killedPlayer.role !== 'werewolf') {
                    conn.sendMessageWerewolf(killedPlayer.id, '*[ Werewolf - Game ]*\n\n😔 Yahh, Anda telah terbunuh oleh werewolf dan tidak bisa melanjutkan permainan. 🙏');
                    game.allPlayers[killedPlayer.id].alive = false
                    delete game.players[killedPlayer.id];
                    killedPlayerList.push(killedPlayer.id);
                  }
                }
              }
              
              let killedPlayerString = killedPlayerList.join(', @');
              let protectedPlayerString = protectedPlayerList.join(', @');
              if (killedPlayerList.length > 0) {
                if (protectedPlayerList.length == 0) {
                  let teks = `*[ Werewolf - Game ]*

🌅 Pagi hari sudah tiba! 
🌙 Pada saat malam hari saat itu,

🐺 Tiba-tiba pemain @${killedPlayerString} dibunuh oleh werewolf. 

👤 Peran dari pemain @${killedPlayer.id} adalah ${killedPlayer.role}.

⛅ Matahari hampir tepat diatas kita, silahkan bersiap - siap pada siang hari yang akan datang!

📆 Hari ke - ${game.total}`
                  conn.sendMessageWerewolf(game.groupId, teks);
                } else {
                  let teks = `*[ Werewolf - Game ]*

🌅 Pagi hari sudah tiba! 
🌙 Pada saat malam hari saat itu,

👤 Tiba-tiba pemain @${killedPlayerString} dibunuh oleh werewolf. 

👤 Peran dari pemain @${killedPlayer.id} adalah ${killedPlayer.role}.

🛡️ Tetapi terdapat pemain @${protectedPlayerString} yang berhasil diselamatkan oleh guardian.

⛅ Matahari hampir tepat diatas kita, silahkan bersiap - siap pada siang hari yang akan datang!

📆 Hari ke - ${game.total}`
                  conn.sendMessageWerewolf(game.groupId, teks);
                }	
              } else {
                let teks = `*[ Werewolf - Game ]*

🌅 Pagi hari sudah tiba! 
🌙 Pada saat malam hari saat itu,
👤 Tidak ada pemain yang dibunuh oleh werewolf.

⛅ Matahari hampir tepat diatas kita, silahkan bersiap - siap pada siang hari yang akan datang!

📆 Hari ke - ${game.total}`
                conn.sendMessageWerewolf(game.groupId, teks);
              }
              let winner = findWinner();
              if (winner) { 
              	setTimeout(endGame, 10 * 1000)
                  return
              } else setTimeout(startDay, 10 * 1000);
            }
            
            function getPlayersAliveOrDead() {
              let players = Object.values(game.allPlayers);
              let message = '';
              for (let i = 0; i < players.length; i++) {
                let status = players[i].alive ? '🍃 Hidup' : `💀 Mati (${players[i].role})`;
                message += `${i + 1}. @${players[i].id} - ${status}\n`
              }
              return message.trim();
            }

            // Fungsi untuk memulai game
            function startGame() {
              game.state = 'day';
              shuffleRoles();
              game.allPlayers = Object.assign({}, game.players)
              for (let playerId in game.players) {
                let player = game.players[playerId];
                let message = `*[ Werewolf - Game ]*\n\n👋 Halo, role kamu adalah *${player.role}* ${player.role == 'werewolf' ? '🐺' : player.role == 'seer' ? '🔮' : player.role == 'guardian' ? '💂' : '👤'}. \n`;
                if (player.role === 'werewolf') {
                  message += `\nTugas kamu adalah membunuh pemain lain selama malam hari. Saat malam hari kamu dapat membunuh pemain lain dengan mengetik */kill <nomor pemain>*.`;
                } else if (player.role === 'seer') {
                  message += `\nTugas kamu adalah melihat peran pemain lain selama malam hari. Saat malam hari kamu dapat melihat peran pemain lain dengan mengetik */see <nomor pemain>*.`;
                } else if (player.role === 'guardian') {
                  message += ` \nTugas kamu adalah melindungi pemain lain selama malam hari. Saat malam hari kamu dapat melindungi pemain lain dengan mengetik */protect <nomor pemain>*.`;
                } else {
                  message += `\nTugas kamu adalah membantu tim villagers menang dengan melakukan voting pada sesi siang. Saat sesi siang kamu dapat melakukan voting dengan mengetik */vote <nomor pemain>*.`;
                }
                conn.sendMessageWerewolf(player.id, message);
              }
              setTimeout(startDay, 5 * 1000);
            }

            // Fungsi untuk mengakhiri permainan
            function endGame() {
              conn.sendMessageWerewolf(game.groupId, `Permainan telah selesai. Terima kasih telah bermain!`);

              // Hapus semua data permainan 
              game.players = {}
              game.votes = {}
              game.roles = []
              game.werewolfKilled = [] 
              game.protectedPlayer = []
              game.killedPlayer = []
              game.villagerVoted = null 
              game.seenPlayer = null
              game.totalPlayers = 0 
              game.totalWerewolf = 0 
              game.totalSeer = 0
              game.totalGuardian = 0 
              game.totalVillagers = 0
              game.total = 1
              game.state = 'lobby' 
              delete game.allPlayers

            } 

            if ((game.state !== 'waiting') && game.players[m.sender] && game.players[m.sender].alive) {
            	let player = game.players[m.sender]
            	if (body.startsWith('/vote') && game.state == 'vote' ) {
                	if (player.hasVoted) return conn.sendMessageWerewolf(m.chat, 'Maaf, kamu sudah mem-voting pemain saat ini.'); 
                    if (!(game.quotedStanzaID == quoted.id._serialized)) return conn.sendMessageWerewolf(game.groupId, `Hmm, sepertinya @${player.id} tidak mereply pesan atas (yang saya reply). Silahkan mengirim ulang command anda dengan mereply pesan diatas.`, { quotedMessageId: game.quotedStanzaID })
                    let votedPlayerIndex = text;
                    if (isNaN(votedPlayerIndex) || votedPlayerIndex < 1 || votedPlayerIndex > Object.values(game.players).length) return conn.sendMessageWerewolf(m.chat, 'Nomor array pemain yang Anda masukkan tidak valid.');
                    let votedPlayer = Object.values(game.players)[votedPlayerIndex - 1];
                    votedPlayer.votes += 1;
                    let votedListString = getVotedListString();
                    player.hasVoted = true;
                    let teks = `*[ Werewolf - Game ]*
     
🗳️ Terimakasih atas pilihanmu! 
Kamu telah vote kepada pemain @${votedPlayer.id}.

📊 Hasil voting sementara:
${getVotedListString()}

📣 Ingat, kamu hanya bisa memberikan suara sekali saja dalam setiap sesi voting!`
                    conn.sendMessageWerewolf(player.id, teks, { quoted: m });
                } 
                
                if (body.startsWith('/kill') && !m.isGroup) {
                	if (game.state !== 'night') return conn.sendMessageWerewolf(m.chat, 'Sesi malam belum dimulai atau sudah selesai.');
                    if (player.role !== 'werewolf') return conn.sendMessageWerewolf(m.chat, 'Anda bukan werewolf.');
                    if (player.hasChosenTarget) return conn.sendMessageWerewolf(m.chat, 'Anda sudah memilih target pembunuhan.');  
                    // Jika pemain belum memilih target pembunuhan 
                    let targetIndex = parseInt(text) - 1;
                    let targetPlayer = Object.values(game.players)[targetIndex];
                    if (isNaN(targetIndex) || !targetPlayer) return conn.sendMessageWerewolf(playerId, 'Nomor yang anda berikan tidak ada dalam list pemain.', { quoted: m });
                    
                    player.hasChosenTarget = true;
                    game.killedPlayer.push(targetPlayer);
                    let teks = `*[ Werewolf - Game ]*
     
👤 Kamu memilih untuk membunuh @${targetPlayer.id}.
📣 Ingat, kamu hanya bisa membunuh pemain sekali saja!`
                    conn.sendMessageWerewolf(m.chat, teks, { quoted: m });
                } else if (body.startsWith('/see') && !m.isGroup) {
                	if (game.state !== 'night') return conn.sendMessageWerewolf(m.chat, 'Sesi malam belum dimulai atau sudah selesai.');
                    if (player.role !== 'seer') return conn.sendMessageWerewolf(m.chat, 'Anda bukan seer.');
                    if (player.hasSeenTarget) return conn.sendMessageWerewolf(m.chat, 'Anda sudah memilih target penerawangan.');  
                    // Jika pemain belum memilih target diterawang 
                    let seenIndex = parseInt(text) - 1;
                    let seenPlayer = Object.values(game.players)[seenIndex];
                    if (isNaN(seenIndex) || !seenPlayer) return conn.sendMessageWerewolf(playerId, 'Nomor yang anda berikan tidak ada dalam list pemain.', { quoted: m });
                    
                    player.hasSeenTarget = true;
                    game.seenPlayer = seenPlayer;
                    let teks = `*[ Werewolf - Game ]*
     
👤 Kamu memilih untuk menerawang @${seenPlayer.id}.
🔮 Peran pemain @${seenPlayer.id} adalah ${seenPlayer.role}.
📣 Ingat, kamu hanya bisa menerawang pemain sekali saja!`
                    conn.sendMessageWerewolf(m.chat, teks, { quoted: m });
                } else if (body.startsWith('/protect') && !m.isGroup) {
                	if (game.state !== 'night') return conn.sendMessageWerewolf(m.chat, 'Sesi malam belum dimulai atau sudah selesai.');
                    if (player.role !== 'guardian') return conn.sendMessageWerewolf(m.chat, 'Anda bukan guardian.');
                    if (player.hasProtectTarget) return conn.sendMessageWerewolf(m.chat, 'Anda sudah memilih target perlindungan.');  
                    // Jika pemain belum memilih target dilindungi 
                    let protectedIndex = parseInt(text) - 1;
                    let protectedPlayer = Object.values(game.players)[protectedIndex];
                    if (isNaN(protectedIndex) || !protectedPlayer) return conn.sendMessageWerewolf(playerId, 'Nomor yang anda berikan tidak ada dalam list pemain.', { quoted: m }); 
                    
                    player.hasProtectTarget = true;
                    game.protectedPlayer.push(protectedPlayer);
                    let teks = `*[ Werewolf - Game ]*
     
👤 Kamu memilih untuk melindungi @${protectedPlayer.id}.
📣 Ingat, kamu hanya bisa melindungi pemain sekali saja!`
                    conn.sendMessageWerewolf(m.chat, teks, { quoted: m });
                }
            }


        }
    } catch (e) {
        console.error(e)
    }
}

global.reloadFile(__filename)