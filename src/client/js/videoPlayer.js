const videoContainer = document.querySelector("#videoContainer");
const videoControls = document.querySelector("#videoControls");
const video = document.querySelector("video");
const playBtn = document.querySelector("#videoControls__playBtn");
const volumeBtn = document.querySelector("#volumeBtn");
const volumeBar = document.querySelector("#volumeBar");
const time = document.querySelector("#time");
const currentTime = time.querySelector(".current");
const totalTime = time.querySelector(".total");
const timeBar = time.querySelector("#timeBar");
const fullscreen = document.querySelector("#fullscreen");

let controlsTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const showControls = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  videoControls.classList.add("showing");
};

const showVolumeBar = () => {
  showControls();
  volumeBar.classList.add("showing");
  if (!video.paused) {
    controlsTimeout = setTimeout(hideControls, 3000);
  }
};

const hideControls = () => {
  timeBar.blur();
  volumeBar.blur();
  volumeBar.classList.remove("showing");
  videoControls.classList.remove("showing");
};

const togglePlay = () => {
  if (video.paused) {
    video.play();
    controlsTimeout = setTimeout(hideControls, 3000);
  } else {
    video.pause();
    showControls();
  }
  playBtn.innerText = video.paused ? "play_arrow" : "pause";
};

const toggleMute = () => {
  if (video.muted) {
    video.muted = false;
    showVolumeBar();
  } else {
    video.muted = true;
    showVolumeBar();
  }
  volumeBtn.innerText = video.muted ? "volume_mute" : "volume_up";

  volumeBar.value = video.muted ? 0 : volumeValue;
};

const handleVolumeBar = (event) => {
  const {
    target: { value },
  } = event;
  volumeBtn.innerText =
    value === 0
      ? "volume_mute"
      : value > 0 && value < 0.5
      ? "volume_down"
      : "volume_up";
  volumeValue = value;
  video.volume = value;
};

const formatTime = (duration) => {
  const minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
};

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(video.duration);
  timeBar.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(video.currentTime);
  timeBar.value = Math.floor(video.currentTime);
};

const handleTimeBar = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

let fullscreenCheck = document.fullscreenElement;

const handleFullscreen = () => {
  fullscreenCheck = document.fullscreenElement;
  if (fullscreenCheck) {
    document.exitFullscreen();
    video.style.width = "700px";
    fullscreen.innerText = "fullscreen";
  } else {
    videoContainer.requestFullscreen();
    video.style.width = "100%";
    fullscreen.innerText = "fullscreen_exit";
  }
};

const handleESC = () => {
  fullscreenCheck = document.fullscreenElement;
  if (!fullscreenCheck) {
    fullscreen.innerText = "fullscreen";
  }
};

const handleMouseMove = () => {
  if (!video.paused) {
    showControls();
    controlsTimeout = setTimeout(hideControls, 3000);
  }
};

const commentForm = document.querySelector("textarea");

const handleKeydown = (event) => {
  let { keyCode } = event;
  let focusEle = document.activeElement === commentForm ? true : false;
  // console.log(commentForm);
  if (focusEle === false) {
    //playtoggle
    if (keyCode === 32) {
      togglePlay();
    }

    if (keyCode === 39 || keyCode === 37) {
      timeBar.focus();
      handleMouseMove();
    }

    //mutetoggle
    if (keyCode === 77) {
      toggleMute();
    }

    if (keyCode === 38 || keyCode === 40) {
      volumeBar.focus();
      showVolumeBar();
    }

    //fullscreen
    if (keyCode === 70) {
      handleFullscreen();
    }
  }
};

video.addEventListener("loadeddata", handleLoadedMetadata);
playBtn.addEventListener("click", togglePlay);
volumeBtn.addEventListener("click", toggleMute);
volumeBar.addEventListener("input", handleVolumeBar);
timeBar.addEventListener("input", handleTimeBar);
video.addEventListener("timeupdate", handleTimeUpdate);
fullscreen.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("fullscreenchange", handleESC);
videoContainer.addEventListener("mousemove", handleMouseMove);
document.addEventListener("keydown", handleKeydown);
