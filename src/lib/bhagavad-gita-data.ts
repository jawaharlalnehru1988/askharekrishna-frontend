// Shared data for Bhagavad Gita topics and audio items

export interface Topic {
    title: string;
    description: string;
    image: string;
    href: string;
    audioListId: number;
}

export interface AudioItem {
    id: number;
    audioListId: number;
    title: string;
    description: string;
    language: string;
    duration: string;
    audioUrl: string;
    isPlaying?: boolean;
}

export const TOPICS: Topic[] = [
    {
        title: "Sloka Recitation",
        description: "Pure Sanskrit recitation of all 700 verses in a meditative meter.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEDV-j8pZXdt_y65TYfuakvu-vDxZdaGspgTCuqoniJB9hbCPnOiKsMMC0l5OZDl9KiVntjU7-VL2rv-9vm8Plr7kTOzWhoY88kMehHsHmgnxV3SJ5C8Yzb85SggxkVG2IYW28qxNpJuMKoQv_lr2ZAMMeJweaSORjKHNxcEpURSyC0ebqxcE1cdgz01_V478rzDDQKtjWOUbWNCGAW7Og02joxBi1zza6E71cDp-8-hUgPt8DxaOxMxy6TUs5er9w6x-iVeMGmAAS",
        href: "/bhagavad-gita/topic/1",
        audioListId: 1
    },
    {
        title: "Sloka with Meaning",
        description: "Verse by verse recitation followed by clear English translations.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_w7pNd3TEfnBiuxPocQky83d_-CIR7Yh8_vhJIU_XXZWVs0r0StVH6nXKVDaEU6T_SdJwEDjnu9tiQPbYreFhPHs3gt9ozbP3Pl4uK-9eZyj5hEH3l7hN6LLyVzpIF_FvvXcN7BlbYVU60R5ZkRzDkFYLj3F_6JE9WfQYE0_7ddGPm9ydG_tBt9_Zpy0b_bSD0NOk8nJOfWGgdlOWkRUiQ0eNHDQpdfsJXAkM1NyHiqd-mWvEOtTvdwbn10GU0kBE9MRtTxQuQWmM",
        href: "/bhagavad-gita/topic/2",
        audioListId: 2
    },
    {
        title: "Important Slokas",
        description: "Curated collection of the most vital verses for daily meditation.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7F6sFyvMyODIzqKu0d5SNXtfpONO2fm0yRyL7JZtKQUXfVYhq1nIkurUTikL_BTBAgmFVuOL-mygBlqRDPKG4iRdbLkW9N7WaZUNAja5DC_p1V3SnMh2bI6OAsoWMm1aAypcRQXfuc66wQs0yNjIpIxnXMM5IAlxcgjvbQLkQQfyzHdEupMbj30LEAGWF0xUosk_ASrdp_BmQXuPu8SHNIoKaF5opREPwEuuOKcUq3IuNWLdsCzyagUkInb7lG43JwNGX-YKKEG67",
        href: "/bhagavad-gita/topic/3",
        audioListId: 3
    },
    {
        title: "Questions & Answers",
        description: "Clarifying doubts and deeper concepts of the Gita.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHJdKupa_S0OFbS4_uWVmXx031W9HRJsDyYvytYEpBXftlIsOjZg35B-WWoXGarGeTu61jce5djITwKmk3ynicFyDxNjmERn6BtQ_EnpDmahWzRicLptPxRfPRKH9_68SIIDHc8y_R2bO0Zd4C2_8ij91VrnSXWcZCJmlGGtCRsMlDSb9leCHlhU0X4C1WdHdf_Y6MS2x3pL_eFCtm0MQTUqB2WMW_j6YOtEe8VNTgb-SN3p3kcDlVn9g0kZ6qpQVUjg4hzQ4zYG9o",
        href: "/bhagavad-gita/topic/4",
        audioListId: 4
    },
    {
        title: "Bhagavad Gita Mahatmya",
        description: "The Glories of the Gita from the Padma Purana.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRIjLgjoRF_QCAmcbagcctWGYZTuEAT84Ripg1h_DdxpMfzsnAXQ-POKHgyB7sRlB38U9RMiAtvx-8hD8GlDJMh8AUvbyN-aF0zKSNXdT6uNshw94x1fY7WrPO8-cpErsOfLX0VVAemZf9EKyjLBK_fHI_Wm0e6QLEfzObUwTDuf90HPSKxmDwYQH4AAgRuBBqxCCNdawSSEXTsZiw_H5ZpfR82hj938URGLSMnHe1p2q7SdplXMprkoH5XhmNCoBsthpOBugT9pYq",
        href: "/bhagavad-gita/topic/5",
        audioListId: 5
    },
    {
        title: "Chapter Summaries",
        description: "Quick overview of each chapter's core message.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAc-UD-ZA2dpJgt3jcdmKGkfqWi0mxfNpzukOjrTIi9yGr-fope3yTQsuWrj61b9pKmwivsYzChHTkfICSGMqT0ziag8PeRuCf1qyOFDXC9AdJmJ-9WjM5X5BmO9BNGS6BXJuyWNyDra3y3UZ51U5As1ZTDij9o_l37biJfSwxFnmkQDS-mmALvZkOSx2PjU2xgGgw2GvcIYOREZY_wazpZXW0KMsuFiPokS9hc2sjPW6yS02aVBJhpaplsPOke_meL1zpo7Fvi-WPS",
        href: "/bhagavad-gita/topic/6",
        audioListId: 6
    }
];

export const AUDIO_ITEMS: AudioItem[] = [
    {
        id: 1,
        audioListId: 1,
        title: "Chapter 1: Observing the Armies",
        description: "The armies of the Pandavas and Kauravas assemble on the battlefield.",
        language: "English",
        duration: "45:00",
        audioUrl: "https://example.com/audio/1.mp3",
        isPlaying: true
    },
    {
        id: 2,
        audioListId: 1,
        title: "Chapter 2: Contents of the Gita Summarized",
        description: "Arjuna surrenders to Lord Krishna and asks for instruction.",
        language: "English",
        duration: "58:20",
        audioUrl: "https://example.com/audio/2.mp3"
    },
    {
        id: 3,
        audioListId: 1,
        title: "Chapter 3: Karma Yoga",
        description: "The path of selfless service and action without attachment.",
        language: "Hindi",
        duration: "42:15",
        audioUrl: "https://example.com/audio/3.mp3"
    },
    {
        id: 4,
        audioListId: 1,
        title: "Chapter 4: Transcendental Knowledge",
        description: "Approaching a spiritual master and receiving knowledge.",
        language: "Bengali",
        duration: "48:10",
        audioUrl: "https://example.com/audio/4.mp3"
    },
    {
        id: 5,
        audioListId: 1,
        title: "Chapter 5: Karma-yoga Action in Krishna Consciousness",
        description: "Performing action without desiring the fruits.",
        language: "English",
        duration: "39:45",
        audioUrl: "https://example.com/audio/5.mp3"
    }
];

/**
 * Get audio items filtered by audioListId
 */
export function getAudioItemsByListId(audioListId: number): AudioItem[] {
    return AUDIO_ITEMS.filter(item => item.audioListId === audioListId);
}

/**
 * Get topic information by audioListId
 */
export function getTopicByListId(audioListId: number): Topic | undefined {
    return TOPICS.find(topic => topic.audioListId === audioListId);
}
