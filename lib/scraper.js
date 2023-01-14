/**
   * All Web Scraper
   * Recode By Pa7rickr.
   * Follow https://instagram.com/_pa7rick
*/

const fs = require("fs")
const node = require("node-fetch")
const fetch = node
const axios = require('axios')
const cheerio = require('cheerio')
const FormData = require("form-data")
const request = require("request")
const _url = require("url")
const _math = require("mathjs")
const cookie = require("cookie")
 
async function post(url, formdata = {}, cookies) {
    let encode = encodeURIComponent
    let body = Object.keys(formdata)
      .map((key) => {
        let vals = formdata[key]
        let isArray = Array.isArray(vals)
        let keys = encode(key + (isArray ? "[]" : ""))
        if (!isArray) vals = [vals]
        let out = []
        for (let valq of vals) out.push(keys + "=" + encode(valq))
        return out.join("&")
      })
      .join("&")
    return await fetch(`${url}?${/radio/.test(body) ? body.split('radio0=%5Bobject%20Object%5D').join('radio0%5Bradio%5D='+formdata.radio0.radio) : body}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "GoogleBot",
        Cookie: cookies,
      },
   })
}

/**
  * Ephoto360 Scraper
  * @function
  * @param {String} url - Your phootoxy url, example https://photooxy.com/logo-and-text-effects/make-tik-tok-text-effect-375.html.
  * @param {String[]} text - Text (required). example ["text", "text 2 if any"]
*/
   
async function ephoto(url, text, radio = 'a') {
    if (!/^https:\/\/en\.ephoto360\.com\/.+\.html$/.test(url)) 
        throw new Error("Invalid URL!\nURL must be: https://en.ephoto360.com/")
    const geturl = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "GoogleBot",
      },
    })
    const caritoken = await geturl.text()
    let hasilcookie = geturl.headers
      .get("set-cookie")
      .split(",")
      .map((v) => cookie.parse(v))
      .reduce((a, c) => {
        return { ...a, ...c }
      }, {})
    hasilcookie = {
      __cfduid: hasilcookie.__cfduid,
      PHPSESSID: hasilcookie.PHPSESSID,
    }
    hasilcookie = Object.entries(hasilcookie)
      .map(([name, value]) => cookie.serialize(name, value))
      .join("; ")
    const $ = cheerio.load(caritoken)
    const token = $('input[name="token"]').attr("value")
    const form = new FormData()
    if (typeof text === "string") text = [text];
    for (let texts of text) form.append("text[]", texts)
    let forms = {
        submit: 'Go',
        token: token,
        build_server: 'https://s1.ephoto360.com/',
        build_server_id: 1,
        ...(radio ? { "radio0[radio]": radio } : '')
    }
    for (let texts of text) form.append("text[]", texts)
    for (let key in forms) form.append(key, forms[key]) /*
    form.append("submit", "Go")
    form.append("token", token)
    form.append("build_server", "https://e2.yotools.net")
    form.append("build_server_id", 6) */
    const geturl2 = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "GoogleBot",
        Cookie: hasilcookie,
        ...form.getHeaders(),
      },
      body: form.getBuffer(),
    })
    const caritoken2 = await geturl2.text()
    const J = cheerio.load(caritoken2)
    const token2 = J('input[name="form_value_input"]').attr("value")
    if (!token2) throw new Error("Token Tidak Ditemukan!!") 
    const prosesimage = await post(
      "https://en.ephoto360.com/effect/create-image",
      JSON.parse(token2),
      hasilcookie
    )
    const hasil = await prosesimage.json()
    return `https://s1.ephoto360.com${hasil.image}`
}
  
/**
  * Photooxy Scraper
  * @function
  * @param {String} url - Your phootoxy url, example https://photooxy.com/logo-and-text-effects/make-tik-tok-text-effect-375.html.
  * @param {String[]} text - Text (required). example ["text", "text 2 if any"]
*/
  
async function photooxy(url, text, radio = 'a') {
	if (!/^https:\/\/photooxy\.com\/.+\.html$/.test(url))
	  throw new Error("Invalid URL!\nURL must be: https://photooxy.com/")
    const geturl = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "GoogleBot",
      },
    })
    const caritoken = await geturl.text()
    let hasilcookie = geturl.headers
      .get("set-cookie")
      .split(",")
      .map((v) => cookie.parse(v))
      .reduce((a, c) => {
        return { ...a, ...c }
      }, {})
    hasilcookie = {
      __cfduid: hasilcookie.__cfduid,
      PHPSESSID: hasilcookie.PHPSESSID,
    }
    hasilcookie = Object.entries(hasilcookie)
      .map(([name, value]) => cookie.serialize(name, value))
      .join("; ")
    const $ = cheerio.load(caritoken)
    const token = $('input[name="token"]').attr("value")
    const form = new FormData()
    if (typeof text === "string") text = [text];
    let forms = {
        submit: 'Go',
        token: token,
        build_server: 'https://e2.yotools.net',
        build_server_id: 1,
        ...(radio ? { "radio0[radio]": radio } : '')
    }
    for (let texts of text) form.append("text[]", texts)
    for (let key in forms) form.append(key, forms[key]) /*
    form.append("submit", "Go")
    form.append("token", token)
    form.append("build_server", "https://photooxy.com")
    form.append("build_server_id", 1) */
    const geturl2 = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "GoogleBot",
        Cookie: hasilcookie,
        ...form.getHeaders(),
      },
      body: form.getBuffer(),
    })
    const caritoken2 = await geturl2.text()
    const token2 = /<div id = "form_value".+>(.*?)<\/div>/.exec(caritoken2)
    if (!token2) throw new Error("Token Tidak Ditemukan!!")
    const prosesimage = await post(
      "https://photooxy.com/effect/create-image",
      JSON.parse(token2[1]),
      hasilcookie
    )
    const hasil = await prosesimage.json()
    return `https://e2.yotools.net${hasil.image}`;
}
  
/**
  * TextPro Scraper
  * @function
  * @param {String} url - Your phootoxy url, example https://photooxy.com/logo-and-text-effects/make-tik-tok-text-effect-375.html.
  * @param {String[]} text - Text (required). example ["text", "text 2 if any"]
*/
  
async function textpro(url, text, radio = 'a') {
    if (!/^https:\/\/textpro\.me\/.+\.html$/.test(url)) 
      throw new Error("Invalid URL!\nURL must be: https://textpro.me/")
    const geturl = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "GoogleBot",
      },
    })
    const caritoken = await geturl.text()
    let hasilcookie = geturl.headers
      .get("set-cookie")
      .split(",")
      .map((v) => cookie.parse(v))
      .reduce((a, c) => {
        return { ...a, ...c }
      }, {})
    hasilcookie = {
      __cfduid: hasilcookie.__cfduid,
      PHPSESSID: hasilcookie.PHPSESSID,
    }
    hasilcookie = Object.entries(hasilcookie)
      .map(([name, value]) => cookie.serialize(name, value))
      .join("; ")
    const $ = cheerio.load(caritoken)
    const token = $('input[name="token"]').attr("value")
    const form = new FormData()
    if (typeof text === "string") text = [text];
    let forms = {
        submit: 'Go',
        token: token,
        build_server: 'https://textpro.me',
        build_server_id: 1,
        ...(radio ? { "radio0[radio]": radio } : '')
    }
    for (let texts of text) form.append("text[]", texts)
    for (let key in forms) form.append(key, forms[key]) /*
    form.append("submit", "Go")
    form.append("token", token)
    form.append("build_server", "https://textpro.me")
    form.append("build_server_id", 1) */
    const geturl2 = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "GoogleBot",
        Cookie: hasilcookie,
        ...form.getHeaders(),
      },
      body: form.getBuffer(),
    })
    const caritoken2 = await geturl2.text()
    const token2 = /<div.*?id="form_value".+>(.*?)<\/div>/.exec(caritoken2)
    if (!token2) throw new Error("Token Tidak Ditemukan!!")
    const prosesimage = await post(
      "https://textpro.me/effect/create-image",
      JSON.parse(token2[1]),
      hasilcookie
    )
    const hasil = await prosesimage.json()
    return `https://textpro.me${hasil.fullsize_image}`
}

module.exports = {  }

function pinterest(querry){
	return new Promise(async(resolve,reject) => {
		 axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {
			headers: {
			"cookie" : "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
		}
			}).then(({ data }) => {
		const $ = cheerio.load(data)
		const result = [];
		const hasil = [];
   		 $('div > a').get().map(b => {
        const link = $(b).find('img').attr('src')
            result.push(link)
		});
   		result.forEach(v => {
		 if(v == undefined) return
		 hasil.push(v.replace(/236/g,'736'))
			})
			hasil.shift();
		resolve(hasil)
		})
	})
}

function wallpaper(title, page = '1') {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`)
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let hasil = []
            $('div.grid-item').each(function (a, b) {
                hasil.push({
                    title: $(b).find('div.info > a > h3').text(),
                    type: $(b).find('div.info > a:nth-child(2)').text(),
                    source: 'https://www.besthdwallpaper.com/'+$(b).find('div > a:nth-child(3)').attr('href'),
                    image: [$(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'), $(b).find('picture > source:nth-child(1)').attr('srcset'), $(b).find('picture > source:nth-child(2)').attr('srcset')]
                })
            })
            resolve(hasil)
        })
    })
}

function wikimedia(title) {
    return new Promise((resolve, reject) => {
        axios.get(`https://commons.wikimedia.org/w/index.php?search=${title}&title=Special:MediaSearch&go=Go&type=image`)
        .then((res) => {
            let $ = cheerio.load(res.data)
            let hasil = []
            $('.sdms-search-results__list-wrapper > div > a').each(function (a, b) {
                hasil.push({
                    title: $(b).find('img').attr('alt'),
                    source: $(b).attr('href'),
                    image: $(b).find('img').attr('data-src') || $(b).find('img').attr('src')
                })
            })
            resolve(hasil)
        })
    })
}

function stickersearch(query) {
	return new Promise((resolve) => {
		axios.get(`https://getstickerpack.com/stickers?query=${query}`)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const link = [];
				$('#stickerPacks > div > div:nth-child(3) > div > a').each(function(a, b) {
					link.push($(b).attr('href'))
				})
				rand = link[Math.floor(Math.random() * link.length)]
				axios.get(rand)
					.then(({
						data
					}) => {
						const $$ = cheerio.load(data)
						const url = [];
						$$('#stickerPack > div > div.row > div > img').each(function(a, b) {
							url.push($$(b).attr('src').split('&d=')[0])
						})
						resolve({
							title: $$('#intro > div > div > h1').text(),
							author: $$('#intro > div > div > h5 > a').text(),
							author_link: $$('#intro > div > div > h5 > a').attr('href'),
							sticker: url
						})
					})
			})
	})
}

function quotesAnime() {
    return new Promise((resolve, reject) => {
        const page = Math.floor(Math.random() * 184)
        axios.get('https://otakotaku.com/quote/feed/'+page)
        .then(({ data }) => {
            const $ = cheerio.load(data)
            const hasil = []
            $('div.kotodama-list').each(function(l, h) {
                hasil.push({
                    link: $(h).find('a').attr('href'),
                    gambar: $(h).find('img').attr('data-src'),
                    karakter: $(h).find('div.char-name').text().trim(),
                    anime: $(h).find('div.anime-title').text().trim(),
                    episode: $(h).find('div.meta').text(),
                    up_at: $(h).find('small.meta').text(),
                    quotes: $(h).find('div.quote').text().trim()
                })
            })
            resolve(hasil)
        }).catch(reject)
    })
}

function zippydl(link) {
	return new Promise(async (resolve, reject) => {
		axios.get(link)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const nama = $('#lrbox > div:nth-child(2) > div:nth-child(1) > font:nth-child(4)').text();
				const size = $('#lrbox > div:nth-child(2) > div:nth-child(1) > font:nth-child(7)').text();
				const upload = $('#lrbox > div:nth-child(2) > div:nth-child(1) > font:nth-child(10)').text();
				const getlink = async (u) => {
				const zippy = await axios({
					method: 'GET',
					url: u
				}).then(res => res.data).catch(err => false)
				const $ = cheerio.load(zippy)
				if (!$('#dlbutton').length) {
					return {
						error: true,
						message: $('#lrbox>div').first().text().trim()
					}
				}
				const url = _url.parse($('.flagen').attr('href'), true)
				const urlori = _url.parse(u)
				const key = url.query['key']
				let time;
				let dlurl;
				try {
					time = /var b = ([0-9]+);$/gm.exec($('#dlbutton').next().html())[1]
					dlurl = urlori.protocol + '//' + urlori.hostname + '/d/' + key + '/' + (2 + 2 * 2 + parseInt(time)) + '3/DOWNLOAD'
				} catch (error) {
					time = _math.evaluate(/ \+ \((.*)\) \+ /gm.exec($('#dlbutton').next().html())[1])
					dlurl = urlori.protocol + '//' + urlori.hostname + '/d/' + key + '/' + (time) + '/DOWNLOAD'
				}
				return dlurl
			}
			getlink(link).then(res => {
				var result = {
					title: nama,
					size: size,
					uploaded: upload,
					link: res, 
					ext: nama.split('.').pop()
				}
				resolve(result)
			})
		}).catch(reject)
	})
}

function happymod(query) {
	return new Promise((resolve, reject) => {
		axios.get('https://www.happymod.com/search.html?q=' + query)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const nama = [];
				const link = [];
				const rating = [];
				const thumb = [];
				const format = [];
				$('body > div.container-row.clearfix.container-wrap > div.container-left > section > div > div > h3 > a').each(function(a, b) {
					nem = $(b).text();
					nama.push(nem)
					link.push('https://happymod.com' + $(b).attr('href'))
				})
				$('body > div.container-row.clearfix.container-wrap > div.container-left > section > div > div > div.clearfix > span').each(function(c, d) {
					rat = $(d).text();
					rating.push(rat)
				})
				$('body > div.container-row.clearfix.container-wrap > div.container-left > section > div > a > img').each(function(e, f) {
					thumb.push($(f).attr('data-original'))
				})
				for (let i = 0; i < link.length; i++) {
					format.push({
						title: nama[i],
						thumb: thumb[i],
						rating: rating[i],
						link: link[i]
					})
				}
				const result = {
					data: format
				}
				resolve(result)
			})
		.catch(reject)
	})
}

function sfiledl(link) {
	return new Promise((resolve, reject) => {
		axios.get(link)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const nama = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(2) > b').text();
				const size = $('#download').text().split('Download File')
				const desc = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(7) > center > h1').text();
				const type = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(4) > a:nth-child(3)').text();
				const upload = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(5)').text();
				const uploader = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(4) > a:nth-child(2)').text();
				const download = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(6)').text();
				const link = $('#download').attr('href')
				other = link.split('/')[7].split('&is')[0]
				const format = {
					judul: nama + other.substr(other.length - 6).split('.')[1],
					size: size[1].split('(')[1].split(')')[0],
					type: type,
					mime: other.substr(other.length - 6).split('.')[1],
					desc: desc,
					uploader: uploader,
					uploaded: upload.split('\n - Uploaded: ')[1],
					download_count: download.split(' - Downloads: ')[1],
					link: link
				}
				const result = {
					data: format
				}
				resolve(result)
			})
		.catch(reject)
	})
}

function sfilesearch(query) {
	return new Promise((resolve, reject) => {
		axios.get('https://sfile.mobi/search.php?q=' + query + '&search=Search')
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const result = [];
				const link = [];
				const neme = [];
				const size = [];
				$('div.w3-card.white > div.list > a').each(function(a, b) {
					link.push($(b).attr('href'))
				})
				$('div.w3-card.white > div.list > a').each(function(c, d) {
					name = $(d).text();
					neme.push(name)
				})
				$('div.w3-card.white > div.list').each(function(e, f) {
					siz = $(f).text();
					size.push(siz.split('(')[1])
				})
				for (let i = 0; i < link.length; i++) {
					result.push({
						nama: neme[i],
						size: size[i].split(')')[0],
						link: link[i]
					})
				}
				resolve(result)
			})
		.catch(reject)
	})
}

function happymodl(link) {
	return new Promise((resolve, reject) => {
		axios.get(link)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const link = [];
				const jlink = [];
				const result = [];
				const title = $('body > div > div.container-left > section:nth-child(1) > div > h1').text()
				const info = $('body > div > div.container-left > section:nth-child(1) > div > ul').text()
				$('body > div.container-row.clearfix.container-wrap.pdt-font-container > div.container-left > section:nth-child(1) > div > div:nth-child(3) > div > p > a').each(function(a, b) {
					deta = $(b).text();
					jlink.push(deta)
					if ($(b).attr('href').startsWith('/')) {
						link.push('https://happymod.com' + $(b).attr('href'))
					} else {
						link.push($(b).attr('href'))
					}
				})
				for (let i = 0; i < link.length; i++) {
					result.push({
						title: jlink[i],
						dl_link: link[i]
					})
				}
				resolve({
					title: title,
					info: info.replace(/\t|- /g, ''),
					download: link
				})
			})
			.catch(reject)
	})
}

async function speedVideo(path, kecepatan) {
	return new Promise(async (resolve, reject) => {
		const BodyForm = new FormData()
		BodyForm.append('new-image', fs.createReadStream(path))
		BodyForm.append('new-image-url', '')
		BodyForm.append('upload', 'Upload video!')
		await axios({
			url: "https://s3.ezgif.com/video-speed",
			method: "POST",
			data: BodyForm,
			headers: BodyForm.getHeaders()
		}).then(({ data }) => {
			const $ = cheerio.load(data)
			let File = $('#main > form').find(' input[type=hidden]:nth-child(1)').attr('value')
			let token = $('#main > form').find('input[type=hidden]:nth-child(2)').attr('value')
			const Format = {
				file: File,
				token: token,
				multiplier: kecepatan,
				apply_audio: "on"
			}
			axios({
				url: `https://s3.ezgif.com/video-speed/${File}?ajax=true`,
				method: "POST",
				data: new URLSearchParams(Object.entries(Format)),
				headers: {
					"accept": "*/*",
					"accept-language": "en-US,en;q=0.9,id;q=0.8",
					"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
					"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
				}
			}).then(respon => {
				const ch = cheerio.load(respon.data)
				let result = {
					data: 'https:' + ch('p').find('video > source').attr('src')
				}
				resolve(result)
			}).catch(reject)
		})
	})
}
async function reverseVideo(path, audio) {
	return new Promise(async (resolve, reject) => {
		function muteOrno(audioo ,File, token) {
			if (audioo === true) {
				const Format = {
					file: File,
					token: token,
					audio: "on",
					encoding: "original"
				}
				return Format
			} else if (audioo === false) {
				const Format = {
					file: File,
					token: token,
					mute: "on",
					encoding: "original"
				}
				return Format
			} else {
				const Format = {
					file: File,
					token: token,
					audio: "on",
					encoding: "original"
				}
				return Format
			}
		}
	const BodyForm = new FormData()
		BodyForm.append('new-image', fs.createReadStream(path))
		BodyForm.append('new-image-url', '')
		BodyForm.append('upload', 'Upload video!')
		await axios({
			url: "https://s3.ezgif.com/reverse-video",
			method: 'POST',
			data: BodyForm,
			headers: BodyForm.getHeaders()
		}).then(async respon => {
			const $ = cheerio.load(respon.data)
			let File = $('#main > form').find('input[type=hidden]:nth-child(1)').attr('value')
			let token = $('#main > form').find('input[type=hidden]:nth-child(2)').attr('value')
			const Format = await muteOrno(audio, File, token)
			axios(`https://s3.ezgif.com/reverse-video/${File}?ajax=true`, {
				method: "POST",
				data: new URLSearchParams(Object.entries(Format)),
				headers: {
					"accept": "*/*",
					"accept-language": "en-US,en;q=0.9,id;q=0.8",
					"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
					"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\""
				}
			}).then(res => {
				const ch = cheerio.load(res.data)
				let Link = ch('p > video').find('source').attr('src')
				let Type = ch('p > video').find('source').attr('type')
				const result = {
					result: {
						link: "https:" + Link,
						type: Type
					}
				}
				resolve(result)
			}).catch(reject)
		}).catch(reject)
	})
}

function aiovideodl(link) {
    return new Promise((resolve, reject) => {
        axios({
            url: 'https://aiovideodl.ml/',
            method: 'GET',
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "cookie": "PHPSESSID=69ce1f8034b1567b99297eee2396c308; _ga=GA1.2.1360894709.1632723147; _gid=GA1.2.1782417082.1635161653"
            }
        }).then((src) => {
            let a = cheerio.load(src.data)
            let token = a('#token').attr('value')
            axios({
                url: 'https://aiovideodl.ml/wp-json/aio-dl/video-data/',
                method: 'POST',
                headers: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "cookie": "PHPSESSID=69ce1f8034b1567b99297eee2396c308; _ga=GA1.2.1360894709.1632723147; _gid=GA1.2.1782417082.1635161653"   
                },
                data: new URLSearchParams(Object.entries({ 'url': link, 'token': token }))
            }).then(({ data }) => {
                resolve(data)
            })
        })
    })
}

function rexdl(query) {
	return new Promise((resolve) => {
		axios.get('https://rexdl.com/?s=' + query)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const judul = [];
				const jenis = [];
				const date = [];
				const desc = [];
				const link = [];
				const thumb = [];
				const result = [];
				$('div > div.post-content').each(function(a, b) {
					judul.push($(b).find('h2.post-title > a').attr('title'))
					jenis.push($(b).find('p.post-category').text())
					date.push($(b).find('p.post-date').text())
					desc.push($(b).find('div.entry.excerpt').text())
					link.push($(b).find('h2.post-title > a').attr('href'))
				})
				$('div > div.post-thumbnail > a > img').each(function(a, b) {
					thumb.push($(b).attr('data-src'))
				})
				for (let i = 0; i < judul.length; i++) {
					result.push({
						creator: 'Fajar Ihsana',
						judul: judul[i],
						kategori: jenis[i],
						upload_date: date[i],
						deskripsi: desc[i],
						thumb: thumb[i],
						link: link[i]
					})
				}
				resolve(result)
			})
	})
}
function rexdldown(link) {
	return new Promise((resolve) => {
		axios.get(link)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const link = [];
				const url = [];
				const link_name = [];
				const judul = $('#page > div > div > div > section > div:nth-child(2) > article > div > h1.post-title').text();
				const plink = $('#page > div > div > div > section > div:nth-child(2) > center:nth-child(3) > h2 > span > a').attr('href')
				axios.get(plink)
					.then(({
						data
					}) => {
						const $$ = cheerio.load(data)
						$$('#dlbox > ul.dl > a > li > span').each(function(a, b) {
							deta = $$(b).text();
							link_name.push(deta)
						})
						$$('#dlbox > ul.dl > a').each(function(a, b) {
							url.push($$(b).attr('href'))
						})
						for (let i = 0; i < link_name.length; i++) {
							link.push({
								link_name: link_name[i],
								url: url[i]
							})
						}
						resolve({
							creator: 'Fajar Ihsana',
							judul: judul,
							update_date: $$('#dlbox > ul.dl-list > li.dl-update > span:nth-child(2)').text(),
							version: $$('#dlbox > ul.dl-list > li.dl-version > span:nth-child(2)').text(),
							size: $$('#dlbox > ul.dl-list > li.dl-size > span:nth-child(2)').text(),
							download: link
						})
					})
			})
	})
}

async function lyrics(querry) {
	return new Promise(async (resolve, reject) => {
		await axios.request({
			url: "https://www.musixmatch.com/search/" + querry,
			method: "GET",
			headers: {
				"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"accept-language": "en-US,en;q=0.9,id;q=0.8",
				"cache-control": "max-age=0",
				"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\""
			}
		}).then(async res => {
			const ch = cheerio.load(res.data)
			let Url = ch('#search-all-results').find('div.main-panel > div:nth-child(1) > div.box-content > div > ul > li > div > div.media-card-body > div > h2 > a').attr('href')
			await axios.request({
				url: "https://www.musixmatch.com"+ Url,
				method: "GET",
				data: null,
				headers: {
					"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
					"accept-language": "en-US,en;q=0.9,id;q=0.8",
					"cache-control": "max-age=0",
					"if-none-match": "W/\"252c5-LEqIxy/rzHPI2QxgG5//NcL3YjQ\"",
					"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
					'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36'
				}
			}).then(({ data }) => {
				const $ = cheerio.load(data)
				let judul = $('#site > div > div > div > main > div > div > div.mxm-track-banner.top > div > div > div').find('div.col-sm-10.col-md-8.col-ml-9.col-lg-9.static-position > div.track-title-header > div.mxm-track-title > h1').text().trim()
				let artis = $('#site > div > div > div > main > div > div > div > div > div > div > div> div > div > h2 > span').text().trim()
				let thumb = $('#site > div > div > div > main > div > div > div.mxm-track-banner.top > div > div > div').find('div.col-sm-1.col-md-2.col-ml-3.col-lg-3.static-position > div > div > div > img').attr('src')
				let lirik = []
				$('#site > div > div > div > main > div > div > div.mxm-track-lyrics-container').find('div.container > div > div > div > div.col-sm-10.col-md-8.col-ml-6.col-lg-6 > div.mxm-lyrics').each(function (a, b) {
					let isi = $(b).find('span').text().trim()
					lirik.push(isi)
				})
				const result = {
					result: {
						judul: judul.replace('Lyrics', ''),
						penyanyi: artis,
						thumb: "https:" + thumb,
						lirik: lirik[0]
					}
				}
				resolve(result)
			}).catch(reject)
		})
	})
} 

async function emoji(emoticon) {
	return new Promise(async (resolve, reject) => {
	    axios.get(`https://emojipedia.org/${encodeURI(`${emoticon}`)}/`).then(link => { 
	        const $ = cheerio.load(link.data)
	        let apple = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(1) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
	        let google = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(2) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    	    let samsung = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(3) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	let microsoft = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(4) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	let whatsapp = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(5) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	let twitter = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(6) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	let facebook = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(7) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	let jooxpixel = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(8) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	let openmoji = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(9) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	let emojidex = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(10) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	let messager = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(11) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	let LG = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(12) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	let HTC = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(13) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	let mozilla = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(14) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	let softbank = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(15) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	let docomo = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(16) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	let KDDI = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(17) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
        	const result = {
        		apple: apple.replace('120', '240'),
        		google: google.replace('120', '240'),
        		samsung: samsung.replace('120', '240'),
        		microsoft: microsoft.replace('120', '240'),
        		whatsapp: whatsapp.replace('120', '240'),
        		twitter: twitter.replace('120', '240'),
        		facebook: facebook.replace('120', '240'),
        		jooxpixel: jooxpixel.replace('120', '240'),
        		openemoji: openmoji.replace('120', '240'),
        		emojidex: emojidex.replace('120', '240'),
        		messanger: messager.replace('120', '240'),
        		lg: LG.replace('120', '240'),
        		htc: HTC.replace('120', '240'),
        		mozilla: mozilla.replace('120', '240'),
        		softbank: softbank.replace('120', '240'),
        		docomo: docomo.replace('120', '240'),
        		kddi: KDDI.replace('120', '240')
        	}
        	resolve(result)
        }).catch(reject)
    })
}

async function randomcerpen() {
	return new Promise(async (resolve, reject) => {
	    await axios.get(`http://cerpenmu.com/`).then(async (link) => { 
        	const c = cheerio.load(link.data)
        	let kumpulan = []
        	c('#sidebar > div').each(function (real, ra) {
        		c(ra).find('ul > li').each(function (i, rayy) {
        			let random = c(rayy).find('a').attr('href')
        			kumpulan.push(random)
        		})
        	})
        	var acak = kumpulan[Math.floor(Math.random() * (kumpulan.length))]
        	let Otw = await axios.get(`${acak}`)
        	const C = cheerio.load(Otw.data)
        	let otw = []
        	C('#content > article > article').each(function (a, b) {
        		let random = C(b).find('h2 > a').attr('href')
        		otw.push(random)
        	})
        	var Acak = otw[Math.floor(Math.random() * (otw.length))]
        	let Link = await axios.get(`${Acak}`)
        	let $ = cheerio.load(Link.data)
        	let judul = $('#content').find('article > h1').text().trim()
        	let karangan = $('#content').find('article > a:nth-child(2)').text().trim()
        	let Isi = []
        	$('#content > article > p').each(function (wm, Ra) {
        		let isi = $(Ra).text().trim()
        		Isi.push(isi)
        
        	})
        	let cerita = []
        	for (let i of Isi) {
        		cerita += i
        	}
        	const data = {
        		status: 200,
        		result: {
        			judul: judul,
        			penulis: karangan,
        			sumber: Acak,
        			cerita: cerita
        		}
        	}
        	resolve(data)
        }).catch(reject)
    })
}

async function dafontsearch(query) { 
	return new Promise(async (resolve, reject) => {
		let base = `https://www.dafont.com`
        axios.get(`${base}/search.php?q=${query}`).then(res => {
        	let hasil = []
            const $ = cheerio.load(res.data)
            const total = $('div.dffont2').text().split(`fonts on DaFont for ${query}`)[0].trim
            $('div').find('div.container > div > div.preview').each(function(a, b) {
                $('div').find('div.container > div > div.lv1left.dfbg').each(function(c, d) { 
                    $('div').find('div.container > div > div.lv1right.dfbg').each(function(e, f) { 
                        let link = `${base}/` + $(b).find('a').attr('href')
                        let judul = $(d).text() 
                        let style = $(f).text() 
                        hasil.push({ 
                        	judul, 
                            style, 
                            link, 
                            total
                        })
                    }) 
                }) 
            }) 
            resolve(hasil)
        }).catch(reject)
    })
}

async function dafontdl(link) { 
	return new Promise(async (resolve, reject) => {
        axios.get(link).then(des => {
            const sup = cheerio.load(des.data)
            const result = []
            let style = sup('div').find('div.container > div > div.lv1right.dfbg').text() 
            let judul = sup('div').find('div.container > div > div.lv1left.dfbg').text() 
            try {
                isi = sup('div').find('div.container > div > span').text().split('.ttf')
                output = sup('div').find('div.container > div > span').eq(0).text().replace('ttf' , 'zip')
            } catch {
                isi = sup('div').find('div.container > div > span').text().split('.otf')
                output = sup('div').find('div.container > div > span').eq(0).text().replace('otf' , 'zip')
            }
            let down = 'http:' + sup('div').find('div.container > div > div.dlbox > a').attr('href')
            result.push({ style, judul, isi, output, down})
            resolve(result)
        }).catch(reject)
    })
}

async function iplookup(query) { 
    return new Promise(async (resolve, reject) => {
        node("http://ip-api.com/json/"+query+"?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query").then(async (res) => {
            let json = await res.json()
            if (json.status !== 'success') return reject({ status: 404, message: 'Invalid query', query }) 
            json.status = 200
            console.log(json)
            resolve(json)
        }).catch(reject)
    })
}

async function soundcloud(link) { 
	return new Promise((resolve, reject) => {
		const options = {
			method: 'POST',
			url: "https://www.klickaud.co/download.php",
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			formData: {
				'value': link,
				'2311a6d881b099dc3820600739d52e64a1e6dcfe55097b5c7c649088c4e50c37': '710c08f2ba36bd969d1cbc68f59797421fcf90ca7cd398f78d67dfd8c3e554e3'
			}
		};
		request(options, async function(error, response, body) {
			if (error) throw new Error(error);
			const $ = cheerio.load(body)
			resolve({
				judul: $('#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(2)').text(),
				download_count: $('#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(3)').text(),
				thumb: $('#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(1) > img').attr('src'),
				link: $('#dlMP3').attr('onclick').split(`downloadFile('`)[1].split(`',`)[0]
			})
		})
	})
}

async function igstalk(username) { 
    return new Promise(async(resolve, reject) => {
    let {data} = await axios('https://www.instagram.com/'+username+'/?__a=1', {
        'method': 'GET',
        'headers': {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
        'cookie': 'ig_did=77ADA31F-4AB0-4D19-8875-522C891A60E6; ig_nrcb=1; csrftoken=Zuy4R9169ejQY0R20InUOfeh2fCh7cfW; ds_user_id=8779859677; sessionid=8779859677%3Az2RfuCb1tsxTh1%3A26; shbid="10275\0548779859677\0541665541164:01f7683f87e5d1e3c2db8b41bfad455d2718c549ac0aeba033c00ae0e25647a7d8b87ee1"; shbts="1634005164\0548779859677\0541665541164:01f7df3ebca9d4ae3ecdb5f3b25d845142e5f462409976c5c140ba803c85bdd15fe0d45e"; rur="EAG\0548779859677\0541665541186:01f7c8bdbba6bfaf1f0fc03d5b843fe864bb908dc49069cc77dd546a9c6b50302d83b608"'
        }
    })
    let user = data.graphql.user
    let json = {
        status: 'ok',
        code: 200,
        username: user.username,
        fullname: user.full_name,
        verified: user.is_verified,
        video_count_reel: user.highlight_reel_count,
        followers: user.edge_followed_by.count,
        follow: user.edge_follow.count,
        is_bussines: user.is_business_account,
        is_professional: user.is_professional_account,
        category: user.category_name,
        thumbnail: user.profile_pic_url_hd,
        bio: user.biography,
        info_account: data.seo_category_infos
    }
    resolve(json)
})
} 


module.exports = { 
	ephoto, 
    photooxy,
    textpro,
    pinterest,
    wallpaper,
    wikimedia,
    quotesAnime,
    aiovideodl,
    stickersearch,
    happymod,
    happymodl, 
    sfilesearch, 
    sfiledl,
    zippydl,
    speedVideo, 
    reverseVideo, 
    rexdldown, 
    rexdl, 
    lyrics, 
    emoji,
    randomcerpen,
    dafontsearch, 
    dafontdl, 
    iplookup, 
    soundcloud, 
    igstalk
}