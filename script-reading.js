// إنشاء قائمة الأيام
for (let i = 1; i <= 30; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = "اليوم " + i + " (الجزء " + i + ")";
    document.getElementById("daySelect").appendChild(option);
}

function loadReading() {
    const day = parseInt(document.getElementById("daySelect").value);
    const prayer = parseInt(document.getElementById("prayerSelect").value);

    fetch(`https://api.alquran.cloud/v1/juz/${day}/ar`)
        .then(res => res.json())
        .then(data => {
            const ayahs = data.data.ayahs;
            const perPrayer = Math.floor(ayahs.length / 5);
            const start = prayer * perPrayer;
            const end = (prayer === 4) ? ayahs.length : start + perPrayer;

            const ayatDiv = document.getElementById("ayat");
            ayatDiv.innerHTML = "";

            document.getElementById("info").innerHTML =
                "📅 اليوم " + day + " — الجزء " + day;

            let lastSurah = null;

            for (let i = start; i < end; i++) {
                const ayah = ayahs[i];
                const surahNumber = ayah.surah.number;
                let text = ayah.text;

                // إزالة أي بسملة داخل الآية نفسها
                if (ayah.numberInSurah === 1 && text.startsWith("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")) {
                    text = text.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "").trim();
                }

                // إضافة البسملة في بداية كل سورة ما عدا سورة التوبة (9)
                if (lastSurah !== surahNumber && surahNumber !== 9) {
                    let basmalaDiv = document.createElement("div");
                    basmalaDiv.className = "basmala";
                    basmalaDiv.textContent = "بسم الله الرحمن الرحيم";
                    ayatDiv.appendChild(basmalaDiv);
                }

                lastSurah = surahNumber;

                // عرض الآية
                let ayahSpan = document.createElement("span");
                ayahSpan.textContent = text + " (" + ayah.numberInSurah + ") ";
                ayatDiv.appendChild(ayahSpan);
            }
        });
}

// تأثير تحميل الصفحة
document.addEventListener("DOMContentLoaded", function(){
    document.body.classList.add("page-loaded");
});
