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
const volumeSlider = document.getElementById("volumeSlider");

volumeSlider.addEventListener("input", function () {
  const volume = this.value;
  sendMessageToContentScript({ action: "setVolume", volume: volume });
});

// Mute toggle event listener
const muteToggle = document.getElementById("muteToggle");

muteToggle.addEventListener("change", function() {
    const volume = volumeSlider.value; // Get the current slider value
    sendMessageToContentScript({ action: "toggleMute", volume: volume }, function(response) {
        // Update toggle state based on mute state
        muteToggle.checked = response.isMuted;
    });
});

muteButton.addEventListener("click", toggleMuteHandler);

// Load the current mute state and volume when the popup opens
document.addEventListener("DOMContentLoaded", function () {
  sendMessageToContentScript({ action: "getMuteState" }, function (response) {
    if (response) {
      volumeSlider.value = response.volume;
      // Initialize button text based on current mute state
      muteButton.textContent = response.isMuted ? "Unmute" : "Mute";
    }
  });
});
