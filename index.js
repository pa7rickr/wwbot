process.on('uncaughtException', console.error)

require('./config')
const { 
    AnyMessageContent, 
    useSingleFileAuthState,
    makeInMemoryStore, 
    DisconnectReason,
    BufferJSON,
    delay 
} = require("@adiwajshing/baileys")
const { state, saveState } = useSingleFileAuthState('./hisoka.json')
const store = makeInMemoryStore({ })
const Spinnies = require('spinnies')
const { makeWASocket, serialize } = require('./lib/simple')
const { sleep, tanggal } = require('./lib/function')
const { color, bgcolor } = require('./lib/color')
const Collection = require('./lib/collect')
const yargs = require("yargs/yargs")
const Command = new Collection()
const { Low, JSONFile } = require('./lib/lowdb')
const mongoDB = require('./lib/mongoDB')
const figlet = require("figlet")
const P = require('pino')
const cron = require('node-cron')
const _ = require('lodash')
const fs = require("fs")

const spins = new Spinnies({ 
	color: 'white',
    succeedColor: 'greenBright',
    disableSpins: false,
    spinner: { 
        interval: 90,
        frames: [ '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']
     }
})

try {
    require.resolve("yt-search")
} catch(e) {
    console.log(`plugin "yt-search" is not found. Trying to installing...`)
    exec('npm i yt-search && pm2 restart index.js', (err, stdout) => { return console.log(err) })
}

console.log(color(figlet.textSync('PatrickBot', {
	font: 'Standard',
	horizontalLayout: 'default',
	verticalLayout: 'default',
	whitespaceBreak: false
}), 'cyan'))

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.plugin = fs.readFileSync('main.js').toString().split(`case prefix+'`).map(v => v.split(`':`)[0]).slice(1)

console.log(global.plugin, `Total command: ${plugin.length}.`)

const makeSocket = async () => { 
    const conn = makeWASocket({ 
    	printQRInTerminal: true, 
        logger: P({ level: 'fatal' }), 
        defaultQueryTimeoutMs: undefined,
        patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
                message.buttonsMessage ||
                message.listMessage
            );
            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                            ...message,
                        },
                    },
                };
            }

            return message;
        },
        auth: state, 
        version: [2,2204,13]
    }, store)
    
    // Connect To Database!
    global.db = new Low(
        // /https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : 
        /mongodb/.test(opts['db']) ? new mongoDB(opts['db']) : 
        new JSONFile('./database.json')
    )
    global.DATABASE = global.db // Backwards Compatibility
    global.loadDatabase = async function loadDatabase() {
        if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
        if (global.db.data !== null) return
        global.db.READ = true
        await global.db.read()
        global.db.READ = false
        global.db.data = {
            users: {},
            chats: {},
            settings: {},
            stats: {},
            msg: {},
            cmd: {},
            hit: {},
            media: { 
                sticker: {},
                image: {}, 
                audio: {}, 
                video: {}, 
            },
            ...(global.db.data || {})
        }
        global.db.chain = _.chain(global.db.data)
    }
    loadDatabase() 
        
    if (global.db.data == null) await loadDatabase() 
    if (global.db) setInterval(async () => {
        if (global.db.data) await global.db.write()
    }, 30 * 1000)
    
    spins.add('spinner-1', { text: 'Login to WhatsApp Web...' })
    conn.ev.on('messages.upsert', async (message) => {
        let mess = message.messages[0]
        if (mess.messageStubType == 27 || mess.messageStubType == 28 || mess.messageStubType == 32) conn.ev.emit('group-participant.update', { 
        	id: mess.key.remoteJid, 
        	participants: mess.messageStubParameters, 
            action: mess.messageStubType == 27 ? 'add' : 'remove',
            status: mess.messageStubType == 32 ? 'participant' : (mess.key.participant == mess.messageStubParameters[0] || !mess.key.participant) ? 'participant' : mess.key.participant
        })
        if (mess.messageStubType == 29 || mess.messageStubType == 30) conn.ev.emit('group-participant.update', { 
        	id: mess.key.remoteJid, 
        	participants: mess.messageStubParameters, 
            action: mess.messageStubType == 29 ? 'promote' : 'demote',
            status: mess.key.participant
        })
        if (!mess.message) return
        mess.message = (Object.keys(mess.message)[0] === 'ephemeralMessage') ? mess.message.ephemeralMessage.message : mess.message
        if ((mess.key.id.startsWith('BAE5') || mess.key.id.startsWith('3EB0')) && (mess.key.id.length == 12 || mess.key.id.length == 16)) return 
        if (mess.key.remoteJid == 'status@broadcast') return
        m = serialize(conn, mess, store)
        require('./main')(conn, m, message, store)
    })
    
    // Group Participants Update! 
    conn.ev.on('group-participant.update', async (anu) => {
        try {
        	console.log(anu)
            let metadata = await conn.groupMetadata(anu.id)
            let participants = anu.participants
            if (global.db.data == null) loadDatabase()
            for (let num of participants) {
            	try { bio = await conn.fetchStatus(num)} catch { bio = { status: 'No bio' }}
                try { ppuser = await conn.profilePictureUrl(num, 'image')} catch { ppuser = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg' }
                let chat = global.db.data.chats[anu.id]
                if (anu.action == 'add') {
                	let teks = `Welcome to *@subject*\n` 
                    teks += `Dont forget to introduction!\n`
                    teks += `───────────\n`
                    teks += `▸ *Name:* @user\n`
                    teks += `▸ *Bio:* @bio\n`
                    teks += `▸ *Date:* @time\n`
                    teks += `▸ *Type:* @type\n`
                    teks += `───────────`
                    let capt = (chat?.sWelcome?.length > 5) ? chat.sWelcome : teks
                    caption = capt.replace('@user', '@' + num.split('@')[0]).replace('@time', tanggal(new Date())).replace('@subject', metadata.subject).replace('@desc', metadata.desc).replace('@bio', bio.status || 'No bio').replace('@type', anu.status == 'participant' ? 'Join via link' : 'Added by @' + anu.status.split('@')[0])
                    conn.sendButton(anu.id, caption, '', ppuser, [ 
                        ['.menu', 'Welcome :)'], 
                    ], null, { mentions: conn.parseMention(caption) })
                } else if (anu.action == 'remove') {
                	let teks = `Goodbye from *@subject*\n` 
                    teks += `Why he ${anu.status == 'participant' ? 'leave' : 'kicked'}?\n`
                    teks += `───────────\n`
                    teks += `▸ *Name:* @user\n`
                    teks += `▸ *Bio:* @bio\n`
                    teks += `▸ *Date:* @time\n`
                    teks += `▸ *Type:* @type\n`
                    teks += `───────────`
                    let capt = (chat?.sBye?.length > 5) ? chat.sBye : teks
                    caption = capt.replace('@user', '@' + num.split('@')[0]).replace('@time', tanggal(new Date())).replace('@subject', metadata.subject).replace('@desc', metadata.desc).replace('@bio', bio.status || 'No bio').replace('@type', anu.status == 'participant' ? 'Leave from Group' : 'Kicked by @' + anu.status.split('@')[0])
                    conn.sendButton(anu.id, caption, '', ppuser, [ 
                        ['.menu', 'Goodbye :('], 
                    ], null, { mentions: conn.parseMention(caption) })
                } else if (anu.action == 'promote') {
                	let teks = `Promote detected.\n`
                    teks += `In the group *@subject*\n`
                    teks += `───────────\n`
                    teks += `▸ *Name:* @user\n`
                    teks += `▸ *Bio:* @bio\n`
                    teks += `▸ *Date:* @time\n`
                    teks += `▸ *Promoted by:* @type\n`
                    teks += `───────────`
                    let capt = (chat?.sPromote?.length > 5) ? chat.sPromote : teks
                    caption = capt.replace('@user', '@' + num.split('@')[0]).replace('@time', tanggal(new Date())).replace('@subject', metadata.subject).replace('@desc', metadata.desc).replace('@bio', bio.status || 'Tidak ada bio').replace('@type', '@' + anu.status.split('@')[0])
                    conn.sendButton(anu.id, caption, '', ppuser, [ 
                        ['.menu', 'Promote :)'], 
                    ], null, { mentions: conn.parseMention(caption) })
                } else if (anu.action == 'demote') {
                	let teks = `Demote Detected.\n` 
                    teks += `In the group *@subject*\n`
                    teks += `───────────\n`
                    teks += `▸ *Name:* @user\n`
                    teks += `▸ *Bio:* @bio\n`
                    teks += `▸ *Pada:* @time\n`
                    teks += `▸ *Demoted by:* @type\n`
                    teks += `───────────`
                    let capt = (chat?.sDemote?.length > 5) ? chat.sDemote : teks
                    caption = capt.replace('@user', '@' + num.split('@')[0]).replace('@time', tanggal(new Date())).replace('@subject', metadata.subject).replace('@desc', metadata.desc).replace('@bio', bio.status || 'Tidak ada bio').replace('@type', '@' + anu.status.split('@')[0])
                    conn.sendButton(anu.id, caption, '', ppuser, [ 
                        ['.menu', 'Demote :('], 
                    ], null, { mentions: conn.parseMention(caption) })
                } 
            }
        } catch (err) {
            console.log(err)
        }
    })
    
    // Anti call!
    conn.ws.on('CB:call', async (json) => { 
    	if (!global.db.data.settings.anticall) return
        const callerId = json.content[0].attrs['call-creator']
        if (json.content[0].tag == 'offer') {
        	let pa7rick = await conn.sendContact(callerId, global.owner)
            conn.sendText(callerId, 'Automatic block system.\nChat owner to open to block')
            await sleep(8000)
            await conn.updateBlockStatus(callerId, "block")
        }
    }) 

    // Presence update!
    conn.ev.on('presence.update', async ({ id, presences }) => {
    	try {
            let sender = Object.keys(presences)[0] || id
            let _sender = conn.decodeJid(sender)
            let presence = presences[sender] || { lastKnownPresence: 'composing' }
            if (!(id in store.presences)) store.presences[id] = {}
            if (!(_sender in store.presences[id])) store.presences[id][sender] = {}
            store.presences[id][sender] = presence
            if (presence.lastKnownPresence === "composing" || presence.lastKnownPresence === "recording") {
            	if (global.db.data) {
                    if (global.db.data.users[sender]?.afk > -1) {
                    	let user = global.db.data.users[sender]
                        let teks = `Detected ${presence.lastKnownPresence == 'composing' ? 'typing...' : 'recording...'}\n` 
                    	teks += `@${sender.split`@`[0]} stop AFK${user.afkReason ? ' after ' + user.afkReason : ''}\n` 
                        teks += `During ${clockString(new Date() - user.afk)}`
                        conn.sendText(id, teks, { 
                        key: {
                            fromMe: false, 
                            participant: '0@s.whatsapp.net',
                            remoteJid: "status@broadcast"
                        }, message: {
                            contactMessage: {
                                displayName: await conn.getName(sender), 
                                vcard: 
                                   `BEGIN:VCARD\n
                                    VERSION:3.0\n
                                    N:${await conn.getName(sender)}\n
                                    FN:${await conn.getName(sender)}\n
                                    item1.TEL;waid=${sender.split`@`[0]}:${sender.split`@`[0]}\n
                                    item1.X-ABLabel:Ponsel\n
                                    item2.EMAIL;type=INTERNET:linktr.ee/pa7rick\n
                                    item2.X-ABLabel:Email\n
                                    item3.URL:https://instagram.com/pa7rick\n
                                    item3.X-ABLabel:Instagram\n
                                    item4.ADR:;;Indonesia;;;;\n
                                    item4.X-ABLabel:Region\n
                                    END:VCARD`        
                            }
                        }
                    }, { mentions: [...teks.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }).then(v => {
                            user.afk = -1
                            user.afkReason = ''
                        })
                    }
                }
            }
        } catch(err) { 
        	console.log(err)
        }
    })
    
    // Groups update!
    conn.ev.on('groups.update', async (update) => { 
    	try {
        	let anu = update[0]
        	anu.status = Object.keys(anu)[1]
            try { ppgroup = await conn.profilePictureUrl(anu.id, 'image') } catch { ppgroup = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg' }
            if (anu.status == 'announce') { 
            	if (anu.announce) { 
            	    let teks = `This group info has been locked.\n`
                    teks += `Participants cannot send messages.\n` 
                    teks += `Date: *${tanggal(new Date())}*`
                    conn.sendHydrated(anu.id, teks, 'Announce message', ppgroup, [], [], [], null) 
                } else { 
                	let teks = `Participants can send messages.\n`
                    teks += `Participants can send messages.\n` 
                    teks += `Date: *${tanggal(new Date())}*`
                    conn.sendHydrated(anu.id, teks, 'Announce message', ppgroup, [], [], [], null) 
                }
            } else if (anu.status == 'restrict') { 
            	if (anu.restrict) { 
            	    let teks = `This group info has been locked.\n`
                    teks += `Participants cannot edit info.\n` 
                    teks += `Date: *${tanggal(new Date())}*`
                    conn.sendHydrated(anu.id, teks, 'Restrict message', ppgroup, [], [], [], null) 
                } else { 
                	let teks = `This group info has been opened.\n`
                    teks += `Participants can edit info.\n` 
                    teks += `Date: *${tanggal(new Date())}*`
                    conn.sendHydrated(anu.id, teks, 'Restrict message', ppgroup, [], [], [], null) 
                }
            } else if (anu.status == 'subject') { 
            	let teks = `Title of this group has been updated.\n`
                teks += `Date: *${tanggal(new Date())}*\n\n`
                teks += `*${anu.subject}*`
            	conn.sendHydrated(anu.id, teks, 'Subject group change', ppgroup, [], [], [], null) 
            }
        } catch(err) { 
        	console.log(err)
        }
    })

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr, receivedPendingNotifications } = update
        if (qr !== undefined) spins.update('spinner-1', { text: 'Please scan the qr.' })
        if (qr == undefined && receivedPendingNotifications) spins.succeed('spinner-1', { text: 'Succes connect to device.' })
        if (connection == 'close') {
            console.log('Connection has closed, try to restarting.')
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? makeSocket() : console.log('Session most likely logged out.')
        }
    })
    
    // Contacts update!
    conn.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = conn.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })
    // To reset limit on 12.00 AM!
    cron.schedule('00 12 * * *', () => { 
        let users = Object.entries(global.db.data.users).map(v => v[0])
        for (id of users) global.db.data.users[id].limit = 20
        console.log('Limit User on MongoDB has been reseted!')
		conn.sendText('6287850323650@s.whatsapp.net', `Limit User on MongoDB has been reseted! *(${users.length} user)*`)
    }, { scheduled: true, timezone: "Asia/Jakarta" }) 

    store.bind(conn.ev)
    global.store = store
    return conn
}

makeSocket().catch(err => console.log(err))
