/*<div class="card black">
    <img src="/VBeatZ/images/cover.jpg" alt="">
        <h2>Love Hits</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur repellendus soluta deleniti
            placeat magnam minus necessitatibus ea accusamus eos expedita?</p>
</div>*/
let left1 = document.querySelector(".left");
let play = document.querySelector("#play");
let prev = document.querySelector("#prev");
let next = document.querySelector("#next");
let circle = document.querySelector(".circle");
let menu = document.querySelector("#menu");
let cardContainer = document.querySelector(".cardContainer");
let songs = [];
let song;
let currentSong = new Audio();
let currentTime;
let duration;
let currFolder;
let folder;

// to change current time(sec) and duration(sec) to minutes:seconds format

function secondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// to get the songs from the folder selected

async function getSongs(folder) {
  currFolder = folder;
  //console.log(currFolder);
  let a = await fetch(`Songs/${currFolder}`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  //console.log(as);
  songs = [];
  for (const element of as) {
    if (element.href.endsWith(".mp3")) {
      element1 = element.href.split(`/songs/${currFolder}/`)[1];
      songs.push(element1);
    }
  }

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    //console.log(song);
    songUL.innerHTML =
      songUL.innerHTML + `<li>${song.replaceAll("%20", " ")}</li>`;
  }

  let songLI = document.querySelectorAll("li");
  songLI.forEach((song) => {
    //console.log(element);
    song.addEventListener("click", () => {
      playMusic(song.innerHTML);
    });
  });

  const searchSongs = document.getElementById("searchSongs");
  console.log(searchSongs);
  searchSongs.addEventListener("input", () => {
    let songLI = document.querySelectorAll("li");
    //console.log(songLI);

    songLI.forEach((song) => {
      //console.log(song.innerHTML);
      //console.log(searchSongs.value);
      if (song.innerHTML.toLowerCase().includes(searchSongs.value)) {
        console.log(searchSongs);
        song.style.display = "block";
      } else {
        console.log(searchSongs);
        song.style.display = "none";
      }
    });
  });
  return songs;
}

// to play music
async function playMusic(track) {
  currentSong.src = `Songs/${currFolder}/` + track;
  currentSong.play();
  document.querySelector(".songInfo").innerHTML = track
    .split("-")[0]
    .replaceAll("%20", " ");
  play.src = "images/pause-stroke-rounded.svg";
}

// to display all the folders as a card on screen

async function displayAlbums() {
  console.log("albums");
  let a = await fetch(`Songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  //console.log(response);
  let allas = div.getElementsByTagName("a");
  //console.log(allas);
  for (let index = 0; index < allas.length; index++) {
    const element = allas[index];
    //console.log(element.href);
    if (element.href.includes("/songs/")) {
      folder = element.href.split("/").slice(-1)[0];
      //console.log(folder);
      let a = await fetch(`Songs/${folder}/description.json`);
      let response = await a.json();
      //console.log(Object.keys(response));
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-set=${folder} class="card black">
                <img src="Songs/${folder}/cover.jpg" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
           </div>`;
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    console.log(e);
    e.addEventListener("click", async (item) => {
      //console.log(item.currentTarget.dataset.set);
      songs = await getSongs(`${item.currentTarget.dataset.set}`);
    });
  });
}

async function main() {
  await displayAlbums();

  // event listener to view song list in mobile

  let hiddenByJS = false;

  window.addEventListener("resize", function () {
    if (window.innerWidth <= 480) {
      document.querySelector(".left").style.display = "none";
      hiddenByJS = true;
    } else if (hiddenByJS) {
      document.querySelector(".left").style.display = "block";
      hiddenByJS = false;
    }
  });

  menu.addEventListener("click", () => {
    if (left1.style.display == "block") {
      left1.style.display = "none";
      console.log(left1.style.display);
    } else {
      left1.style.display = "block";
      console.log(left1.style.display);
    }
  });

  // event listener on play button to activate play/pause functionality
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "images/pause-stroke-rounded.svg";
    } else {
      currentSong.pause();
      play.src = "images/play-circle-stroke-rounded.svg";
    }
  });

  // event listener on prebious button to activate play previous song functionality

  prev.addEventListener("click", () => {
    /*console.log(songs);
        console.log(currentSong.src);*/
    let index = songs.indexOf(currentSong.src.split(`/${currFolder}/`)[1]);
    console.log(`current song index= ${index}`);
    if (index === 0) {
      console.log(`current song index= ${songs.length - 1}`);
      currentSong.src = `Songs/${currFolder}/` + songs[songs.length - 1];
      playMusic(currentSong.src.split(`/${currFolder}/`)[1]);
    } else {
      let newIndex = index - 1;
      console.log(`new song index ${newIndex}`);
      currentSong.src = `songs/${currFolder}/` + songs[newIndex];
      playMusic(currentSong.src.split(`/${currFolder}/`)[1]);
    }
  });

  next.addEventListener("click", () => {
    //console.log(songs);
    let index = songs.indexOf(currentSong.src.split(`/${currFolder}/`)[1]);
    console.log(`current song index= ${index}`);
    //console.log(songs.length);
    if (index + 1 === songs.length) {
      console.log(`current song index= ${0}`);
      currentSong.src = `Songs/${currFolder}/` + songs[0];
      playMusic(currentSong.src.split(`/${currFolder}/`)[1]);
    } else {
      let newIndex = index + 1;
      console.log(`new song index ${newIndex}`);
      currentSong.src = `Songs/${currFolder}/` + songs[newIndex];
      playMusic(currentSong.src.split(`/${currFolder}/`)[1]);
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    duration = parseInt(currentSong.duration);
    currentTime = parseInt(currentSong.currentTime);
    let songTime = document.querySelector(".songTime");
    songTime.innerHTML = `${secondsToMinutesSeconds(
      parseInt(currentSong.currentTime)
    )}/${secondsToMinutesSeconds(parseInt(currentSong.duration))}`;

    circle.style.left = (currentTime / duration) * 100 + "%";
    if (currentSong.currentTime === currentSong.duration) {
      let index = songs.indexOf(currentSong.src.split(`/${currFolder}/`)[1]);
      //console.log(index);
      //console.log(songs.length);
      if (index + 1 === songs.length) {
        //console.log(0);
        currentSong.src = `Songs/${currFolder}/` + songs[0];
        playMusic(currentSong.src.split(`/${currFolder}/`)[1]);
      } else {
        let newIndex = index + 1;
        console.log(`new song index ${newIndex}`);
        currentSong.src = `Songs/${currFolder}/` + songs[newIndex];
        playMusic(currentSong.src.split(`/${currFolder}/`)[1]);
      }
    }
  });

  document.querySelector(".seekBar").addEventListener("click", (e) => {
    //console.log(e.offsetX);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    circle.style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
}

main();
