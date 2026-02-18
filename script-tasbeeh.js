// بيانات الأذكار
const tasbeehTexts = {
    subhan1: [
        "سبحان الله",
        "سبحان الله وبحمده",
        "سبحان الله العظيم",
        "سبحان الله وبحمده، سبحان الله العظيم"
    ],
    hamd1: [
        "الحمد لله",
        "الحمد لله رب العالمين",
        "الحمد لله حمداً كثيراً طيباً مباركاً فيه"
    ],
    istighfar1: [
        "أستغفر الله",
        "أستغفر الله وأتوب إليه",
        "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه"
    ],
    tahleel1: [
        "لا إله إلا الله",
        "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
        "لا إله إلا أنت سبحانك إني كنت من الظالمين"
    ],
    takbeer1: [
        "الله أكبر",
        "الله أكبر كبيراً، والحمد لله كثيراً، وسبحان الله بكرةً وأصيلاً"
    ],
    salah1: [
        "اللهم صلِّ على محمد",
        "اللهم صلِّ وسلم على نبينا محمد",
        "اللهم صلِّ وسلم وبارك على نبينا محمد"
    ],
    baqiyat1: [
        "سبحان الله",
        "الحمد لله",
        "لا إله إلا الله",
        "الله أكبر",
        "ولا حول ولا قوة إلا بالله"
    ]
};

// عداد الذكر
let counters = JSON.parse(localStorage.getItem("tasbeehData")) || {};
let currentZekr = null;

// الانتقال للقائمة
function animateAndGo(url){
    history.pushState(null, "", url);
    setTimeout(()=>{ window.location.href = url; }, 200);
}

function goToList(id,title){
    animateAndGo(`list.html?type=${id}&title=${encodeURIComponent(title)}`);
}

function goHome(){ window.location.href = "index.html"; }

function goBackToList(){
    const params = new URLSearchParams(window.location.search);
    animateAndGo(`list.html?type=${params.get("type")}&title=${params.get("title")}`);
}

function goBackToMain(){ window.location.href="tasbeehMain.html"; }

// تحميل قائمة الأذكار في list.html
if(window.location.pathname.includes("list.html")){
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const title = params.get("title");

    document.getElementById("listTitle").innerText = title;

    const container = document.getElementById("listContainer");

    tasbeehTexts[type].forEach(text=>{
        let btn = document.createElement("button");
        btn.innerText = text;
        btn.onclick = function(){
            animateAndGo(`tasbeeh.html?zekr=${encodeURIComponent(text)}&type=${type}&title=${encodeURIComponent(title)}`);
        };
        container.appendChild(btn);
    });
}

// تحميل السبحة في tasbeeh.html
if(window.location.pathname.includes("tasbeeh.html")){
    const params = new URLSearchParams(window.location.search);
    currentZekr = params.get("zekr");

    document.getElementById("zekrTitle").innerText = currentZekr;
    document.getElementById("counterDisplay").innerText = counters[currentZekr] || 0;
}

function increment(){
    if(!counters[currentZekr]) counters[currentZekr]=0;
    counters[currentZekr]++;
    document.getElementById("counterDisplay").innerText = counters[currentZekr];
    localStorage.setItem("tasbeehData", JSON.stringify(counters));
}

function resetCounter(){
    counters[currentZekr]=0;
    document.getElementById("counterDisplay").innerText = 0;
    localStorage.setItem("tasbeehData", JSON.stringify(counters));
}

// دعم زر الرجوع في الموبايل
window.addEventListener('popstate', function(event) { });
