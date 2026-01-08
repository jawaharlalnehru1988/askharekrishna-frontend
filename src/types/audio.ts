export interface AudioTrack {
    id: string;
    title: string;
    url: string;
    category: string;
    duration: number;
}

export interface Playlist {
    id: string;
    name: string;
    tracks: AudioTrack[];
}
