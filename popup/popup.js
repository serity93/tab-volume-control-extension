// Function to send a message to the content script
function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0].id;
    chrome.tabs.sendMessage(tabId, message, function (response) {
      if (chrome.runtime.lastError) {
        console.error(
          "Error sending message: " + chrome.runtime.lastError.message
        );
      } else if (callback) {
        callback(response);
      }
    });
  });
}

// Volume slider event listener
document.getElementById("volumeSlider").addEventListener("input", function () {
  const volume = this.value;
  sendMessageToContentScript({ action: "setVolume", volume: volume });
});

// Mute/Unmute button event listener
const muteButton = document.getElementById("muteButton");

function toggleMuteHandler() {
  const volume = document.getElementById("volumeSlider").value;
  sendMessageToContentScript(
    { action: "toggleMute", volume: volume },
    function (response) {
      // Update button text based on mute state
      if (response && response.isMuted) {
        muteButton.textContent = "Unmute";
      } else {
        muteButton.textContent = "Mute";
      }
    }
  );
}

muteButton.addEventListener("click", toggleMuteHandler);

// Load the current mute state and volume when the popup opens
document.addEventListener("DOMContentLoaded", function () {
  sendMessageToContentScript({ action: "getMuteState" }, function (response) {
    if (response) {
      document.getElementById("volumeSlider").value = response.volume;
      // Initialize button text based on current mute state
      muteButton.textContent = response.isMuted ? "Unmute" : "Mute";
    }
  });
});
