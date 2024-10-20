console.log("content.js is running");

// Check if listeners are already set
let listenersSet = false;

function setAudioControls() {
  if (listenersSet) return; // Exit if listeners are already set

  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    const audioElements = document.querySelectorAll("audio, video");

    // Action to set the volume
    if (message.action === "setVolume") {
      console.log("Setting volume to:", message.volume);
      audioElements.forEach((audio) => {
        if (!audio.muted) {
          // Only set volume if the audio isn't muted
          audio.volume = message.volume / 100; // Convert from 0-100 to 0-1 scale
        }
      });
      sendResponse({ success: true });
    }

    // Action to toggle mute state
    if (message.action === "toggleMute") {
      let isMuted = false;
      audioElements.forEach((audio) => {
        audio.muted = !audio.muted; // Toggle mute state
        isMuted = audio.muted; // Keep track of the last audio element's mute state
        if (!isMuted) {
          // If unmuted, set volume to the slider value
          console.log("setting volume to:", message.volume);
          audio.volume = message.volume / 100; // Use the value from the message
        }
      });
      console.log(isMuted ? "Tab is now muted" : "Tab is now unmuted");
      sendResponse({ isMuted: isMuted });
    }

    // Action to get the current mute state and volume
    if (message.action === "getMuteState") {
      let isMuted = false;
      if (audioElements.length > 0) {
        isMuted = audioElements[0].muted;
        const currentVolume = audioElements[0].volume * 100; // Convert 0-1 to 0-100 scale
        sendResponse({ isMuted: isMuted, volume: currentVolume });
      } else {
        sendResponse({ isMuted: false, volume: 100 });
      }
    }
  });

  listenersSet = true; // Set the flag to true after setting listeners
}

// Call the function to set audio controls
setAudioControls();
