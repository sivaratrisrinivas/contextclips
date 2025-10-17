import type { Clip } from "../types";

console.log("📋 Context Clips v2.0: Content Script Loaded ✓");

let lastCopiedText = "";
let copyDebounceTimer: number | null = null;

// Check if extension context is valid
function isExtensionContextValid(): boolean {
    try {
        return !!chrome.runtime?.id;
    } catch {
        return false;
    }
}

// Listen for copy events
document.addEventListener("copy", handleCopyEvent);

function handleCopyEvent(): void {
    // Debounce to avoid multiple triggers
    if (copyDebounceTimer) {
        clearTimeout(copyDebounceTimer);
    }

    copyDebounceTimer = window.setTimeout(async () => {
        // Check if extension context is still valid
        if (!isExtensionContextValid()) {
            console.warn(
                "⚠️ Extension was reloaded. Please refresh this page to continue capturing clips.",
            );
            return;
        }

        try {
            // Get text from clipboard event instead of reading from clipboard
            // This avoids permission issues
            const text = window.getSelection()?.toString() || "";

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

async function saveClipToBackground(content: string): Promise<void> {
    const clipData: Omit<Clip, "id" | "timestamp"> = {
        content,
        domain: window.location.hostname,
        title: document.title,
        url: window.location.href,
    };

    try {
        // Double-check context before sending message
        if (!isExtensionContextValid()) {
            console.warn(
                "⚠️ Extension was reloaded. Please refresh this page to continue capturing clips.",
            );
            return;
        }

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
        // Check if error is due to invalidated context
        if (
            error instanceof Error &&
            error.message.includes("Extension context invalidated")
        ) {
            console.warn(
                "⚠️ Extension was reloaded. Please refresh this page to continue capturing clips.",
            );
        } else {
            console.error("Error sending message to background:", error);
        }
    }
}

// Cleanup is handled automatically by Chrome when the content script is unloaded
// The deprecated 'unload' event causes Permissions Policy violations in modern Chrome
