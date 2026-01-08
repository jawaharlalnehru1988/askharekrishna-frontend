import React from 'react';

export function AudioPlayer() {
    return (
        <div className="bg-white p-4 rounded shadow">
            <h2>Audio Player</h2>
            {/* Audio player controls will go here */}
            <audio controls className="w-full mt-2" />
        </div>
    );
}
