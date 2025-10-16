import type { Clip } from "../types";

const STORAGE_KEY = "contextclips_data";
const MAX_CLIPS = 1000;

console.log("🚀 Context Clips: Service Worker Started");

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  return true; // Keep message channel open for async response
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.windowId) {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// Message handler function
async function handleMessage(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
): Promise<void> {
  try {
    switch (message.type) {
      case "SAVE_CLIP":
        await saveClip(message.data, sendResponse);
        break;

      case "GET_CLIPS":
        await getClips(sendResponse);
        break;

      case "DELETE_CLIP":
        await deleteClip(message.clipId, sendResponse);
        break;

      case "CLEAR_ALL":
        await clearAllClips(sendResponse);
        break;

      default:
        sendResponse({ success: false, error: "Unknown message type" });
    }
  } catch (error) {
    console.error("Error handling message:", error);
    sendResponse({ success: false, error: (error as Error).message });
  }
}

// Save a new clip
async function saveClip(
  data: Omit<Clip, "id">,
  sendResponse: (response: any) => void,
): Promise<void> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const clips: Clip[] = result[STORAGE_KEY] || [];

  const newClip: Clip = {
    id: generateClipId(),
    content: data.content,
    timestamp: Date.now(),
    domain: data.domain,
    title: data.title,
    url: data.url,
  };

  // Add to beginning and limit size
  clips.unshift(newClip);
  const trimmedClips = clips.slice(0, MAX_CLIPS);

  await chrome.storage.local.set({ [STORAGE_KEY]: trimmedClips });

  console.log(`✅ Clip saved: ${newClip.content.substring(0, 50)}...`);

  // Notify sidepanel to refresh
  chrome.runtime.sendMessage({ type: "CLIPS_UPDATED" }).catch(() => {
    // Ignore errors if sidepanel is not open
  });

  sendResponse({ success: true, clip: newClip });
}

// Get all clips
async function getClips(sendResponse: (response: any) => void): Promise<void> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const clips: Clip[] = result[STORAGE_KEY] || [];

  console.log(`📤 Sending ${clips.length} clips`);
  sendResponse({ success: true, clips });
}

// Delete a specific clip
async function deleteClip(
  clipId: string,
  sendResponse: (response: any) => void,
): Promise<void> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const clips: Clip[] = result[STORAGE_KEY] || [];

  const filteredClips = clips.filter((clip) => clip.id !== clipId);
  await chrome.storage.local.set({ [STORAGE_KEY]: filteredClips });

  console.log(`🗑️ Clip deleted: ${clipId}`);

  // Notify sidepanel to refresh
  chrome.runtime.sendMessage({ type: "CLIPS_UPDATED" }).catch(() => {});

  sendResponse({ success: true });
}

// Clear all clips
async function clearAllClips(
  sendResponse: (response: any) => void,
): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: [] });

  console.log("🗑️ All clips cleared");

  // Notify sidepanel to refresh
  chrome.runtime.sendMessage({ type: "CLIPS_UPDATED" }).catch(() => {});

  sendResponse({ success: true });
}

// Generate unique clip ID
function generateClipId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
