document.addEventListener("DOMContentLoaded", function(){

    const surahSelect = document.getElementById("surahSelect");
    const surahNames = [
        "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال",
        "التوبة","يونس","هود","يوسف","الرعد","ابراهيم","الحجر","النحل","الإسراء","الكهف",
        "مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل",
        "القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات",
        "ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد",
        "الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد",
        "المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم",
        "الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان",
        "المرسلات","النبأ","النازعات","عبس","التكوير","الإنفطار","المطففين","الإنشقاق","البروج",
        "الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين",
        "العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة",
        "الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"
    ];

    surahNames.forEach((name,index)=>{
        let option = document.createElement("option");
        option.value = index + 1;
        option.textContent = name;
        surahSelect.appendChild(option);
    });

    document.getElementById("playBtn").addEventListener("click", function(){
        const surahNum = String(surahSelect.value).padStart(3,'0');
        const reader = document.getElementById("readerSelect").value;
        const readers = {
            ajmi: "https://download.quranicaudio.com/quran/ahmed_ibn_3ali_al-3ajamy/"
        };
            const audioURL = readers[reader] + surahNum + ".mp3";

        document.getElementById("audioPlayer").innerHTML = `
            <audio controls autoplay>
                <source src="${audioURL}" type="audio/mpeg">
                متصفحك لا يدعم تشغيل الصوت.
            </audio>
        `;
    });
});

function goHome(){
    window.location.href = "index.html";
}
