//Function to get song array from folder 
let musicArray = [];
let currentSongIndex = 0;
let listplaybtn;
let currentSong = new Audio();
let playBtn = document.querySelector("#play");
let prevBtn = document.querySelector("#prev");
let nextBtn = document.querySelector("#next");

async function getSong() {
    let a = await fetch("http://127.0.0.1:3000/spotify%20clone/music/");
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    // console.log(div);
    let links = div.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
        const element = links[i];
        if (element.href.endsWith(".mp3")) {
            musicArray.push(element.href.split("/music/")[1])
        }
    }
    // console.log(songs);
    return musicArray;
}

//PlayMusic function
const playMusic = (track, songname, pause = false) => {
    // let audio=new Audio(track);
    currentSong.src = track;
    if (!pause) {
        currentSong.play();
        playBtn.src = "listpause.svg";

    }
    document.querySelector(".song-info").innerHTML = songname;
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
}

const songName = (song) => {
    let without20 = song.replaceAll("%20", " ");

    let withoutMp3 = without20.replaceAll(".mp3", "");
    return withoutMp3;
}

//function to convert seconds to minute:second form
function formatTime(seconds) {
    // Ensure seconds is a non-negative number
    seconds = Math.max(0, seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Add leading zero if necessary
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    // Return the formatted time as a string
    return `${formattedMinutes}:${formattedSeconds}`;
}

// main function
async function main() {
    let songs = await getSong();
    // console.log(songs);
    let songWithout20;
    playMusic("http://127.0.0.1:3000/spotify%20clone/music/" + musicArray[0], songName(musicArray[0]), true)


    for (let i = 0; i < musicArray.length; i++) {
        let song = musicArray[i];
        songWithout20 = song.replaceAll("%20", " ");

        let songWithoutmp3 = songWithout20.replaceAll(".mp3", "");
        let parts = songWithoutmp3.split("-");
        let songName = parts[0];
        let artistName = parts[1];

        // Limit songName to the first three words
        let word = songName.split(" ");
        songName = word.slice(0, 3).join(" ");
        if (word.length > 3) {
            songName += "...";
        }

        let songUl = document.querySelector(".song-list").getElementsByTagName("ul")[0];
        let li = document.createElement("li");
        li.innerHTML = `<img src="music.png" class="invert music-icon" alt="">
                        <div class="info">
                            <div class="s-name">${songName}</div>
                            <div class="artist">${artistName}</div>
                        </div>
                        <img src="listplay.svg" class="list-btn invert" id=""  alt="">`;

        songUl.appendChild(li);
    }

    // Attach eventlistionar to each song

    // Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach((e,index)=>{
    //     e.addEventListener("click",()=>{
    //         console.log("Playing:", musicArray[index]);
    //         playMusic("http://127.0.0.1:3000/spotify%20clone/music/"+musicArray[index],songName(musicArray[index]));
    //         currentSongIndex=index;
    //     })

    // })

    // Attach event listener to each song
Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach((e, index) => {
    listplaybtn = e.querySelector(".list-btn");
    e.addEventListener("click", () => {
        // Update play button of the previously played song if it's not the current song
        if (currentSongIndex !== index) {
            let prevSongListItem = document.querySelector(".song-list").getElementsByTagName("li")[currentSongIndex];
            let prevListPlayBtn = prevSongListItem.querySelector(".list-btn");
            prevListPlayBtn.src = "listplay.svg"; // Update play button of previous song to show play icon
        }

        if (index === currentSongIndex && !currentSong.paused) {
            // If the clicked song is already playing, pause it
            currentSong.pause();
            playBtn.src = "playBtn.svg"; // Update play button to show play icon
            listplaybtn.src = "listPlay.svg"; // Update play button of clicked song to show play icon
        } else {
            // Otherwise, play the clicked song
            console.log("Playing:", musicArray[index]);
            playMusic("http://127.0.0.1:3000/spotify%20clone/music/" + musicArray[index], songName(musicArray[index]));
            currentSongIndex = index;
            playBtn.src = "listpause.svg"; // Update play button to show pause icon
            listplaybtn.src = "listpause.svg"; // Update play button of clicked song to show pause icon
        }
    });
});

// Attach event listener to play, next, and prev in playbar
playBtn.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play();
        playBtn.src = "listpause.svg";
        // Update corresponding button in the song list
        if (listplaybtn) {
            listplaybtn.src = "listpause.svg";
        } else {
            console.log("cant access");
        }
    } else {
        currentSong.pause();
        playBtn.src = "playBtn.svg";
        // Update corresponding button in the song list
        if (listplaybtn) {
            listplaybtn.src = "listplay.svg";
        } else {
            console.log("cant access");
        }
    }
});




    //Listiner for time update function
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".song-time").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        let seekBar = document.querySelector(".seekbar");
        let percentage = (currentSong.currentTime / currentSong.duration) * 100;
        seekBar.style.background = `linear-gradient(to right, white ${percentage}%,transparent ${percentage}%)`;
    })

    // Add event listionar to a seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;

    })

    //Add event listionar on hambergur
    document.querySelector(".hambarger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })

    //Add event listionar on close btn
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-200%";
    })

    // Add a event listiner to prev and next
    let songUl = document.querySelector(".song-list").getElementsByTagName("ul")[0];

    function playNextSong() {
        console.log("Next button clicked");
        // Play the next song in the list
        currentSongIndex = (currentSongIndex + 1) % musicArray.length;
        // Play the next song
        playMusic("http://127.0.0.1:3000/spotify%20clone/music/" + musicArray[currentSongIndex], songName(musicArray[currentSongIndex]));
    }

    function playPrevSong() {
        console.log("Previous button clicked");
        // Play the previous song in the list
        currentSongIndex = (currentSongIndex - 1 + musicArray.length) % musicArray.length;
        // Play the previous song
        playMusic("http://127.0.0.1:3000/spotify%20clone/music/" + musicArray[currentSongIndex], songName(musicArray[currentSongIndex]));
    }

    // Next button click event
    nextBtn.addEventListener("click", function () {
        playNextSong();
    });

    // Previous button click event
    prevBtn.addEventListener("click", function () {
        playPrevSong();
    });

}

main();