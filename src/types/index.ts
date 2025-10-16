// Core data types
export interface Clip {
  id: string;
  content: string;
  timestamp: number;
  domain: string;
  title: string;
  url: string;
}

// Message types for chrome.runtime.sendMessage
export type MessageType =
  | "SAVE_CLIP"
  | "GET_CLIPS"
  | "DELETE_CLIP"
  | "CLEAR_ALL"
  | "CLIPS_UPDATED";

export interface SaveClipMessage {
  type: "SAVE_CLIP";
  data: Omit<Clip, "id" | "timestamp">;
}

export interface GetClipsMessage {
  type: "GET_CLIPS";
}

export interface DeleteClipMessage {
  type: "DELETE_CLIP";
  clipId: string;
}

export interface ClearAllMessage {
  type: "CLEAR_ALL";
}

export interface ClipsUpdatedMessage {
  type: "CLIPS_UPDATED";
}

export type Message =
  | SaveClipMessage
  | GetClipsMessage
  | DeleteClipMessage
  | ClearAllMessage
  | ClipsUpdatedMessage;

// Response types
export interface SuccessResponse<T = unknown> {
  success: true;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export type Response<T = unknown> = SuccessResponse<T> | ErrorResponse;

export interface GetClipsResponse extends SuccessResponse<{ clips: Clip[] }> {
  clips: Clip[];
}

export interface SaveClipResponse extends SuccessResponse<{ clip: Clip }> {
  clip: Clip;
}

// Storage types
export interface StorageData {
  contextclips_data: Clip[];
}

// Utility types
export type ClipWithoutId = Omit<Clip, "id">;
export type ClipWithoutTimestamp = Omit<Clip, "timestamp">;
export type NewClipData = Omit<Clip, "id" | "timestamp">;
