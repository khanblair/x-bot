import {
    Laptop, LucideIcon
} from 'lucide-react';

export interface NicheDefinition {
    label: string;
    icon: LucideIcon;
    subcategories: string[];
}

export const NICHES: Record<string, NicheDefinition> = {
    technology: {
        label: 'Technology',
        icon: Laptop,
        subcategories: [
            'AI & Machine Learning',
            'Web Development',
            'Mobile Apps',
            'Cybersecurity',
            'Cloud Computing',
            'Blockchain',
            'IoT',
            'DevOps',
            'Software Engineering',
            'Data Science',
            'Core Tech Hashtags',
            'FinTech & Finance',
            'Crypto & Blockchain',
            'Startups & Entrepreneurship',
            'Emerging/Intersectional',
        ],
    },
};

export type NicheKey = keyof typeof NICHES;

export const getNicheOptions = () => {
    return Object.entries(NICHES).map(([key, value]) => ({
        value: key,
        label: value.label,
        Icon: value.icon,
    }));
};

export const getSubcategories = (nicheKey: string) => {
    if (!nicheKey) return [];
    const niche = NICHES[nicheKey as NicheKey];
    return niche ? niche.subcategories : [];
};
