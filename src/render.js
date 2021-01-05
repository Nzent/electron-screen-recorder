const videoSelectBtn = document.getElementById('videoSelectBtn');
const videoElement = document.querySelector('video');

console.log('dirname', __dirname)



videoSelectBtn.onclick = getVideoSources;
const { desktopCapturer, remote, app } = require('electron');
const { Menu } = remote;

// Get the available video sources
async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });
}

// Display a menu popup
async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });

  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => selectSource(source)

      };
    })
  );
  videoOptionsMenu.popup();
}



//Preview video stram
let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

// Change the videoSource window to record
async function selectSource(source) {

  videoSelectBtn.innerText = source.name;
  startBtn.classList.remove("hidden")

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop'
      }
    }
  };

  // Create a Stream
  const stream = await navigator.mediaDevices
    .getUserMedia(constraints);

  // Preview the source in a video element
  videoElement.srcObject = stream;
  videoElement.play();

  // Create the Media Recorder
  const options = { mimeType: 'video/webm; codecs=vp9' };
  mediaRecorder = new MediaRecorder(stream, options);

  // Register Event Handlers
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
}

// Record and save viedo
const { writeFile } = require('fs');
const { dialog } = remote;


// START
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const startIcon = document.getElementById('startIcon');

startBtn.onclick = e => {
  startIcon.classList.add('animate-pulse');
  stopBtn.classList.remove("hidden")
  mediaRecorder.start();
  // Notification
  const myNotification = new Notification('Recording ... ', {
    body: "Record started",
    icon: "../public/icons/record.png"
  })
};

//STOP
stopBtn.onclick = e => {
  startIcon.classList.remove('animate-pulse');
  mediaRecorder.stop();
  // Notification
  const myNotification = new Notification('Stopped', {
    body: "Record stopped and save !",
    icon: "../public/icons/stop.png"
  })
};


// Captures all recorded chunks
function handleDataAvailable(e) {
  console.log('video data available');
  recordedChunks.push(e.data);
}

// Saves the video file on stop
async function handleStop(e) {

  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp9'
  });

  const buffer = Buffer.from(await blob.arrayBuffer());



  const { filePath } = await dialog.showSaveDialog({
    closable: true,
    filters: [{ name: 'Movies', extensions: ['webm', 'mp4'] },],
    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`,
  });
  writeFile(filePath, buffer, () => {
    const myNotification = new Notification('Done !', {
      body: "Video saved successfully ... ",
      icon: "../public/icons/done.png"
    })
  });

}

// Quit section
const quitBtn = document.getElementById('quitBtn');
quitBtn.onclick = e => {
  let w = remote.getCurrentWindow()
  w.close()
}
// Minimize section
const minimizeBtn = document.getElementById('minimizeBtn');
minimizeBtn.onclick = e => {
  let w = remote.getCurrentWindow()
  w.minimize()
}