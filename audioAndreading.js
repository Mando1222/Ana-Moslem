const surahSelect = document.getElementById("surahSelect");
const reciterSelect = document.getElementById("reciterSelect");
const container = document.getElementById("surah");
const player = document.getElementById("player");

let ayahs = [];
let currentIndex = 0;

// تحميل قائمة السور
fetch("https://api.alquran.cloud/v1/surah")
.then(res => res.json())
.then(data => {
  data.data.forEach(surah => {
    const option = document.createElement("option");
    option.value = surah.number;
    option.textContent = surah.number + " - " + surah.name;
    surahSelect.appendChild(option);
  });

  loadSurah(1);
});

surahSelect.addEventListener("change", () => {
  loadSurah(surahSelect.value);
});

function loadSurah(number) {
  container.innerHTML = "";
  fetch(`https://api.alquran.cloud/v1/surah/${number}`)
  .then(res => res.json())
  .then(data => {
    ayahs = data.data.ayahs;

    ayahs.forEach((ayah, index) => {
      const span = document.createElement("span");
      span.classList.add("ayah");
      span.innerText = ayah.text + " (" + ayah.numberInSurah + ")";
      span.dataset.index = index;

      span.addEventListener("click", () => {
        playAyah(index);
      });

      container.appendChild(span);
    });
  });
}

function playAyah(index) {
  document.querySelectorAll(".ayah").forEach(a => a.classList.remove("active"));

  const ayahElement = document.querySelector(`.ayah[data-index='${index}']`);
  ayahElement.classList.add("active");

  const surah = String(surahSelect.value).padStart(3, '0');
  const ayahNum = String(ayahs[index].numberInSurah).padStart(3, '0');
  const reciter = reciterSelect.value;

  player.src = `https://everyayah.com/data/${reciter}/${surah}${ayahNum}.mp3`;
  player.play();

  currentIndex = index;
}

player.addEventListener("ended", () => {
  if (currentIndex + 1 < ayahs.length) {
    playAyah(currentIndex + 1);
  }
});

function playAll() {
  playAyah(0);
}
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

// تشغيل / إيقاف
function togglePlay() {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
}

// Dark Mode
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// تحديث شريط التقدم
player.addEventListener("loadedmetadata", () => {
  progressBar.max = player.duration;
  durationEl.textContent = formatTime(player.duration);
});

player.addEventListener("timeupdate", () => {
  progressBar.value = player.currentTime;
  currentTimeEl.textContent = formatTime(player.currentTime);
});

// تغيير الوقت من الشريط
progressBar.addEventListener("input", () => {
  player.currentTime = progressBar.value;
});

// تنسيق الوقت
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
const stickyProgress = document.getElementById("stickyProgress");

// التالي
function nextAyah() {
  if (currentIndex + 1 < ayahs.length) {
    playAyah(currentIndex + 1);
  }
}

// السابق
function prevAyah() {
  if (currentIndex - 1 >= 0) {
    playAyah(currentIndex - 1);
  }
}

// تحديث شريط الـ Sticky
player.addEventListener("timeupdate", () => {
  stickyProgress.max = player.duration;
  stickyProgress.value = player.currentTime;
});

// تحريك الصوت من الشريط
stickyProgress.addEventListener("input", () => {
  player.currentTime = stickyProgress.value;
});

// Scroll تلقائي للآية
function playAyah(index) {
  document.querySelectorAll(".ayah").forEach(a => a.classList.remove("active"));

  const ayahElement = document.querySelector(`.ayah[data-index='${index}']`);
  ayahElement.classList.add("active");

  ayahElement.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  const surah = String(surahSelect.value).padStart(3, '0');
  const ayahNum = String(ayahs[index].numberInSurah).padStart(3, '0');
  const reciter = reciterSelect.value;

  player.src = `https://everyayah.com/data/${reciter}/${surah}${ayahNum}.mp3`;
  player.play();

  currentIndex = index;
}