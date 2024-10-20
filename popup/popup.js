// Function to inject the content script into the active tab
function injectContentScript(tabId, callback) {
  chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
  }, function() {
      if (chrome.runtime.lastError) {
          console.error("Script injection failed: " + chrome.runtime.lastError.message);
      } else {
          console.log("Content script injected successfully.");
          if (callback) {
              callback();
          }
      }
  });
}

// Function to send a message to the content script
function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tabId = tabs[0].id;
      const tabUrl = tabs[0].url;

      if (tabUrl.startsWith('chrome://') || tabUrl.startsWith('https://chrome.google.com/webstore')) {
          console.error("Cannot inject content script into this page.");
          return;
      }

      injectContentScript(tabId, function() {
          chrome.tabs.sendMessage(tabId, message, function(response) {
              if (chrome.runtime.lastError) {
                  console.error("Error sending message: " + chrome.runtime.lastError.message);
              } else if (callback) {
                  callback(response);
              }
          });
      });
  });
}

// Volume slider event listener
document.getElementById("volumeSlider").addEventListener("input", function() {
  const volume = this.value;
  sendMessageToContentScript({ action: "setVolume", volume: volume });
});

// Mute button event listener
document.getElementById("muteButton").addEventListener("click", function() {
  sendMessageToContentScript({ action: "muteTab" });
});

// Load the current volume when the popup opens
document.addEventListener('DOMContentLoaded', function() {
  sendMessageToContentScript({ action: "getVolume" }, function(response) {
      if (response && response.volume !== undefined) {
          document.getElementById("volumeSlider").value = response.volume;
      }
  });
});
