import type { Clip } from "../types";

console.log("📋 Context Clips: Content Script Loaded");

let lastCopiedText = "";
let copyDebounceTimer: number | null = null;

// Listen for copy events
document.addEventListener("copy", handleCopyEvent);

function handleCopyEvent(): void {
    // Debounce to avoid multiple triggers
    if (copyDebounceTimer) {
        clearTimeout(copyDebounceTimer);
    }

    copyDebounceTimer = window.setTimeout(async () => {
        try {
            const text = await readClipboard();

            if (!text || text.trim().length === 0) {
                return;
            }

            // Avoid saving duplicates in quick succession
            if (text === lastCopiedText) {
                return;
            }

            lastCopiedText = text;
            await saveClipToBackground(text);
        } catch (error) {
            console.error("Error handling copy event:", error);
        }
    }, 100);
}

async function readClipboard(): Promise<string> {
    try {
        return await navigator.clipboard.readText();
    } catch (error) {
        console.error("Failed to read clipboard:", error);
        return "";
    }
}

async function saveClipToBackground(content: string): Promise<void> {
    const clipData: Omit<Clip, "id" | "timestamp"> = {
        content,
        domain: window.location.hostname,
        title: document.title,
        url: window.location.href,
    };

    try {
        const response = await chrome.runtime.sendMessage({
            type: "SAVE_CLIP",
            data: clipData,
        });

        if (response?.success) {
            console.log("✅ Clip saved successfully");
        } else {
            console.error("Failed to save clip:", response?.error);
        }
    } catch (error) {
        console.error("Error sending message to background:", error);
    }
}

// Cleanup is handled automatically by Chrome when the content script is unloaded
// The deprecated 'unload' event causes Permissions Policy violations in modern Chrome
