
require('../config')
const { 
	default: makeWASocket,
	generateWAMessageFromContent, 
    generateForwardMessageContent, 
    downloadContentFromMessage, 
    getBinaryNodeChild,
    getContentType,
    jidDecode, 
    getDevice,
    proto 
} = require("@adiwajshing/baileys")
const {
	webp2mp4File,
	UploadFileUgu,
	TelegraPh,
	Top4top
} = require('./uploader')
const { 
    imageToWebp, 
    videoToWebp, 
    writeExifImg, 
    writeExifVid
} = require('./sticker')
const { 
	fetchBuffer,
    fetchURL
} = require('./function')
const apiBb = ['5d2da95085222073c20b2af0e420a7ce', 'ad49958d06de42319dca12909d210c3d', '0422d5b3ae1024247b116962b1f3618e']
const PhoneNumber = require('awesome-phonenumber')
const imgbb = require('imgbb-uploader')
const FileType = require('file-type')
const fetch = require('node-fetch')
const path = require('path')
const fs = require('fs')

function nullish(args) {
    return !(args !== null && args !== undefined)
}
exports.makeWASocket = (args, store) => {
    let conn = makeWASocket(args)
    conn.public = true
     
    /**
     * Decode jid!
     * @param {String} jid 
     */
    conn.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    /**
     * Get Name User!
     * @param {String} jid 
     * @param {Boolean} withoutContact 
     */
    conn.getName = (jid, withoutContact  = false) => {
        id = conn.decodeJid(jid)
        withoutContact = conn.withoutContact || withoutContact 
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = await conn.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === conn.decodeJid(conn.user.id) ?
            conn.user :
            (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
    /**
     * Get Info Group Admins!
     * @param {String[]} participants
     */
    conn.getGroupAdmins = (participants) => {
        let admins = []
        for (let i of participants) {
            i.admin === "superadmin" ? admins.push(i.id) :  i.admin === "admin" ? admins.push(i.id) : ''
        }
        return admins || []
     }
     
    /**
     * Sending Message!
     * @param {String} jid 
     * @param {String} text 
     * @param {Object} quoted 
     * @param {Object} options 
     */
    conn.sendText = (jid, text, quoted = '', options = {}) => conn.sendMessage(jid, { text: text, ...options }, { quoted, ...options })
    
    /**
     * Sending Contact Message!
     * @param {String} jid 
     * @param {String[]} contacts 
     * @param {Object} quoted 
     * @param {Object} opts 
     */
    conn.sendContact = async (jid, contacts, name, quoted = '', opts = {}) => {
    	let list = []
    	for (let i of contacts) {
    	    list.push({
    	    	displayName: name !== undefined ? name : await conn.getName(i + '@s.whatsapp.net'),
    	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(i + '@s.whatsapp.net')}\nFN:${await conn.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:linktr.ee/pa7rick\nitem2.X-ABLabel:Email\nitem3.URL:https://instagram.com/_pa7rick\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`

    	    })
    	}
    	conn.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted, ...opts })
    }
    
    /**
     * Sending Image Message!
     * @param {String} jid 
     * @param {Buffer|String} path 
     * @param {String} caption 
     * @param {Object} quoted 
     * @param {Object} options 
     */
    conn.sendImage = async (jid, path, caption = '', quoted = '', options = {}) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await conn.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted, ...options })
    } 
    
    /**
     * Sending Sticker Message!
     * @param {String} jid 
     * @param {Buffer|String} path 
     * @param {String} caption 
     * @param {Object} quoted 
     * @param {Object} options 
     */
    conn.sendSticker = async (jid, path, caption = '', quoted = '', options = {}) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await conn.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted, ...options })
    } 
    
    /**
     * Sending Video Message!
     * @param {String} jid 
     * @param {Buffer|String} path 
     * @param {String} caption 
     * @param {Object} quoted 
     * @param {Object} options 
     */
    conn.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options = {}) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await conn.sendMessage(jid, { video: buffer, caption: caption, mimetype: 'video/mp4', gifPlayback: gif, ...options }, { quoted, ...options })
    }  
    
    /**
     * Sending Audio Message!
     * @param {String} jid 
     * @param {Buffer|String} path 
     * @param {Object} quoted 
     * @param {String} mime 
     * @param {Object} options 
     */
    conn.sendAudio = async (jid, path, quoted = '', ptt = false, options = {}) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await conn.sendMessage(jid, { audio: buffer, ptt: ptt, mimetype: 'audio/mp4', ...options }, { quoted, ...options })
    }
    
    /**
     * Sending Media/File!
     * @param {String} jid 
     * @param {Buffer|String} path 
     * @param {String} filename
     * @param {String} caption
     * @param {Object} quoted 
     * @param {Object} options 
     */
    conn.sendFile = async (jid, path, fileName = '', quoted = '', options = {}) => {
        let types = await conn.getFile(path, true)
           let { mime, ext, res, data, filename } = types
           if (res && res.status !== 200 || file.length <= 65536) {
               try { throw { json: JSON.parse(file.toString()) } }
               catch (e) { if (e.json) throw e.json }
           }
       let type = '', mimetype = mime, pathFile = filename
       if (options.mime) mimetype = options.mime
       if (options.asDocument) type = 'document'
       if (options.asSticker || /webp/.test(mime)) {
          let { writeExif } = require('./Sticker')
          let media = { mimetype: mime, data }
          pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
          await fs.promises.unlink(filename)
          type = 'sticker'
          mimetype = 'image/webp'
        }
       else if (/image/.test(mime)) type = 'image'
       else if (/video/.test(mime)) type = 'video'
       else if (/audio/.test(mime)) type = 'audio'
       else type = 'document'
       await conn.sendMessage(jid, { [type]: { url: pathFile }, caption: fileName, mimetype, fileName, ...options }, { quoted, ...options })
       return fs.promises.unlink(pathFile)
    }

    /**
     * Set Status!
     * @param {String} status 
     */
    conn.setStatus = (status) => {
        conn.query({
            tag: 'iq',
            attrs: {
                to: '@s.whatsapp.net',
                type: 'set',
                xmlns: 'status',
            },
            content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(status, 'utf-8')
            }]
        })
        return status
    }
    
    /**
      * Send List
      * @param {String} jid 
      * @param {String} text 
      * @param {String[]} button
      * @param {Object} quoted
      * @param {Object} options
    */
     conn.sendList = (jid, text = '', buttonText, sections, quoted, options = {}) => {
        let listMessage = {
        	title: "",
            footer: "",
            sections,
            buttonText,
            text: '\n' + text, 
            ...options
       }
       conn.sendMessage(jid, listMessage, { quoted, ...options })
    }
    
    /**
      * Send Button
      * @param {String} jid 
      * @param {String} text 
      * @param {String} footer
      * @param {Buffer} buffer (available video || image || document)
      * @param {String[]|String[][]} buttons
      * @param {Object} quoted
      * @param {Object} options
    */
    conn.sendButton = async (jid, text = '', footer = '', buffer, buttons, quoted, options = {}) => {
        let type
        if (Array.isArray(buffer)) (options = quoted, quoted = buttons, buttons = buffer, buffer = null)
        else if (buffer) try { (type = await conn.getFile(buffer), buffer = type.data) } catch { buffer = buffer }
        if (!Array.isArray(buttons[0]) && typeof buttons[0] === 'string') buttons = [buttons]
        if (!options) options = {}
        let message = {
            ...options,
            [buffer ? 'caption' : 'text']: text || '',
            footer,
            buttons: buttons.map(btn => ({
                buttonId: !nullish(btn[0]) && btn[0] || !nullish(btn[1]) && btn[1] || '',
                buttonText: {
                    displayText: !nullish(btn[1]) && btn[1] || !nullish(btn[0]) && btn[0] || ''
                }
            })),
            ...(buffer ?
                options.asLocation && /image/.test(type.mime) ? {
                    location: {
                        ...options,
                        jpegThumbnail: buffer
                    }
                } : {
                    [/video/.test(type.mime || 'mime') ? 'video' : /image/.test(type.mime || 'mime') ? 'image' : 'document']: buffer
                } : {})
        }
        return await conn.sendMessage(jid, message, {
            quoted,
            upload: conn.waUploadToServer,
            ...options
        })
    } 
     
    /**
      * Send Hydrated!
      * @param {String} jid 
      * @param {String} text 
      * @param {String} footer
      * @param {Buffer} buffer (available video || image || document)
      * @param {String[]|String[][]} url
      * @param {String[]|String[][]} call
      * @param {String[]|String[][]} buttons
      * @param {Object} quoted
      * @param {Object} options
    */
    conn.sendHydrated = async (jid, text = '', footer = '', buffer, url, call, buttons, quoted, options) => {
    	let type 
         if (buffer) try { (type = await conn.getFile(buffer), buffer = type.data) } catch { buffer = buffer }
         if (buffer && !Buffer.isBuffer(buffer) && (typeof buffer === 'string' || Array.isArray(buffer))) (options = quoted, quoted = buttons, buttons = call, call = url, url = buffer, buffer = null)
         if (!options) options = {}
         let templateButtons = []
         if (url.length) {
             if (!Array.isArray(url[0])) url = [url]
             templateButtons.push(...(
                 url.map(([id, text], index) => ({
                     index: templateButtons.length + index + 1,
                     urlButton: {
                         displayText: !nullish(text) && text || !nullish(id) && id || '',
                         url: !nullish(id) && id || !nullish(text) && text || ''
                     }
                 })) || []
             ))
         } 
         if (call.length) {
             if (!Array.isArray(url[0])) call = [call]
             templateButtons.push(...(
                 call.map(([id, text], index) => ({
                     index: templateButtons.length + index + 1,
                     callButton: {
                         displayText: !nullish(text) && text || !nullish(id) && id || '',
                         phoneNumber: !nullish(id) && id || !nullish(text) && text || ''
                     }
                 })) || []
             ))
         }
         if (buttons.length) {
             if (!Array.isArray(buttons[0])) buttons = [buttons]
             templateButtons.push(...(
                 buttons.map(([id, text], index) => ({
                     index: templateButtons.length + index + 1,
                     quickReplyButton: {
                         displayText: !nullish(text) && text || !nullish(id) && id || '',
                         id: !nullish(id) && id || !nullish(text) && text || ''
                     }
                 })) || []
             ))
         }
         let message = {
             ...options,
             [buffer ? 'caption' : 'text']: text || '',
             footer,
             viewOnce: true,
             templateButtons,
             ...(buffer ?
                 options.asLocation && /image/.test(type.mime) ? {
                     location: {
                         ...options,
                         jpegThumbnail: buffer
                     }
                 } : {
                     [/video/.test(type.mime || 'mime') ? 'video' : /image/.test(type.mime || 'mime') ? 'image' : 'document']: buffer
                 } : {})
         }
        return await conn.sendMessage(jid, message, {
             quoted,
             upload: conn.waUploadToServer,
             ...options
         })
    }
       
     /**
     * Send Reaction Message!
     * @param {String} jid 
     * @param {String} emoji 
     * @param {Object} key 
     */
    conn.sendReaction = async (jid, emoji, key) => {
        let template = generateWAMessageFromContent(jid, proto.Message.fromObject({
    		reactionMessage: {
				key: key,
				text: emoji, 
				groupingKey: key
			}
		}), { quoted: null })
    	return conn.relayMessage(jid, template.message, { messageId: template.key.id })
    }
    
    /**
     * Send Text With Mentions!
     * @param {String} jid 
     * @param {String} text 
     * @param {Object} quoted 
     * @param {Object} options 
     */
    conn.sendTextWithMentions = async (jid, text, quoted, options = {}) => conn.sendMessage(jid, { text: text.replace(/@c\.us/g, ''), mentions: [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net'), ...options }, { quoted, ...options })
    
        
    /**
     * Send Image As Sticker!
     * @param {String} jid 
     * @param {Buffer|String} path 
     * @param {Object} quoted 
     * @param {Object} options 
     */
    conn.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await conn.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted, ...options })
        return buffer
    }
    
    /**
     * Send Video As Sticker!
     * @param {String} jid 
     * @param {Buffer|String} path 
     * @param {Object} quoted 
     * @param {Object} options 
     */
    conn.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await fetchBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await conn.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted, ...options })
        return buffer
    }
	
	/**
     * Download Media Message!
     * @param {Object} message 
     * @param {String} filename 
     * @param {Boolean} attachExtension 
     */
    conn.downloadMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    }

	/**
     * Download n Save Media Message!
     * @param {Object} message 
     * @param {String} filename 
     * @param {Boolean} attachExtension 
     */
    conn.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
	    let type = await FileType.fromBuffer(buffer) || {
            ext: (message.msg || message).fileName.split(`.`).pop() || '.bin'
        } 
        trueFileName = attachExtension ? path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext) : filename
        // save to file      
        fs.promises.writeFile(trueFileName, buffer)
        return trueFileName
    }

    /**
     * Copy n Forward Message!
     * @param {String} jid 
     * @param {String} message 
     * @param {Boolean} forceForward 
     * @param {Object} options 
     */
    conn.copyNForward = async (jid, message, options = {}, forwardingScore = true) => {
        let vtype
        if (options.readViewOnce && message.message.viewOnceMessage?.nessage) {
            vtype = Object.keys(message.message.viewOnceMessage.message)[0]
            delete message.message.viewOnceMessage.message[vtype].viewOnce
            message.message = {
                ...message.message.viewOnceMessage.message
            }
            message.message[vtype].contextInfo = message.message.viewOnceMessage.contextInfo
        }
        let mtype = Object.keys(message.message)[0]
        let m = generateForwardMessageContent(message, !!forwardingScore)
        let ctype = Object.keys(m)[0]
        if (forwardingScore && typeof forwardingScore === 'number' && forwardingScore > 1) m[ctype].contextInfo.forwardingScore += forwardingScore
        m[ctype].contextInfo = {
            ...(message.message[mtype].contextInfo || {}),
            ...(m[ctype].contextInfo || {})
        }
        m = generateWAMessageFromContent(jid, m, {
            ...options,
            userJid: conn.user.jid,
            upload: conn.waUploadToServer
        })
        await conn.relayMessage(jid, m.message, { messageId: m.key.id, additionalAttributes: { ...options } })
        return m
    }
    
    /**
     * Parse Mention by Text!
     * @param {String} text 
     */
    conn.parseMention = (text = '@mentions') => [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    
    /**
     * Check Group Invite Info!
     * @param {String} code 
     */
     conn.groupInviteInfo = async (code) => { 
        let results = await conn.query({
            tag: "iq",
            attrs: {
                type: "get",
                xmlns: "w:g2",
                to: "@g.us"
            }, content: [{ tag: "invite", attrs: { code } }]
        })
        let group = await getBinaryNodeChild(results, "group")
        let parti = group.content
        let farti = []
        let num = 1
        for (let i of parti) {
            i.tag == 'participant' ? farti.push({ id: i.attrs.jid, admin: (i.attrs.type || null) }) : ''
        }
        let hasil = {  
        	id: group.attrs.id + '@g.us',
        	subject: group.attrs.subject, 
            creation: group.attrs.creation,
            owner: group.attrs.creator,
            desc: group.content[0].content !== null ? group.content[0].content[0].content : undefined,
            descId: group.content[0].attrs.id, 
            descUpdate: group.content[0].attrs.participant, 
            descTime: group.content[0].attrs.t,
            size: group.attrs.size,
            participants: farti
        }
    	return hasil
    }
   
    /**
     * Uploading Media with Imgbb!
     * @param {Object} quoted 
     */
    conn.upload = async (quoted, unlink = true) => {
    	let data = await conn.downloadAndSaveMediaMessage(quoted) 
        let image
        try { 
            image = await imgbb(apiBb[Math.floor(Math.random() * apiBb.length)], data)
        } catch {
            image = await TelegraPh(data)
        }
        return image.display_url || image
    }

    /**
     * Load Message with Store!
     * @param {String} jid  
     * @param {String} id 
     */
    conn.loadMessage = (jid, id) => {
        let storeMessage = store.messages[jid].array
    	let message = storeMessage.find(x => x.id == id)
        if (!message) return 
        if (message.message == null) { // if id message is null (delete message)
            let msg = message.msg
            message.message = {
            	...(message.mtype == 'viewOnceMessage' ? { 
                	[message.mtype]: {
                	    message: { 
            	            [/image/.test(message.msg.mimetype) ? 'imageMessage' : 'videoMessage']: msg
                        } 
                    } 
                } : { 
                	[message.mtype]: msg 
                }),
                ...(jid.endsWith('@s.whatsapp.net') ? { 
                	messageContextInfo: {
                        deviceListMetadata: {
                            senderKeyIndexes: [],
                            recipientKeyIndexes: [],
                            recipientKeyHash: [
                                7,  21, 129, 104,  93,
                                33, 252,  24, 153, 150
                            ], recipientTimestamp: { low: 1648107553, high: 0, unsigned: true }
                        }, deviceListMetadataVersion: 2 
                    }
                }: '')
            }
        }
        return message
    }

    /**
     * cMod!
     * @param {String} jid 
     * @param {String} message 
     * @param {String} text 
     * @param {String} sender 
     * @param {Object} options 
     */
    conn.cMod = (jid, copy, text = '', sender = conn.user.id, options = {}) => {
        // let copy = message.toJSON()
		let mtype = Object.keys(copy.message)[0]
		let isEphemeral = mtype === 'ephemeralMessage'
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
		let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
		else if (content.caption) content.caption = text || content.caption
		else if (content.text) content.text = text || content.text
		if (typeof content !== 'string') msg[mtype] = {
			...content,
			...options
        }
        if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
		else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
		copy.key.remoteJid = jid
		copy.key.fromMe = sender === conn.user.id

        return proto.WebMessageInfo.fromObject(copy)
    }
    
    /**
     * Send message for werewolf game!
     * @param {String} chatId 
     * @param {String} text 
     * @param {Object} options 
     */
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

    /**
     * Get Info File by Buffer!
     * @param {Buffer|String} path 
     * @param {Boolean} save 
     */
    conn.getFile = async (PATH, save) => {
        let res 
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetchBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : Buffer.alloc(0)       
        let type = await FileType.fromBuffer(data) || {
          mime: 'application/octet-stream',
          ext: '.bin'
        }         
        filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        return {
            res,
            filename,
            ...type,
            data
        }
    }
    conn.serializeM = (m) => exports.serialize(conn, m, store)
    return conn
}

/**
 * Serialize Message
 * @param {WAConnection} conn 
 * @param {Object} m 
 * @param {Store} store 
 */
exports.serialize = (conn, m, store) => {
    if (!m) return m
    let M = proto.WebMessageInfo
    if (m.key) {
        m.id = m.key.id
        m.isBaileys = (m.id.startsWith('BAE5') || m.id.startsWith('3EB0')) && m.id.length === 16
        m.chat = m.key.remoteJid
        m.fromMe = m.key.fromMe
        m.isGroup = m.chat.endsWith('@g.us')
        m.sender = conn.decodeJid(m.fromMe && conn.user.id || m.participant || m.key.participant || m.chat || '')
        m.device = getDevice(m.id)
        if (m.isGroup) m.participant = conn.decodeJid(m.key.participant) || ''
    }
    if (m.message) {
        m.mtype = getContentType(m.message)
        m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype])
        m.mentions = m.msg?.contextInfo ? m.msg?.contextInfo.mentionedJid : []
        m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.text
        let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null
        m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
        if (m.quoted) {
            let type = getContentType(quoted)
			m.quoted = m.quoted[type]
            if (['productMessage'].includes(type)) {
				type = getContentType(m.quoted)
				m.quoted = m.quoted[type]
			}
            if (typeof m.quoted === 'string') m.quoted = {
				text: m.quoted
			}
            m.quoted.mtype = type
            m.quoted.mentions = m.msg?.contextInfo ? m.msg?.contextInfo.mentionedJid : []
            m.quoted.id = m.msg.contextInfo.stanzaId
			m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
            m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false
			m.quoted.sender = conn.decodeJid(m.msg.contextInfo.participant)
			m.quoted.fromMe = m.quoted.sender === (conn.user && conn.user.id)
            m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || ''
            m.quoted.device = getDevice(m.id)
			m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
            m.getQuotedObj = m.getQuotedMessage = async () => {
			    if (!m.quoted.id) return false
			    let q = await store.loadMessage(m.chat, m.quoted.id, conn)
 	   		return exports.serialize(conn, q, store)
            }
            let vM = m.quoted.fakeObj = M.fromObject({
                key: {
                    remoteJid: m.quoted.chat,
                    fromMe: m.quoted.fromMe,
                    id: m.quoted.id
                }, message: quoted,
                ...(m.isGroup ? { participant: m.quoted.sender } : {})
            })
            m.quoted.copyNForward = (jid, forceForward = false, options = {}) => conn.copyNForward(jid, vM, forceForward, options)
            m.quoted.delete = () => conn.sendMessage(m.quoted.chat, { delete: vM.key })
            m.quoted.download = () => conn.downloadMediaMessage(m.quoted)
        }
    }
    if (m.msg.url) m.download = () => conn.downloadMediaMessage(m.msg)
    m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
    m.reply = async (text, chatId, options) => { 
        let image = await conn.profilePictureUrl(m.sender, "image").catch(() => thumb)
		let message = await generateWAMessageFromContent(chatId ? chatId : m.chat, { 
            extendedTextMessage: {
                text: text,
                contextInfo: {
                	...options,
                    externalAdReply: {
                        title: `Hi, ${m.pushName} 👋`,
                        body: 'Click this to follow me.',
                        sourceUrl: 'https://instagram.com/pa7rickr',
                        thumbnail: image
                    }
                }
            }
        }, { quoted: m })
        conn.relayMessage(chatId ? chatId : m.chat, message.message, { messageId: message.key.id })
        return message
    }
	m.copy = () => exports.serialize(conn, M.fromObject(M.toObject(m)))
	m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => conn.copyNForward(jid, m, forceForward, options)
    return m
}

global.reloadFile(__filename)
