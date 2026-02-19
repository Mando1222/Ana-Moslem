// إنشاء قائمة الأيام (1–30)
for (let i = 1; i <= 30; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = "اليوم " + i + " (الجزء " + i + ")";
    document.getElementById("daySelect").appendChild(option);
}

function loadReading() {
    const day = parseInt(document.getElementById("daySelect").value);
    const prayer = parseInt(document.getElementById("prayerSelect").value);

    fetch("assets/quran.json")
    .then(res => res.json())
    .then(result => {
        const surahs = result.data.surahs; // كل السور
        const allAyahs = surahs.flatMap(s => {
            // نضيف رقم السورة واسمها لكل آية
            return s.ayahs.map(a => ({ ...a, surahNumber: s.number, surahName: s.name }));
        });

        const dayAyahs = allAyahs.filter(a => a.juz === day);

        if (!dayAyahs.length) {
            document.getElementById("ayat").innerHTML = "❌ لا توجد آيات لهذا الجزء.";
            return;
        }

        const perPrayer = Math.floor(dayAyahs.length / 5);
        const start = prayer * perPrayer;
        const end = (prayer === 4) ? dayAyahs.length : start + perPrayer;

        const ayatDiv = document.getElementById("ayat");
        ayatDiv.innerHTML = "";

        document.getElementById("info").innerHTML =
            "📅 اليوم " + day + " — الجزء " + day;

        let lastSurah = null;

        for (let i = start; i < end; i++) {
            const ayah = dayAyahs[i];
            if (!ayah || !ayah.text) continue;

            const surahNumber = ayah.surahNumber;
            const surahName = ayah.surahName;
            let text = ayah.text;

            if (ayah.numberInSurah === 1 && text.startsWith("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")) {
                text = text.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "").trim();
            }

            // إضافة اسم السورة + البسملة عند بداية كل سورة جديدة
            if (lastSurah !== surahNumber) {
                let surahDiv = document.createElement("div");
                surahDiv.className = "basmala";
                surahDiv.textContent = surahName;
                ayatDiv.appendChild(surahDiv);

                if (surahNumber !== 9) {
                    let basmalaDiv = document.createElement("div");
                    basmalaDiv.className = "basmala";
                    basmalaDiv.textContent = "بسم الله الرحمن الرحيم";
                    ayatDiv.appendChild(basmalaDiv);
                }
            }

            lastSurah = surahNumber;

            let ayahSpan = document.createElement("span");
            ayahSpan.textContent = text + " (" + ayah.numberInSurah + ") ";
            ayatDiv.appendChild(ayahSpan);
        }
    })
    .catch(err => {
        console.error("حدث خطأ في تحميل القرآن:", err);
        document.getElementById("ayat").innerHTML = "❌ تعذر تحميل القرآن.";
    });
}