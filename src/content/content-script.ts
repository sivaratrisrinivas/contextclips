import type { Clip } from "../types";

console.log("📋 Context Clips v2.0: Content Script Loaded ✓");
console.log("🔍 Timestamp:", new Date().toISOString());
console.log(
    "🔍 Script Hash: e6c9fb92 (if you see a different hash in console, the old script is still running)",
);

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
console.log("✓ Copy event listener attached");

function handleCopyEvent(): void {
    console.log("🎯 Copy event fired!");

    // Log selection immediately (before debounce)
    const immediateSelection = window.getSelection()?.toString() || "";
    console.log(
        "📝 Selection at event time:",
        immediateSelection.substring(0, 50) +
            (immediateSelection.length > 50 ? "..." : ""),
    );
    console.log("📏 Selection length:", immediateSelection.length);

    // Debounce to avoid multiple triggers
    if (copyDebounceTimer) {
        console.log("⏱️ Clearing previous debounce timer");
        clearTimeout(copyDebounceTimer);
    }

    copyDebounceTimer = window.setTimeout(async () => {
        console.log("⏱️ Debounce completed, processing copy...");

        // Check if extension context is still valid
        if (!isExtensionContextValid()) {
            console.warn(
                "⚠️ Extension was reloaded. Please refresh this page to continue capturing clips.",
            );
            return;
        }
        console.log("✓ Extension context is valid");

        try {
            // Get text from window selection
            const text = window.getSelection()?.toString() || "";
            console.log(
                "📝 Selection after debounce:",
                text.substring(0, 50) + (text.length > 50 ? "..." : ""),
            );
            console.log("📏 Final selection length:", text.length);

            if (!text || text.trim().length === 0) {
                console.warn("⚠️ No text to save (empty or whitespace only)");
                return;
            }
            console.log("✓ Text is valid for saving");

            // Avoid saving duplicates in quick succession
            if (text === lastCopiedText) {
                console.warn("⚠️ Duplicate text detected, skipping save");
                return;
            }
            console.log("✓ Not a duplicate, proceeding to save");

            lastCopiedText = text;
            await saveClipToBackground(text);
        } catch (error) {
            console.error("❌ Error handling copy event:", error);
        }
    }, 100);
}

async function saveClipToBackground(content: string): Promise<void> {
    console.log("💾 Preparing to save clip to background...");

    const clipData: Omit<Clip, "id" | "timestamp"> = {
        content,
        domain: window.location.hostname,
        title: document.title,
        url: window.location.href,
    };

    console.log("📦 Clip data:", {
        domain: clipData.domain,
        title: clipData.title.substring(0, 30) + "...",
        contentLength: clipData.content.length,
        url: clipData.url,
    });

    try {
        // Double-check context before sending message
        if (!isExtensionContextValid()) {
            console.warn(
                "⚠️ Extension was reloaded. Please refresh this page to continue capturing clips.",
            );
            return;
        }

        console.log("📤 Sending message to background script...");
        const response = await chrome.runtime.sendMessage({
            type: "SAVE_CLIP",
            data: clipData,
        });

        console.log("📥 Response from background:", response);

        if (response?.success) {
            console.log("✅ Clip saved successfully");
        } else {
            console.error("❌ Failed to save clip:", response?.error);
        }
    } catch (error) {
        console.error("❌ Error in saveClipToBackground:", error);

        // Check if error is due to invalidated context
        if (
            error instanceof Error &&
            error.message.includes("Extension context invalidated")
        ) {
            console.warn(
                "⚠️ Extension was reloaded. Please refresh this page to continue capturing clips.",
            );
        } else {
            console.error("❌ Error sending message to background:", error);
        }
    }
}

// Cleanup is handled automatically by Chrome when the content script is unloaded
// The deprecated 'unload' event causes Permissions Policy violations in modern Chrome

console.log(
    "📋 Content script initialization complete. Ready to capture clips!",
);
console.log("💡 To test: Select text on the page and press Ctrl+C (or Cmd+C)");
