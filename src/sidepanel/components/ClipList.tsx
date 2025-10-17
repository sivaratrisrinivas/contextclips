import React from "react";
import type { Clip } from "../../types";
import ClipItem from "./ClipItem";

interface ClipListProps {
    clips: Clip[];
    onCopy: (clip: Clip) => void;
    onDelete: (clipId: string) => void;
}

const ClipList: React.FC<ClipListProps> = ({ clips, onCopy, onDelete }) => {
    return (
        <div className="space-y-3 pb-24">
            {clips.map((clip) => (
                <ClipItem
                    key={clip.id}
                    clip={clip}
                    onCopy={() => onCopy(clip)}
                    onDelete={() => onDelete(clip.id)}
                />
            ))}
        </div>
    );
};

export default ClipList;
