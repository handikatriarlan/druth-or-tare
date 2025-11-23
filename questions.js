export const questions = {
    santai: {
        truths: [
            "Apa makanan favorit yang bisa kamu makan setiap hari?",
            "Siapa selebriti yang pengen banget kamu temui?",
            "Apa hobi aneh yang kamu punya?",
            "Kalau punya uang 1 miliar, apa yang pertama kali kamu beli?",
            "Pernah gak salah kirim chat? Ceritain dong.",
            "Apa film kartun favoritmu waktu kecil?",
            "Siapa member di sini yang menurutmu paling lucu?",
            "Apa lagu yang lagi sering kamu dengerin akhir-akhir ini?",
            "Kalau bisa punya kekuatan super, mau kekuatan apa?",
            "Apa kejadian lucu yang baru aja kamu alamin minggu ini?"
        ],
        dares: [
            "Kirim stiker paling aneh yang kamu punya.",
            "Ganti nickname jadi 'Aku Sayang Admin' selama 10 menit.",
            "Nyanyi potong bebek angsa pakai vn.",
            "Kirim foto wallpaper HP kamu sekarang.",
            "Tulis nama kamu pake siku di chat.",
            "Spam emoji 🐢 sebanyak 10 kali.",
            "Screenshot home screen HP kamu dan kirim sini.",
            "Bilang 'Meong' di setiap akhir kalimat selama 5 menit.",
            "Kirim foto benda berwarna merah yang ada di dekatmu.",
            "Sebutin 3 hal yang kamu suka dari diri sendiri."
        ]
    },
    gila: {
        truths: [
            "Pernah ngompol pas udah gede? Kapan?",
            "Siapa orang di server ini yang diam-diam kamu kagumi?",
            "Apa hal paling memalukan yang pernah kamu lakuin di depan gebetan?",
            "Pernah bohong sakit biar gak sekolah/kerja?",
            "Siapa mantan yang paling nyesel kamu putusin?",
            "Pernah gak mandi lebih dari 2 hari? Kenapa?",
            "Apa aib terbesar yang orang tua kamu gak tau?",
            "Pernah stalk sosmed mantan pake akun fake?",
            "Siapa orang yang paling pengen kamu block di sosmed tapi gak enak?",
            "Apa kebohongan terparah yang pernah kamu ucapin ke pacar?"
        ],
        dares: [
            "Chat mantan bilang 'Aku kangen' terus screenshot.",
            "Ganti foto profil jadi foto aib (minta member lain yang pilih) selama 1 jam.",
            "Telepon random member di server ini dan nyanyi Happy Birthday.",
            "Teriak 'AKU JOMBLO' sekencang-kencangnya di vn.",
            "Chat orang tua kamu bilang 'Aku mau nikah besok'.",
            "Post foto selfie jelek di story WA/IG sekarang.",
            "Gombalin salah satu member di sini (random) pake voice note.",
            "Makan cabe rawit satu biji (kirim video/foto).",
            "Push up 20 kali sambil video call.",
            "Joget TikTok random dan kirim videonya ke sini."
        ]
    },
    deep: {
        truths: [
            "Kapan terakhir kali kamu nangis dan kenapa?",
            "Apa ketakutan terbesar kamu dalam hidup?",
            "Apa penyesalan terbesar kamu sejauh ini?",
            "Siapa orang yang paling berjasa di hidup kamu?",
            "Apa mimpi yang belum kesampaian sampai sekarang?",
            "Kalau bisa memutar waktu, momen apa yang pengen kamu ubah?",
            "Apa hal yang bikin kamu insecure?",
            "Siapa orang yang paling kamu sayang di dunia ini?",
            "Apa arti kebahagiaan menurut kamu?",
            "Pernah merasa kesepian di tengah keramaian? Ceritain."
        ],
        dares: [
            "Ceritain satu rahasia yang belum pernah kamu ceritain ke siapa pun di sini.",
            "Kirim pesan suara buat diri kamu di masa depan (1 menit).",
            "Minta maaf ke satu orang yang pernah kamu sakiti (bisa di server ini atau luar).",
            "Tulis pesan terima kasih buat orang tua kamu dan kirim screenshot-nya.",
            "Jujur tentang perasaan kamu ke seseorang di server ini (kalau ada).",
            "Ceritain momen terberat dalam hidup kamu.",
            "Sebutin 3 sifat jelek kamu yang pengen kamu ubah.",
            "Peluk orang yang ada di dekatmu sekarang (kalau ada) dan bilang sayang.",
            "Kirim foto masa kecil kamu yang paling berkesan.",
            "Doakan satu hal baik buat semua member di server ini."
        ]
    }
};

export function getRandomQuestion(type) {
    // Merge all categories
    const allTruths = [
        ...questions.santai.truths,
        ...questions.gila.truths,
        ...questions.deep.truths
    ];

    const allDares = [
        ...questions.santai.dares,
        ...questions.gila.dares,
        ...questions.deep.dares
    ];

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    if (type === 'truth') return getRandom(allTruths);
    if (type === 'dare') return getRandom(allDares);

    // Random
    return Math.random() < 0.5 ? getRandom(allTruths) : getRandom(allDares);
}
