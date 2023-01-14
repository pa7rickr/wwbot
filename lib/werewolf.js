exports.messagePlayerNight = () => { 
    return [
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
l`*[ Werewolf - Game ]*

🌝 Ini saatnya *werewolf/seer/guardian* melakukan aksinya di malam hari! Jangan lupa, semua pemain harus tenang dan membiarkan aksi terjadi. 🌑

Untuk pemain *werewolf/seer/guardian*, silahkan melihat pesan yang dikirim oleh bot 🤖.

Jangan lupa, selama malam hari kita harus tetap diam dan menjaga rahasia kita 🤫

Semoga malam ini kita bisa memenangkan permainan 🏆`,
`*[ Werewolf - Game ]*

🌒 90 detik untuk werewolf/guardian/seer akan menjalankan tugas mereka. Jangan lupa, semua pemain harus tenang dan membiarkan aksi terjadi. 🌒

Untuk pemain *werewolf/seer/guardian*, silahkan melihat pesan yang dikirim oleh bot 🤖.

Jangan lupa, selama malam hari kita harus tetap diam dan menjaga rahasia kita 🤫

Semoga malam ini kita bisa memenangkan permainan 🏆`
    ][Math.floor(Math.random() * 6)]
}

exports.playerNightAction = (role, listString) => { 
    if (role == 1) return [
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

⚠️ *Ingat*, kamu hanya bisa menerawang satu pemain saat ini!`
    ][Math.floor(Math.random() * 4)]
    if (role == 2) return [
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

⚠️ *Ingat*, kamu hanya bisa menerawang satu pemain saat ini!`
    ][Math.floor(Math.random() * 5)]
    if (role == 3) return [
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

⚠️ *Ingat*, kamu hanya bisa melindungi satu pemain saat ini!`
    ][Math.floor(Math.random() * 5)]
}

exports.nightResult = (action, killedPlayer, killedPlayerString, protectedPlayerString, game) => { 
    if (action == 1) return `*[ Werewolf - Game ]*

🎉 Wow, selamat @${killedPlayer.id}! 

😅 Kamu hampir terbunuh oleh werewolf tapi ternyata kamu dilindungi oleh guardian. Kamu masih bisa melanjutkan permainan dengan selamat ??

☀️ Siang hari hampir tiba, siapkan strategimu untuk mengalahkan werewolf 🐺`

    if (action == 2) return '*[ Werewolf - Game ]*\n\n😔 Yahh, Anda telah terbunuh oleh werewolf dan tidak bisa melanjutkan permainan. 🙏'
    if (action == 3) return `*[ Werewolf - Game ]*

🌅 Pagi hari sudah tiba! 
🌙 Pada saat malam hari saat itu,

🐺 Tiba-tiba pemain @${killedPlayerString} dibunuh oleh werewolf. 

👤 Peran dari pemain @${killedPlayer.id} adalah ${killedPlayer.role}.

⛅ Matahari hampir tepat diatas kita, silahkan bersiap - siap pada siang hari yang akan datang!

📆 Hari ke - ${game.total}`

    if (action == 4) return `*[ Werewolf - Game ]*

🌅 Pagi hari sudah tiba! 
🌙 Pada saat malam hari saat itu,

👤 Tiba-tiba pemain @${killedPlayerString} dibunuh oleh werewolf. 

👤 Peran dari pemain @${killedPlayer.id} adalah ${killedPlayer.role}.

🛡️ Tetapi terdapat pemain @${protectedPlayerString} yang berhasil diselamatkan oleh guardian.

⛅ Matahari hampir tepat diatas kita, silahkan bersiap - siap pada siang hari yang akan datang!

📆 Hari ke - ${game.total}`

    if (action == 5) return `*[ Werewolf - Game ]*

🌅 Pagi hari sudah tiba! 
🌙 Pada saat malam hari saat itu,
👤 Tidak ada pemain yang dibunuh oleh werewolf.

⛅ Matahari hampir tepat diatas kita, silahkan bersiap - siap pada siang hari yang akan datang!

📆 Hari ke - ${game.total}`
}

exports.endVoting = (action, getVotedListString, nonVotersListString) => {
    if (action == 1) return `*[ Werewolf - Game ]*

Pemberian hasil voting telah selesai! 

🗳️ Berikut adalah list pemain yang memiliki jumlah voting terbanyak:
${getVotedListString()}

✖️ Pemain yang tidak ikut voting: 
${nonVotersListString()}

📊 Karena terdapat jumlah voting yang sama-sama tinggi,
👤 Tidak ada pemain yang akan dibunuh.
🌙 Sepertinya hari mulai menjadi gelap.

🔥 Semangat untuk malam hari yang akan datang!`

    if (action == 2) return `*[ Werewolf - Game ]*

Pemberian hasil voting telah selesai! 

📊 Tidak ada pemain yang memberikan suara.
🗣️ Mari kita sama-sama lebih aktif dan bertanggung jawab dalam voting nanti.
🌙 Sepertinya hari mulai menjadi gelap.

🔥 Semangat untuk malam hari yang akan datang!`

    if (action == 3) return `*[ Werewolf - Game ]*

Pemberian hasil voting telah selesai! 

🗳️ Berikut adalah list pemain yang memiliki jumlah voting terbanyak:
${getVotedListString()}

✖️ Pemain yang tidak ikut voting: 
${nonVotersListString}`

}

exports.discussionTime = () => { 
    return [
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

📆 Hari ke - ${game.total}`
    ][Math.floor(Math.random() * 5)]
}

exports.winnerText = (action) => { 
    if (action == 1) return [
`*[ Werewolf - Game ]*

🥳 Selamat kepada tim werewolf! 
🎉 Kalian berhasil mengalahkan tim villagers!
🎮 Permainan telah selesai. Terimakasih telah bermain!`,
l`[ Werewolf - Game ]

😌 Yahhh! Tim werewolf berhasil memenangkan permainan! 🐺🔥 

🎮 Permainan telah selesai, terima kasih telah bermain bersama kami. Semoga menyenangkan! 😁`,
`[ Werewolf - Game ]
Gila! Tim werewolf berhasil mengalahkan tim villagers! 🌙🌟 

🎮 Permainan ini sudah berakhir, terima kasih telah bergabung. Sampai jumpa di permainan selanjutnya! 🙌`,
`*[ Werewolf - Game ]*

Wahh, kemenangan untuk tim werewolf! 🐺🎉 

🎮 Permainan telah selesai, terima kasih atas kesediaan bermain bersama kami. Sampai jumpa di permainan selanjutnya!`
    ][Math.floor(Math.random() * 3)]
    
    if (action == 2) return [
`*[ Werewolf - Game ]*

🥳 Selamat kepada tim villagers! 
🎉 Kalian berhasil mengalahkan werewolf dan menyelamatkan desa kalian!
🎮 Permainan telah selesai. Terimakasih telah bermain!`,
`[ Werewolf - Game ]*

🎮 Permainan telah selesai, dan hasilnya adalah kemenangan untuk tim villagers! Yuhuu 🎉

Terima kasih telah bermain bersama kami. 😄😄😄`,
`*[ Werewolf - Game ]*

🎉 Horeee, tim villagers menang! Kalian telah membuktikan bahwa kalian memiliki kekuatan dan kecerdasan yang tidak terkalahkan. 🎉🎉🎉

Terima kasih telah bermain bersama kami, semoga kita bisa bermain lagi suatu saat nanti. 😍😍😍`
    ][Math.floor(Math.random() * 3)]  
}