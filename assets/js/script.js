const apiurl = 'https://mp3quran.net/api/v3';
const langages = 'ar';

async function getRecitere() {
    const chooseReciter = document.querySelector('#chooseReciter');
    const res = await fetch(`${apiurl}/reciters?language=${langages}`);
    const data = await res.json();

    chooseReciter.innerHTML = `<option value="">اختار قارئ
</option>`;

    data.reciters.forEach(reciter => {
        chooseReciter.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`;
    });

    chooseReciter.addEventListener('change', (e) => getMoshaf(e.target.value));
}

async function getMoshaf(reciter) {
    const chooseMoshaf = document.querySelector('#chooseMoshaf');
    const res = await fetch(`${apiurl}/reciters?language=${langages}`);
    const data = await res.json();
    const reciterData = data.reciters.find(r => r.id == reciter);

    chooseMoshaf.innerHTML = `<option value="">اختار مصحف</option>`;

    if (reciterData && reciterData.moshaf) {
        reciterData.moshaf.forEach(moshaf => {
            chooseMoshaf.innerHTML += `<option value="${moshaf.id}" data-server="${moshaf.server}" data-surahlist="${moshaf.surah_list}">${moshaf.name}</option>`;
        });
    }

    chooseMoshaf.addEventListener('change', (e) => {
        const selectedMoshaf = chooseMoshaf.options[chooseMoshaf.selectedIndex];
        const surahserver = selectedMoshaf.dataset.server;
        const surahlist = selectedMoshaf.dataset.surahlist;
        getSurah(surahserver, surahlist);
    });
}

async function getSurah(surahserver, surahlist) {
    const chooseSurah = document.querySelector('#chooseSurah');
    const res = await fetch(`${apiurl}/suwar?language=${langages}`);
    const data = await res.json();
    const surahNames = data.suwar;

    surahlist = surahlist.split(',');

    chooseSurah.innerHTML = `<option value="">اختار السورة</option>`;

    surahlist.forEach(surah => {
        const padSurah = surah.padStart(3, '0');
        surahNames.forEach(surahName => {
            if (surahName.id == surah) {
                chooseSurah.innerHTML += `<option value="${surahserver}${padSurah}.mp3">${surahName.name}</option>`;
            }
        });
    });

    chooseSurah.addEventListener('change', (e) => {
        playSurah(e.target.value);
    });
}

function playSurah(surahMp3) {
    const audioplayer = document.querySelector('#audioplayer');
    audioplayer.src = surahMp3;
    audioplayer.play();
}

getRecitere();


function playlive(channel) {
    if (Hls.isSupported()) {
        var video = document.getElementById('livevideo');
        var hls = new Hls();
        hls.loadSource(channel);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
    }
}
