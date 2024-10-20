// This script can handle events in the background, such as managing the state of each tab's audio settings

let tabAudioSettings = {}; // Object to store volume levels for each tab

// Listen for tab updates to save or manage audio settings
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // You can handle logic here for when a tab is updated, e.g., logging, resetting volumes, etc.
    console.log(`Tab updated: ${tabId}, Status: ${changeInfo.status}`);
});

// Function to set the volume for a specific tab
function setTabVolume(tabId, volume) {
    tabAudioSettings[tabId] = volume; // Save the volume level for the tab
    console.log(`Volume for tab ${tabId} set to ${volume}`);
}

// Function to get the volume for a specific tab
function getTabVolume(tabId) {
    return tabAudioSettings[tabId] || 100; // Default volume is 100 if not set
}

// Example: Listen for messages from popup.js to adjust volume
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setVolume") {
        setTabVolume(sender.tab.id, request.volume);
        sendResponse({ status: "Volume set" });
    } else if (request.action === "getVolume") {
        const volume = getTabVolume(sender.tab.id);
        sendResponse({ volume });
    }
});
