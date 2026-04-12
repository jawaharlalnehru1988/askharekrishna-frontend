
export interface Translation {
    id: number;
    language_code: string;
    title: string;
    authorName: string;
    description: string;
    lyrics: string;
}

export interface Resource {
    id: number;
    category: string;
    audioPath: string | null;
    imagePath: string | null;
    videoPath: string | null;
    translations: Translation[];
    created_at: string;
    updated_at: string;
    // Flattened fields for compatibility with existing components
    title: string;
    authorName: string;
    description: string;
    tamilLyrics: string;
    englishLyrics: string;
    order: number;
}

export interface KirtanCategory {
    id: number;
    name: string;
    categoryImage: string | null;
    created_at: string;
    updated_at: string;
}

export interface NavItem {
    id: string;
    label: string;
    icon?: string;
    image?: string;
}

export type Category = string;
