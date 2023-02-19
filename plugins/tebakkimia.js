let fs = require('fs')
let timeout = 60000
let poin = 400
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakkimia = conn.tebakkimia ? conn.tebakkimia : {}
    let id = m.chat
    if (id in conn.tebakkimia) {
        if (conn.tebakkimia[id].length !== 0) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkimia[id][0])
        delete conn.tebakkimia[id]
        throw false
    }
    conn.tebakkimia[id] = []
    let src = JSON.parse(fs.readFileSync(`./src/scrap/tebakkimia.json`))
    let json = src[Math.floor(Math.random() * src.length)]

    //  conn.scrapGame(global.API('lolhuman', '/api/tebak/unsurkimia', '', 'apikey'), 'tebakkimia').catch(e => e)

    let caption = `
*TEBAK UNSUR KIMIA*
Apa nama lain dari unsur *${json.result.lambang}?*

Waktu Jawab: *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
*Reply pesan ini untuk menjawab!*`.trim()
    conn.tebakkimia[id] = [
        await m.reply(caption),
        json, poin,
        setTimeout(() => {
            if (conn.tebakkimia[id]) conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.nama}*`, '', 1, ['Tebak Kimia', `.tebakkimia`], conn.tebakkimia[id][0])
            delete conn.tebakkimia[id]
        }, timeout)
    ]
}
handler.help = ['tebakkimia']
handler.tags = ['game']
handler.command = /^tebakkimia$/i
handler.limit = false
handler.group = true
module.exports = handler