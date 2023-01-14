const fs = require('fs')
const chalk = require('chalk')

global.reloadFile = (filename, options = {}) => {
    let file = require.resolve(filename)
    fs.watchFile(file, () => {
        fs.unwatchFile(file)
        console.log(chalk.redBright(`File "${filename}" has updated`))
        delete require.cache[file]
        require(file)
    })
    // nocache(file, module => console.log(chalk.redBright(`File "${file}" has updated`)))
}

// Website Api
global.APIs = {
	zenz: 'https://zenzapi.xyz',
}

// Apikey Website Api
global.APIKeys = {
	'https://zenzapi.xyz': 'afce66a34f',
	'https://api.dapuhy.xyz': 'simple4u',
	'https://api.zeks.me': 'simple4u',
	'https://hardianto.xyz': 'hardianto',
	'https://leyscoders-api.herokuapp.com': 'dappakntlll',
	'https://dhn-api.herokuapp.com': '012e9326e9cea80363c7'
}

/** 
   * Packname n Author for Stickers!
   * @user - name from user.
   * @time - time created sticker.
   * @creator - bot name.
   * @number - bot number.
**/
global.spackname = 'Sticker by @user'
global.sauthor = '@creator'

// Other
global.multiplier = 62
global.thumb = fs.readFileSync('./lib/thumb.png') // Ratio 16:9 (format .png)
global.thumbV2 = fs.readFileSync('./lib/thumbV2.png') // Ratio 1:1 (format .png)
global.owner = ['6287850323650']
global.mess = (type, m) => {
	let msg = {
        admin: 'This command is only for *group admins!*.',
        botAdmin: 'This command is only available when *bot become admin!*.',
        owner: 'This command is only for *bot owner!*.',
        group: 'This command is only available in *group!*.',
        private: 'This command is only available in *private chat!*.',
        wait: 'Please wait, data is being processing...', 
        error: 'An unexpected error occurred, please report owner.'
    }[type]
    if (msg) return m.reply(msg)
}

function nocache(module, cb = () => {}) {
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

// Update file if file change
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update File "${file}"`))
})
