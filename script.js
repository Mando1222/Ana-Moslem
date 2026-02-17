document.addEventListener("DOMContentLoaded", function(){
    document.body.classList.add("page-loaded");
});

const tasbeehTexts = {
    subhan1: Array.from(new Set([
        "سبحان الله",
        "سبحان الله وبحمده",
        "سبحان الله العظيم",
        "سبحان الله وبحمده، سبحان الله العظيم"
    ])),
    hamd1: Array.from(new Set([
        "الحمد لله",
        "الحمد لله رب العالمين",
        "الحمد لله حمداً كثيراً طيباً مباركاً فيه"
    ])),
    istighfar1: Array.from(new Set([
        "أستغفر الله",
        "أستغفر الله وأتوب إليه",
        "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه"
    ])),
    tahleel1: Array.from(new Set([
        "لا إله إلا الله",
        "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
        "لا إله إلا أنت سبحانك إني كنت من الظالمين"
    ])),
    takbeer1: Array.from(new Set([
        "الله أكبر",
        "الله أكبر كبيراً، والحمد لله كثيراً، وسبحان الله بكرةً وأصيلاً"
    ])),
    salah1: Array.from(new Set([
        "اللهم صلِّ على محمد",
        "اللهم صلِّ وسلم على نبينا محمد",
        "اللهم صلِّ وسلم وبارك على نبينا محمد"
    ])),
    baqiyat1: Array.from(new Set([
        "سبحان الله",
        "الحمد لله",
        "لا إله إلا الله",
        "الله أكبر",
        "ولا حول ولا قوة إلا بالله"
    ]))
};

function animateAndGo(url){
    document.body.classList.remove("page-loaded");

    // إضافة الصفحة إلى التاريخ لتفعيل زر الرجوع
    history.pushState(null, "", url);

    setTimeout(()=>{
        window.location.href = url;
    }, 300);
}

function goToList(id,title){
    animateAndGo(`list.html?type=${id}&title=${encodeURIComponent(title)}`);
}

function goHome(){
    animateAndGo("index.html");
}

function goBackToList(){
    const params = new URLSearchParams(window.location.search);
    animateAndGo(`list.html?type=${params.get("type")}&title=${params.get("title")}`);
}

/* تحميل list.html */
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

/* صفحة السبحة */
let counters = JSON.parse(localStorage.getItem("tasbeehData")) || {};
let currentZekr = null;

if(window.location.pathname.includes("tasbeeh.html")){
    const params = new URLSearchParams(window.location.search);
    currentZekr = params.get("zekr");

    document.getElementById("zekrTitle").innerText = currentZekr;
    document.getElementById("counterDisplay").innerText = counters[currentZekr] || 0;
}

function increment(){
    if(!counters[currentZekr]) counters[currentZekr] = 0;
    counters[currentZekr]++;
    document.getElementById("counterDisplay").innerText = counters[currentZekr];
    localStorage.setItem("tasbeehData", JSON.stringify(counters));
}

function resetCounter(){
    counters[currentZekr] = 0;
    document.getElementById("counterDisplay").innerText = 0;
    localStorage.setItem("tasbeehData", JSON.stringify(counters));
}

/* دعم زر الرجوع في الموبايل */
window.addEventListener('popstate', function(event) {
    // المتصفح سيقوم بالرجوع بشكل طبيعي
    // إذا أردت يمكن إضافة تأثير أنميشن هنا بدون منع العودة
});
