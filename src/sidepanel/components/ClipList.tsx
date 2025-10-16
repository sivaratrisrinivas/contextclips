import React from 'react';
import type { Clip } from '../../types';
import ClipItem from './ClipItem';

interface ClipListProps {
  clips: Clip[];
  selectedIndex: number;
  onCopy: (clip: Clip) => void;
  onDelete: (clipId: string) => void;
  onSelect: (index: number) => void;
}

const ClipList: React.FC<ClipListProps> = ({
  clips,
  selectedIndex,
  onCopy,
  onDelete,
  onSelect,
}) => {
  return (
    <div className="space-y-2">
      {clips.map((clip, index) => (
        <ClipItem
          key={clip.id}
          clip={clip}
          isSelected={index === selectedIndex}
          onClick={() => {
            onSelect(index);
            onCopy(clip);
          }}
          onDelete={() => onDelete(clip.id)}
        />
      ))}
    </div>
  );
};

export default ClipList;
