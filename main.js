
process.on('uncaughtException', console.error)
require('./config')
const {
  generateWAMessageFromContent,
  proto
} = require('@adiwajshing/baileys')
const {
  formatJSON,
  getRandom,
  fetchBuffer,
  fetchURL,
  checkURL,
  runtime,
  formatp,
  sleep,
  pickRandom,
  generateImage, 
  shuffleArray
} = require("./lib/function")
const Ikky = require("ikyy")
const moment = require("moment-timezone")
const {
  exec,
  spawn
} = require("child_process")
const {
  serialize
} = require("./lib/simple")
const {
  webp2mp4File,
  UploadFileUgu,
  TelegraPh,
  Top4top
} = require("./lib/uploader")
const {
  Aki
} = require("aki-api")
const bochil = require('@bochilteam/scraper')
const speed = require('performance-now')
const similarity = require("similarity")
const fileww = require('./lib/werewolf')
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

module.exports = async (conn, m, message, store) => {
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
    const cpu = cpus.reduce((last, cpu, _, {
      length
    }) => {
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
    
    if (body.startsWith(prefix)) {
      console.log(chalk.red('~') + '>', 
        '[ ' + chalk.greenBright(time) + ' ]', '-', 
        '"' + chalk.greenBright(m.isGroup ? 'Group' : 'Private') + '"', '=', 
        chalk.greenBright(command), 'from', 
        chalk.greenBright(m.sender.split`@`[0]), 'in args:', 
        chalk.greenBright(args.length)
      )
    }

    if (m.mtype == 'reactionMessage' && m.msg.key.id == game.quotedReactID) {
      if (message.reaction == '🐺') {
        if (Object.keys(game.players).length > game.maximumPlayers) return conn.sendMessage(message.id.remote, `Jumlah pemain dalam room terdapat 32 pemain! Anda tidak dapat bergabung. Jika anda Moderator, silahkan ketik /start-ww`);
        let player = game.players[message.senderId];
        if (player) return conn.sendTextWithMentions(m.chat, `@${m.sender} sudah terdaftar di game ini.\n\n📜 List pemain yang bergabung:\n${getPlayerListString ()}`);
        // Jika belum terdaftar, daftarkan pemain ke database
        game.players[message.senderId] = {
          id: message.senderId,
          alive: true,
          votes: 0
        };
        conn.sendTextWithMentions(m.chat, `*[ Werewolf - Game ]*\n\n📜 List pemain yang bergabung:\n${getPlayerListString ()}\n\nKamu telah berhasil didaftarkan di game ini. ${Object.keys(game.players).length >= game.minimumPlayers ? 'Permainan ini dapat dimulai, ketik /start-ww untuk memulai permainan.' : 'Permainan ini tak dapat dimulai, karena pemain yang bergabung kurang dari 5.'}`);
      } else if (message.reaction = '') {
        delete game.players[message.senderId]
      }
    }
    
    if ((game.state !== 'waiting') && game.players[m.sender] && game.players[m.sender].alive) { 
      let player = game.players[m.sender] 
      if (budy.startsWith('/vote') && game.state == 'vote') { 
        if (player.hasVoted) return conn.sendMessageWerewolf(m.chat, 'Maaf, kamu sudah mem-voting pemain saat ini.'); 
        if (!(game.quotedStanzaID == quoted.msg.key.id)) return conn.sendMessageWerewolf(game.groupId, `Hmm, sepertinya @${player.id} tidak mereply pesan atas (yang saya reply). Silahkan mengirim ulang command anda dengan mereply pesan diatas.`, { 
          quoted: game.quotedStanzaID 
        }) 
        let votedPlayerIndex = text; 
        if (isNaN(votedPlayerIndex) || votedPlayerIndex < 1 || votedPlayerIndex > Object.values(game.players).length) return conn.sendMessageWerewolf(m.chat, 'Nomor array pemain yang Anda masukkan tidak valid.'); 
        let votedPlayer = Object.values(game.players)[votedPlayerIndex - 1]; 
        votedPlayer.votes += 1; 
        player.hasVoted = true; 
        let votedListString = getVotedListString(); 
        conn.sendMessageWerewolf(m.chat, `*[ Werewolf - Game ]*\n\n🗳️ Terimakasih atas pilihanmu! \nKamu telah vote kepada pemain @${votedPlayer.id}.\n\n📊 Hasil voting sementara:\n${getVotedListString()}\n\n📣 Ingat, kamu hanya bisa memberikan suara sekali saja dalam setiap sesi voting!`, { quoted: m })
      }
 
      if (budy.startsWith('/kill') && !m.isGroup) { 
        if (game.state !== 'night') return conn.sendMessageWerewolf(m.chat, 'Sesi malam belum dimulai atau sudah selesai.'); 
        if (player.role !== 'werewolf') return conn.sendMessageWerewolf(m.chat, 'Anda bukan werewolf.'); 
        if (player.hasChosenTarget) return conn.sendMessageWerewolf(m.chat, 'Anda sudah memilih target pembunuhan.'); 

        let targetIndex = parseInt(text) - 1; 
        let targetPlayer = Object.values(game.players)[targetIndex]; 
        if (isNaN(seenIndex) || !seenPlayer) return conn.sendMessageWerewolf(playerId, 'Nomor yang anda berikan tidak ada dalam list pemain.', { quoted: m })
 
        player.hasChosenTarget = true; 
        game.killedPlayer.push(targetPlayer); 
        conn.sendMessageWerewolf(m.chat, `*[ Werewolf - Game ]*\n\n👤 Kamu memilih untuk membunuh @${targetPlayer.id}.\n📣 Ingat, kamu hanya bisa membunuh pemain sekali saja!`, { quoted: m })
      } else if (budy.startsWith('/see') && !m.isGroup) { 
        if (game.state !== 'night') return conn.sendMessageWerewolf(m.chat, 'Sesi malam belum dimulai atau sudah selesai.'); 
        if (player.role !== 'seer') return conn.sendMessageWerewolf(m.chat, 'Anda bukan seer.'); 
        if (player.hasSeenTarget) return conn.sendMessageWerewolf(m.chat, 'Anda sudah memilih target penerawangan.'); 
        
        let seenIndex = parseInt(text) - 1; 
        let seenPlayer = Object.values(game.players)[seenIndex]; 
        if (isNaN(seenIndex) || !seenPlayer) return conn.sendMessageWerewolf(playerId, 'Nomor yang anda berikan tidak ada dalam list pemain.', { quoted: m })
 
        player.hasSeenTarget = true; 
        game.seenPlayer = seenPlayer; 
        conn.sendMessageWerewolf(m.chat, `*[ Werewolf - Game ]*\n👤 Kamu memilih untuk menerawang @${seenPlayer.id}.\n🔮 Peran pemain @${seenPlayer.id} adalah ${seenPlayer.role}.\b📣 Ingat, kamu hanya bisa menerawang pemain sekali saja!`, { quoted: m })
      } else if (budy.startsWith('/protect') && !m.isGroup) { 
        if (game.state !== 'night') return conn.sendMessageWerewolf(m.chat, 'Sesi malam belum dimulai atau sudah selesai.'); 
        if (player.role !== 'guardian') return conn.sendMessageWerewolf(m.chat, 'Anda bukan guardian.'); 
        if (player.hasProtectTarget) return conn.sendMessageWerewolf(m.chat, 'Anda sudah memilih target perlindungan.'); 
        
        let protectedIndex = parseInt(text) - 1; 
        let protectedPlayer = Object.values(game.players)[protectedIndex]; 
        if (isNaN(seenIndex) || !seenPlayer) return conn.sendMessageWerewolf(playerId, 'Nomor yang anda berikan tidak ada dalam list pemain.', { quoted: m })
 
        player.hasProtectTarget = true; 
        game.protectedPlayer.push(protectedPlayer); 
        conn.sendMessageWerewolf(m.chat, `*[ Werewolf - Game ]*\n👤 Kamu memilih untuk melindungi @${protectedPlayer.id}.\n📣 Ingat, kamu hanya bisa melindungi pemain sekali saja!`, { quoted: m })
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
        if (m.chat !== game.groupId) return m.reply('Perintah hanya dapat digunakan di grup (https://chat.whatsapp.com/FIdMh612Iru1ZQgrXLp8KN)')
        if (!m.isGroup) return global.mess("group", m)
        if (game.state !== 'lobby') return conn.sendMessage(m.chat, game.state == 'waiting' ? 'Silahkan mereaksi 🐺 pesan itu untuk bergabung dalam permainan.' : 'Game sudah dimulai. Anda tidak dapat lagi bergabung.', game.state == 'waiting' ? game.quotedReactID : '')
        game.state = 'waiting'
        let reactID = await conn.sendTextWithMentions(m.chat, `Permainan telah berhasil dibuat. Silahkan me-reaksi pesan ini dengan emoji 🐺`, m)
        game.quotedReactID = reactID.msg.key.id
      }
      break
      case "/startgame": {
        if (m.chat !== game.groupId) return
        if (!m.isGroup) return global.mess("group", m)
        if (!isCreator) return m.reply('Anda bukan moderator.')
        if (game.state !== 'waiting') return m.reply('Game sudah dimulai atau sedang dalam proses.');
        if (Object.keys(game.players).length < game.minimumPlayers) return conn.sendMessage(m.chat, `Belum terdapat minimal ${game.minimumPlayers - Object.keys(game.players).length} pemain yang dibutuhkan untuk memulai game.\n\n📜 List pemain yang bergabung:\n${getPlayerListString ()}`);
        let shufflePlayers = shuffleArray(game.players)
        game.players = shufflePlayers
        conn.sendText(m.chat, '*[ Werewolf - Game ]*\n\nBerhasil memulai permainan. Silahkan melihat chat pribadi bot masing-masing untuk melihat role yang didapatkan. 🐺💂🔮', m)
        setTimeout(startGame, 5 * 1000);
      }
      break;
      case "listplayers": {
        if (game.state == 'waiting') return m.reply('Game belum dimulai');
        conn.sendTextWithMentions(m.chat, `*[ Werewolf - Game ]*\n\n📝 Berikut ini adalah list semua pemain:\n${getPlayersAliveOrDead()}`)
      }
      break;
      case "/endgame": {
        if (game.state == 'waiting') return conn.sendMessage(m.chat, 'Game belum dimulai');
        endGame()
      }
      break

      // Main Menu
      case prefix + "owner": {
        conn.sendContact(m.chat, global.owner, true)
      }
      break
      case prefix + "ping":
      case prefix + "status":
      case prefix + "info": {
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
      case prefix + "help":
      case prefix + "list":
      case prefix + "menu": {
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
▸ /startgame
▸ /endgame
▸ /listplayers

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
▸ /akinator
▸ /start 
▸ /next
▸ /leave

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
          ['https://chat.whatsapp.com/FIdMh612Iru1ZQgrXLp8KN', 'Group Support']
        ], [], [
          ['#ping', 'Info Bot'],
          ['#donate', 'Donate']
        ], m, { asLocation: true })
      }
      break

      // Developer Commands 
      case prefix + "block": {
        if (!isCreator) return global.mess("owner", m)
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        await conn.updateBlockStatus(users, 'block').then((res) => m.reply(formatJSON(res))).catch((err) => m.reply(formatJSON(err)))
      }
      break
      case prefix + "unblock": {
        if (!isCreator) return global.mess("owner", m)
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        await conn.updateBlockStatus(users, 'unblock').then((res) => m.reply(formatJSON(res))).catch((err) => m.reply(formatJSON(err)))
      }
      break
      case prefix + "bc":
      case prefix + "bcgc":
      case prefix + "broadcastgroup":
      case prefix + "broadcast": {
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
      case prefix + "join": {
        if (!isCreator) return global.mess("owner", m)
        if (!text) return m.reply(`Kirim perintah *${command}* query`)
        if (!checkURL(text)) return m.reply(`Kirim perintah *${command}* query`)
        if (!text.includes('chat.whatsapp.com')) return m.reply(`URL harus *chat.whatsapp.com* link.`)
        let query = text.split('https://chat.whatsapp.com/')[1]
        await conn.groupAcceptInvite(query).then(v => m.reply(v))
      }
      break

      // Group Commands
      case prefix + "pengumuman":
      case prefix + "announce":
      case prefix + "hidetag":
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
        }), text || quoted.text, botNumber, {
          contextInfo: {
            mentionedJid: users
          },
          mentions: users
        })
        await conn.relayMessage(m.chat, msg.message, {
          messageId: msg.key.id
        })
      }
      break
      case prefix + "liston":
      case prefix + "listonline": {
        if (!m.isGroup) return global.mess("group", m)
        if (!(isAdmin || isCreator)) return global.mess("admin", m)
        let id = args && /\d+\-\d+@g.us/.test(text) ? text : m.chat
        let online = [...Object.keys(store.presences[id]), botNumber]
        conn.sendTextWithMentions(m.chat, 'List Online:\n\n' + online.map(v => '▸ @' + v.replace(/@.+/, '')).join`\n`, m)
      }
      break

      // Other Commands
      case prefix + "listgc": {
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
      case prefix + "listblock": {
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
        if (m.isGroup) return global.mess("private", m)
        let room = Object.values(this.anonymous).find(room => room.check(m.sender))
        if (!room) return m.reply(`Kamu tidak sedang berada di dalam anonymous chat\nKetik */start* untuk mencari partner chat!`)
        m.reply(`Berhasil meninggalkan partner chat.`)
        let other = room.other(m.sender)
        if (other) conn.sendMessage(other, `Partner meninggalkan chat.\nKetik */start* untuk mencari partner chat.`)
        delete this.anonymous[room.id]
        if (command === '/leave') break
      }
      case '/start': {
        if (m.isGroup) return global.mess("private", m)
        if (Object.values(this.anonymous).find(room => room.check(m.sender))) return m.reply(`Kamu masih berada di dalam anonymous chat\nKetik */next* untuk melewati partner chat!\nKetik */leave* untuk meninggalkan partner chat!`)
        let room = Object.values(this.anonymous).find(room => room.state === 'WAITING' && !room.check(m.sender))
        if (room) {
          conn.sendMessage(room.a, `Partner telah ditemukan.\nKetik */next* untuk melewati partner chat.\nKetik */leave* untuk meninggalkan partner chat.`)
          room.b = m.sender
          room.state = 'CHATTING'
          m.reply(`Partner telah ditemukan.\nKetik */next* untuk melewati partner chat.\nKetik */leave* untuk meninggalkan partner chat.`)
        } else {
          let id = +new Date
          this.anonymous[id] = {
            id,
            a: m.sender,
            b: '',
            state: 'WAITING',
            check: function(who = '') {
              return [this.a, this.b].includes(who)
            },
            other: function(who = '') {
              return who === this.a ? this.b : who === this.b ? this.a : ''
            },
          }
          m.reply(`Silahkan tunggu sebentar untuk mencari partner. Ketik *${prefix}leave* untuk meninggalkan anonymous chat!`)
        }
      }
      break
      case '/akinator': {
        if (m.isGroup) return global.mess("private", m)
        if (m.sender in this.akinator) return m.reply('Kamu sedang ada sesi akinator.')
        this.akinator[m.sender] = {
          aki: new Aki({
            region: 'id',
            childMode: false,
            proxy: undefined
          }),
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
      case prefix + 'play': {
        if (!text) return m.reply(`Kirim perintah *${command}* query`)
        let url = await yts(text)
        if (!url) return m.reply("Video tidak ditemukan!")
        let data = await bochil.youtubedlv2(url.all[0].url).catch((e) => {
          return m.reply(`Terjadi kesalahan\n\n${e}`)
        })
        let { title, thumbnail, audio } = data
        let { quality, fileSizeH, fileSize, download } = audio['128kbps']
        let teks = `Berhasil mendapatkan data.\n`
        teks += `▸ *Judul:* ${title}\n`
        teks += `▸ *Kualitas:* 128kbps\n`
        teks += `▸ *Ukuran file:* ${fileSizeH}\n`
        if (fileSize > 100000) {
          teks += `Ukuran file lebih dari 100 MB (Batas >= 100 MB)`
          return conn.sendImage(m.chat, thumbnail, teks, m)
        } else teks += `Tunggu bentar, file lagi dikirim segera.`
        let media = await download()
        conn.sendImage(m.chat, thumbnail, teks, m)
        conn.sendFile(m.chat, media, title, m)
      }
      break
      case prefix + 'mp3':
      case prefix + 'ytmp3': {
        if (!text) return m.reply(`Kirim perintah *${command}* url`)
        if (!(text.includes("youtu.be") || text.includes("youtube.com"))) return m.reply(`URL harus *youtube.com* atau *youtu.be* link.`)
        let url = checkURL(text)[0].replace('youtube.com', 'youtu.be').replace('/shorts', '').replace('?feature=share', '').replace('watch?v=', '')
        let data = await bochil.youtubedlv2(url).catch((e) => {
          return m.reply(`Terjadi kesalahan\n\n${e}`)
        })
        let { title, thumbnail, audio } = data
        let { quality, fileSizeH, fileSize, download } = audio['128kbps']
        let teks = `Berhasil mendapatkan data.\n`
        teks += `▸ *Judul:* ${title}\n`
        teks += `▸ *Kualitas:* 128kbps\n`
        teks += `▸ *Ukuran file:* ${fileSizeH}\n`
        if (fileSize > 100000) {
          teks += `Ukuran file lebih dari 100 MB (Batas >= 100 MB)`
          return conn.sendImage(m.chat, thumbnail, teks, m)
        } else teks += `Tunggu bentar, file lagi dikirim segera.`
        let media = await download()
        conn.sendImage(m.chat, thumbnail, teks, m)
        conn.sendFile(m.chat, media, title, m)
      }
      break
      case prefix + 'mp4':
      case prefix + 'ytmp4': {
        if (!text) return m.reply(`Kirim perintah *${command}* url`)
        if (!(text.includes("youtu.be") || text.includes("youtube.com"))) return m.reply(`URL harus *youtube.com* atau *youtu.be* link.`)
        let url = checkURL(text)[0].replace('youtube.com', 'youtu.be').replace('/shorts', '').replace('?feature=share', '').replace('watch?v=', '')
        let data = await bochil.youtubedlv2(url).catch((e) => {
          return m.reply(`Terjadi kesalahan\n\n${e}`)
        })
        let { title, thumbnail, video } = data
        let { quality, fileSizeH, fileSize, download } = video['360p'] || video['480p']
        let teks = `Berhasil mendapatkan data.\n`
        teks += `▸ *Judul:* ${title}\n`
        teks += `▸ *Kualitas:* 360p\n`
        teks += `▸ *Ukuran file:* ${fileSizeH}\n`
        if (fileSize > 100000) {
          teks += `Ukuran file lebih dari 100 MB (Batas >= 100 MB)`
          return conn.sendImage(m.chat, thumbnail, teks, m)
        } else teks += `Tunggu bentar, file lagi dikirim segera.`
        let media = await download()
        conn.sendImage(m.chat, thumbnail, teks, m)
        conn.sendFile(m.chat, media, title, m)
      }
      break
      case prefix + 'mediafire': {
        if (!text) return m.reply(`Kirim perintah *${command}* url`)
        if (!text.includes("mediafire.com")) return m.reply(`URL harus *mediafire.com* link.`)
        global.mess("wait", m)
        let data = await bochil.mediafiredl(checkURL(text)[0]).catch((e) => {
          return m.reply(`Terjadi kesalahan.\n\n${e}`)
        })
        let teks = `▣ Mediafire Download\n`
        teks += `▸ *Judul file:* ${data.filename}\n`
        teks += `▸ *Tipe file:* ${data.filetype}\n`
        teks += `▸ *Ekstensi:* ${data.ext}\n`
        teks += `▸ *Upload:* ${data.aploud}\n`
        teks += `▸ *Ukuran file:* ${data.filesizeH}\n`
        teks += `Tunggu bentar, file lagi dikirim segera.`
        if (filesize > 100000) {
          teks += `Ukuran file lebih dari 100 MB (Batas >= 100 MB)`
          return conn.sendMessage(m.chat, teks, {
            quoted: m.msg.key.id
          })
        } else teks += `Tunggu bentar, file lagi dikirim segera.`
        conn.sendText(m.chat, teks, m)
        conn.sendFile(m.chat, data.url, data.filename, m, { asDocument: true })
      }
      break
      case prefix + 'instagram': {
        if (!text) return m.reply(`Kirim perintah *${command}* url`)
        if (!text.includes("instagram.com")) return m.reply(`URL harus *instagram.com* link.`)
        let data = await bochil.instagramdlv2(checkURL(text)[0]).catch((e) => {
          return m.reply(`Terjadi kesalahan.\n\n${e}`)
        })
        for (let i of data) conn.sendFile(m.sender, i.url, 'Instagram Downloader', m)
      }
      break
      case prefix + 'tiktoknowm':
      case prefix + 'tiktok': {
        if (!text) return m.reply(`Kirim perintah *${command}* url`)
        if (!text.includes("tiktok.com")) return m.reply(`URL harus *tiktok.com* link.`)
        let { video } = await bochil.tiktokdlv3(checkURL(text)[0]).catch((e) => {
          return m.reply(`Terjadi kesalahan\n\n${e}`)
        })
        conn.sendFile(m.chat, video.no_watermark, 'Tiktok Downloader', m)
      }
      break

      // Convert and Media 
      case prefix + "s":
      case prefix + "sgif":
      case prefix + "swm":
      case prefix + "stickergif":
      case prefix + "stickerwm":
      case prefix + "sticker": {
        if (!quoted) return m.reply(`Reply foto/video dengan caption *${command}*`)
        let [authors, packnames] = text.split`|`
        if (/image/.test(mime)) {
          let media = await conn.downloadMediaMessage(quoted)
          let encmedia = await conn.sendImageAsSticker(m.chat, media, m, {
            packname: packnames ? packnames : global.packname,
            author: authors ? authors : global.author
          })
          await fs.unlinkSync(encmedia)
        } else if (/video/.test(mime)) {
          if ((quoted.msg || quoted).seconds > 11) return m.reply(`Max 10 seconds.`)
          let media = await conn.downloadMediaMessage(quoted)
          let encmedia = await conn.sendVideoAsSticker(m.chat, media, m, {
            packname: packnames ? packnames : global.packname,
            author: authors ? authors : global.author
          })
          await fs.unlinkSync(encmedia)
        } else m.reply(`Reply foto/video dengan caption *${command}*`)
      }
      break
      case prefix + "toimg":
      case prefix + "tovid":
      case prefix + "tovideo":
      case prefix + "toimage": {
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
          await conn.sendVideo(m.chat, result, 'Convert Sticker to Video', m)
          await fs.unlinkSync(media)
        }
      }
      break 
      case prefix + "toaudio":
      case prefix + "tomp3": {
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
      default:
        if (m.sender in this.akinator) {
      	let aki = this.akinator[m.sender].aki
          if (aki.progress >= 70 || aki.currentStep >= 78) {
            await aki.win().catch(e => delete this.akinator[m.sender]);
            delete this.akinator[m.sender]
            let thumbnail = await getBuffer(aki.answers[0].absolute_picture_path)
            teks = `Akinator selesai.\n`
            teks += `Mungkin karakter anda:\n`
            teks += `*Karakter:* ${aki.answers[0].name}\n`
            teks += `*Deskripsi:* ${aki.answers[0].description}\n\n`
            teks += `Semoga jawabannya benar.\n`
            teks += `Untuk bermain lagi ketik */akinator*.`
            return conn.sendFile(m.chat, thumbnail, teks, { quotedMessageId: m.id._serialized })
          }
          if (budy.toLowerCase().startsWith('1') || budy.toLowerCase().startsWith('iya')) {
        	await aki.step(0).catch(e => delete this.akinator[m.sender]);
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
          } else if (budy.toLowerCase().startsWith('2') || budy.toLowerCase().startsWith('tidak')) {
        	await aki.step(1).catch(e => delete this.akinator[m.sender]);
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
          } else if (budy.toLowerCase().startsWith('3') || budy.toLowerCase().startsWith('tidak tahu')) {
        	await aki.step(2).catch(e => delete this.akinator[m.sender]);
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
          } else if (budy.toLowerCase().startsWith('4') || budy.toLowerCase().startsWith('mungkin')) {
        	await aki.step(3).catch(e => delete this.akinator[m.sender]);
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
          } else if (budy.toLowerCase().startsWith('5') || budy.toLowerCase().startsWith('mungkin tidak')) {
            await aki.step(4).catch(e => delete this.akinator[m.sender]);
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
        }          
        if ((Object.values(this.anonymous).find(room => [room.a, room.b].includes(m.sender) && room.state === 'CHATTING')) && m.isGroup && budy.startsWith(prefix)) return m.reply(`Kamu masih berada di dalam anonymous chat\nKetik *${prefix}leave* di private chat bot untuk meninggalkan partner chat!`)
        if ((Object.values(this.anonymous).find(room => [room.a, room.b].includes(m.sender) && room.state === 'CHATTING')) && !m.isGroup) {
      	let room = Object.values(this.anonymous).find(room => [room.a, room.b].includes(m.sender) && room.state === 'CHATTING')
          let other = [room.a, room.b].find(user => user !== m.sender)
          if (budy.startsWith(prefix) && !(budy.includes('leave') || budy.includes('next'))) return m.reply(`Kamu masih berada di dalam anonymous chat\nKetik *${prefix}leave* untuk meninggalkan partner chat!`)
          m.copyNForward(other, true)
        } 
        /**
          * Randomizes player roles!
          * @param {String} () 
        */
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

        /**
          * Shows all the players that are playing!
          * Shows all the players (Alive or Dead) that are playing!
          * @param {String} () 
        */
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
        
        function getPlayersAliveOrDead() {
          let players = Object.values(game.allPlayers);
          let message = '';
          for (let i = 0; i < players.length; i++) {
            let status = players[i].alive ? '🍃 Hidup' : `💀 Mati (${players[i].role})`;
            message += `${i + 1}. @${players[i].id} - ${status}\n`
          }
          return message.trim();
        }

        /**
          * Find the player with the most votes!
          * Shows all players who voted!
          * @param {String} () 
        */
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
          return votedPlayer;
        }
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

        /**
          * Find the winner in game!
          * @param {String} () 
        */
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
            conn.sendMessageWerewolf(game.groupId, fileww.winnerText(1))
            return true
          } else if (werewolfCount == 0) {
            conn.sendMessageWerewolf(game.groupId, fileww.winnerText(2))
            return true
          } else {
            return false
          }
        } 
        
        /**
          * To start the game!
          * To end the game!
          * @param {String} () 
        */
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
        
        /**
          * To start the game in the day session!
          * To end the game in the day session!
          * @param {String} () 
        */
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
              game.players[player].votes = 0;
              delete game.players[player].hasVoted
              delete game.players[player].hasChosenTarget
              delete game.players[player].hasSeenTarget
              delete game.players[player].hasProtectTarget
            }

            game.state = 'day';
            let discussMessage = await conn.sendMessageWerewolf(game.groupId, fileww.discussionTime())
            // Setelah waktu diskusi habis, beritahukan pemain untuk mulai voting
            setTimeout(async function() {
              game.state = 'vote'
              let stanzaID = await conn.sendMessageWerewolf(game.groupId, `*[ Werewolf - Game ]*\n\n🚨 Waktu diskusi telah selesai! 🚨\n\n🗳️ Voting sesi siang telah dimulai! Reply pesan ini dengan mengirim */vote <nomor pemain>* untuk memilih pemain yang akan dihukum gantung. Kalian hanya mempunyai ⏰ ${game.discussionDuration / 1000} detik untuk memilih suara.\n📝 List pemain yang dapat divoting: \n${getPlayerListString()}\n\n⚠️ *Peringatan:* Anda hanya bisa vote sekali saat voting sesi siang. Jadi pastikan pilihanmu sudah tepat sebelum mengirimkan suara.`, {
                quoted: discussMessage.msg.key.id
              })
              game.quotedStanzaID = stanzaID.msg.key.id
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
            let teks = 
            conn.sendMessageWerewolf(game.groupId, fileww.endVoting(1, getVotedListString, nonVotersListString));
            game.state = 'night';
            setTimeout(startNight, 10 * 1000);
            return;
          }
          if (tiedPlayers.length == 0) {
            conn.sendMessageWerewolf(game.groupId, fileww.endVoting(2, getVotedListString, nonVotersListString));
            game.state = 'night';
            setTimeout(startNight, 10 * 1000);
            return;
          }

          let killedPlayer = tiedPlayers[0];
          let messageResult = await conn.sendMessageWerewolf(game.groupId, fileww.endVoting(3, getVotedListString, nonVotersListString));
          await sleep(5 * 1000)
          let messageAgain = 
          conn.sendMessageWerewolf(game.groupId, [
              `*[ Werewolf - Game ]*\n\n😱 Oh tidak, @${killedPlayer.id} telah dibunuh dengan dihukum gantung! Kamu tidak bisa melanjutkan permainan lagi. ${killedPlayer.role == 'werewolf' ? 'Tetapi' : 'Sayang sekali'}, peran dia adalah ${killedPlayer.role == 'werewolf' ? 'werewolf 🐺' : killedPlayer.role + ' 🙁'}. Sepertinya hari mulai menjadi gelap 🌙. Semangat untuk malam hari yang akan datang! 🔥`,
              `*[ Werewolf - Game ]*\n\n💔 Sayang sekali, @${killedPlayer.id} telah dibunuh dengan dihukum gantung. Kamu tidak bisa melanjutkan permainan lagi. ${killedPlayer.role == 'werewolf' ? 'Tapi ternyata' : 'Ternyata'} peran dia adalah ${killedPlayer.role == 'werewolf' ? 'werewolf 🐺' : killedPlayer.role + ' yang tidak beruntung 🙁'}. Sepertinya hari mulai menjadi gelap 🌙. Semangat untuk malam hari yang akan datang! 🔥`,
              `*[ Werewolf - Game ]*\n\n😢 @${killedPlayer.id} telah dibunuh dengan dihukum gantung karena memiliki jumlah voting terbanyak. ${killedPlayer.role == 'werewolf' ? 'Tapi ternyata' : 'Ternyata'} peran dia adalah ${killedPlayer.role == 'werewolf' ? 'werewolf 🐺' : killedPlayer.role + ' yang tidak beruntung 💔'}. Sepertinya hari mulai menjadi gelap 🌙. Semangat untuk malam hari yang akan datang! 🔥`
            ][Math.floor(Math.random() * 3)], {
            quoted: messageResult.msg.key.id
          });
          conn.sendMessageWerewolf(killedPlayer.id, [
              `*[ Werewolf - Game ]*\n\nYahh! Kamu telah dibunuh dengan dihukum gantung 💀 Sayang sekali, permainanmu di sini sudah berakhir 💔 Tapi jangan menyerah, coba lagi di permainan berikutnya 💪🏼`,
              `*[ Werewolf - Game ]*\n\nGantung!!! Kamu telah terbunuh dan tidak bisa melanjutkan permainan 💀 Selamat tinggal, semoga bisa bertemu lagi di permainan berikutnya 😅`,
              `*[ Werewolf - Game ]*\n\nAduh, kamu tertangkap basah oleh voting terbanyak dan terpaksa harus dihukum gantung 💀 Sayang sekali, permainanmu di sini sudah berakhir 💔 Tapi jangan menyerah, coba lagi di permainan berikutnya 💪🏼`,
              `*[ Werewolf - Game ]*\n\nGame over! Kamu telah dibunuh dengan dihukum gantung 💀 Sayang sekali, permainanmu di sini sudah berakhir 💔 Tapi jangan menyerah, coba lagi di permainan berikutnya 💪🏼`,
              `*[ Werewolf - Game ]*\n\nKamu terkena imbas dari voting terbanyak dan harus dihukum gantung 💀 Sayang sekali, permainanmu di sini sudah berakhir 💔 Tapi jangan menyerah, coba lagi di permainan berikutnya 💪🏼`
            ][Math.floor(Math.random() * 5)], {
            quoted: messageResult.msg.key.id
          })
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

        /**
          * To start the game in the night session!
          * To end the game in the night session!
          * @param {String} () 
        */
        async function startNight() {
          if (game.state !== 'night') return
          let winner = findWinner();
          if (winner) {
            setTimeout(endGame, 10 * 1000)
            return
          }
          game.state = 'night';
          let mNight = await conn.sendMessageWerewolf(game.groupId, fileww.messagePlayerNight());
          await sleep(5 * 1000)
          for (let playerId in game.players) {
            let player = game.players[playerId];
            if ((player.role === 'werewolf' || player.role === 'seer' || player.role === 'guardian')) {
              let listString = getPlayerListString();
              if (player.role === 'werewolf') conn.sendMessageWerewolf(player.id, fileww.playerNightAction(1, listString), mNight.msg.key.id)
              else if (player.role === 'seer') conn.sendMessageWerewolf(player.id, fileww.playerNightAction(2, listString), mNight.msg.key.id)
              else if (player.role === 'guardian') conn.sendMessageWerewolf(player.id, teks, fileww.playerNightAction(3, listString), mNight.msg.key.id)
            }
          }
          setTimeout(endNight, game.nightDuration);
        }
        function endNight() {
          if (game.state !== 'night') return 
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
              conn.sendMessageWerewolf(killedPlayer.id, fileww.nightResult(1, killedPlayer, killedPlayerString, proctectedPlayerString));
            } else {
              if (killedPlayer.role !== 'werewolf') {
                conn.sendMessageWerewolf(killedPlayer.id, fileww.nightResult(2, killedPlayer, killedPlayerString, proctectedPlayerString));
                game.allPlayers[killedPlayer.id].alive = false
                delete game.players[killedPlayer.id];
                killedPlayerList.push(killedPlayer.id);
              }
            }
          }

          let killedPlayerString = killedPlayerList.join(', @');
          let protectedPlayerString = protectedPlayerList.join(', @');
          if (killedPlayerList.length > 0) {
            if (protectedPlayerList.length == 0) conn.sendMessageWerewolf(game.groupId, fileww.nightResult(3, killedPlayer, killedPlayerString, proctectedPlayerString));
            else conn.sendMessageWerewolf(game.groupId, fileww.nightResult(4, killedPlayer, killedPlayerString, proctectedPlayerString));
          } else conn.sendMessageWerewolf(game.groupId, fileww.nightResult(5, killedPlayer, killedPlayerString, proctectedPlayerString));
          let winner = findWinner();
          if (winner) {
            setTimeout(endGame, 10 * 1000)
            return
          } else setTimeout(startDay, 10 * 1000);
        }
    }
  } catch (e) {
    console.error(e)
  }
}

global.reloadFile(__filename)