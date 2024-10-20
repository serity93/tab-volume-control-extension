console.log("content.js is running");

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    const audioElements = document.querySelectorAll("audio, video");

    // Action to set the volume
    if (message.action === "setVolume") {
        console.log("Setting volume to:", message.volume);
        audioElements.forEach(audio => {
            audio.volume = message.volume / 100; // Volume is between 0 and 1
        });
        sendResponse({ success: true });
    }

    // Action to mute the tab
    if (message.action === "muteTab") {
        console.log("Muting the tab");
        audioElements.forEach(audio => {
            audio.muted = true;
        });
        sendResponse({ success: true });
    }

    // Action to unmute the tab
    if (message.action === "unmuteTab") {
        console.log("Unmuting the tab");
        audioElements.forEach(audio => {
            audio.muted = false;
        });
        sendResponse({ success: true });
    }

    // Action to get the current volume (used to initialize the slider in popup)
    if (message.action === "getVolume") {
        if (audioElements.length > 0) {
            const currentVolume = audioElements[0].volume * 100; // Convert from 0-1 to 0-100 scale
            console.log("Current volume:", currentVolume);
            sendResponse({ volume: currentVolume });
        } else {
            sendResponse({ volume: 100 }); // Default to 100% if no audio elements are found
        }
    }

    // If no matching action, log an error (for debugging)
    if (!["setVolume", "muteTab", "unmuteTab", "getVolume"].includes(message.action)) {
        console.error("Unknown action:", message.action);
    }
});
