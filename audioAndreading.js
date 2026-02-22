const surahSelect = document.getElementById("surahSelect");
const reciterSelect = document.getElementById("reciterSelect");
const quranText = document.getElementById("quranText");
const player = document.getElementById("player");
const floatingPlay = document.getElementById("floatingPlay");
const playIcon = document.getElementById("playIcon");
const darkMode = document.getElementById("darkMode");
const searchInput = document.getElementById("searchInput");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");

let ayahs = [];
let currentIndex = 0;

function toArabicNumber(num) {
  return num.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
}

function goBackToMain() {
    window.location.href = "index.html";
}

/* تحميل أسماء السور */
fetch("https://api.alquran.cloud/v1/surah")
  .then(res => res.json())
  .then(data => {
    data.data.forEach(surah => {
      const option = document.createElement("option");
      option.value = surah.number;
      option.textContent = surah.name;
      surahSelect.appendChild(option);
    });
  });

function loadSurah(autoPlay = false) {
  fetch(`https://api.alquran.cloud/v1/surah/${surahSelect.value}`)
    .then(res => res.json())
    .then(data => {
      const surahData = data.data;
      ayahs = surahData.ayahs;
      quranText.innerHTML = "";

      ayahs.forEach((ayah, index) => {
        const span = document.createElement("span");
        span.classList.add("ayah");
        span.dataset.index = index;

        let text = ayah.text;
        if (index === 0 && surahData.bismillahPre) {
          text = surahData.bismillahPre.text + " " + text;
        }

        span.innerHTML = `
          ${text}
          <span class="ayah-number">${toArabicNumber(ayah.numberInSurah)}</span>
        `;

        quranText.appendChild(span);
        span.addEventListener("click", () => playAyah(index));
      });

      if (autoPlay) {
        let firstInteraction = false;
        function startAudioOnce() {
          if (!firstInteraction) {
            firstInteraction = true;
            playAyah(0);
            document.removeEventListener("click", startAudioOnce);
          }
        }
        document.addEventListener("click", startAudioOnce);
      }
    });
}

function playAyah(index) {
  currentIndex = index;

  const surah = surahSelect.value.padStart(3, "0");
  const ayahNum = ayahs[index].numberInSurah.toString().padStart(3, "0");
  const reciter = reciterSelect.value;

  let audioSrc = "";
  if (index === 0 && surahSelect.value != "9" && ayahs[0].text.startsWith("بسم الله")) {
    audioSrc = `https://everyayah.com/data/${reciter}/${surah}000.mp3`;
  } else {
    audioSrc = `https://everyayah.com/data/${reciter}/${surah}${ayahNum}.mp3`;
  }

  player.src = audioSrc;
  highlightAyah(index);
  player.play().catch(() => {});

  localStorage.setItem("lastRead", JSON.stringify({
    surah: surahSelect.value,
    index: index
  }));
}

player.addEventListener("ended", () => {
  if (currentIndex + 1 < ayahs.length) {
    playAyah(currentIndex + 1);
  }
});

function highlightAyah(index) {
  document.querySelectorAll(".ayah").forEach(a => a.classList.remove("active"));
  const ayah = document.querySelectorAll(".ayah")[index];
  if (ayah) {
    ayah.classList.add("active");
    ayah.scrollIntoView({ behavior: "smooth", block: "center" });
    const percent = ((index + 1) / ayahs.length) * 100;
    progressBar.style.width = percent + "%";
  }
}

floatingPlay.addEventListener("click", () => {
  if (!player.src) return;
  player.paused ? player.play() : player.pause();
});

player.addEventListener("play", () => {
  playIcon.innerHTML = '<path d="M6 5h4v14H6zm8 0h4v14h-4z"></path>';
});

player.addEventListener("pause", () => {
  playIcon.innerHTML = '<path d="M8 5v14l11-7z"></path>';
});

document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    e.preventDefault();
    floatingPlay.click();
  }
});

searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim();
  document.querySelectorAll(".ayah").forEach((ayah, i) => {
    ayah.classList.remove("search-highlight");
    if (value && ayahs[i].text.includes(value)) {
      ayah.classList.add("search-highlight");
    }
  });
});

progressContainer.addEventListener("click", e => {
  const rect = progressContainer.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  const index = Math.floor(percent * ayahs.length);
  playAyah(index);
});

darkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

surahSelect.addEventListener("change", () => {
  loadSurah(true);
});

window.onload = () => {
  setTimeout(() => {
    surahSelect.value = 1;
    loadSurah(true);
  }, 500);
};