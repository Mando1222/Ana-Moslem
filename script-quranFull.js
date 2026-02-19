document.addEventListener("DOMContentLoaded", function(){
    const surahSelect = document.getElementById("surahSelect");
    const quranDisplay = document.getElementById("quranDisplay");

    // تحميل القرآن من ملف الأوفلاين
    fetch("assets/quran.json")
        .then(res => res.json())
        .then(result => {
            const surahs = result.data.surahs;

            // ملء قائمة السور
            surahs.forEach(surah => {
                const option = document.createElement("option");
                option.value = surah.number;
                option.textContent = `${surah.number} - ${surah.name}`;
                surahSelect.appendChild(option);
            });

            // عرض السورة المختارة
            function displaySurah(surahNumber){
                quranDisplay.innerHTML = "";
                const surah = surahs.find(s => s.number == surahNumber);
                if(!surah) return;

                // اسم السورة
                const title = document.createElement("div");
                title.className = "surah-title";
                title.textContent = surah.name;
                quranDisplay.appendChild(title);

                // البسملة تظهر مرة واحدة فقط بعد اسم السورة (ما عدا سورة التوبة)
                let ayahs = surah.ayahs.slice(); // نسخ الآيات

                if(surah.number !== 9){
                    const basmalaDiv = document.createElement("div");
                    basmalaDiv.className = "basmala";
                    basmalaDiv.textContent = "بسم الله الرحمن الرحيم";
                    quranDisplay.appendChild(basmalaDiv);

                    // إزالة البسملة من أول آية إذا موجودة
                    if(ayahs[0].text.startsWith("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")){
                        ayahs[0].text = ayahs[0].text.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "").trim();
                    }
                }

                // عرض الآيات
                ayahs.forEach(ayah => {
                    const ayahDiv = document.createElement("span");
                    ayahDiv.className = "ayah";
                    ayahDiv.textContent = ayah.text + " (" + ayah.numberInSurah + ")";
                    quranDisplay.appendChild(ayahDiv);
                });
            }

            // عرض أول سورة افتراضي
            displaySurah(1);

            // عند اختيار سورة جديدة
            surahSelect.addEventListener("change", function(){
                displaySurah(this.value);
            });

        })
        .catch(err => {
            console.error("حدث خطأ في تحميل القرآن:", err);
            quranDisplay.innerHTML = "❌ تعذر تحميل القرآن.";
        });
}); // <- نهاية DOMContentLoaded
