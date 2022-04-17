import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload); // 처음 한번 작동하고 사라지기 위함

  actionBtn.innerText = "변환중...";

  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({
    corePath: "/ffmpeg/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();
  // writeFile: 메모리에 저장  // videoFile로부터 파일 정보를 가져옴
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  // 🔽 위에서 만든 files.input을 input으로 받음 // -r, 60 : 초당 60프레임으로 인코딩 후 output.mp4로
  await ffmpeg.run(
    "-i",
    files.input,
    "-vf",
    "format=gray",
    "-r",
    "60",
    files.output
  );
  // -ss, 00:00:00 특정 시간으로 감  // "frames:v", "1" 스크린샷 // thumbnail.jpg라는 이름의
  await ffmpeg.run(
    "-i",
    files.input,
    "-vf",
    "format=gray",
    "-ss",
    "00:00:00",
    "-frames:v",
    "1",
    files.thumb
  );

  //mp4File로부터 data를 받아서 만든 파일로 object URL을 만듬
  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  // 속도 향상을 위한 불필요한 파일 제거

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(videoFile);
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);

  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
};

const handleStop = () => {
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

const handleStart = () => {
  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 1024 },
  });
  video.srcObject = stream;
  video.play();
};
init();

actionBtn.addEventListener("click", handleStart);
//최초 클릭 -> handleStart -> handleStart 상태 + 클릭 -> handleStop -> handleStop 상태 + 클릭 -> handleStart ...
