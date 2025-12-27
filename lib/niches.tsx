import {
    Laptop, Briefcase, Heart, Film, GraduationCap, Trophy, Plane, Utensils,
    Shirt, Microscope, Landmark, Palette, LucideIcon
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
        ],
    },
    business: {
        label: 'Business & Finance',
        icon: Briefcase,
        subcategories: [
            'Entrepreneurship',
            'Marketing',
            'Investing',
            'Cryptocurrency',
            'E-commerce',
            'Leadership',
            'Productivity',
            'Sales',
            'Startups',
            'Personal Finance',
        ],
    },
    health: {
        label: 'Health & Wellness',
        icon: Heart,
        subcategories: [
            'Fitness',
            'Nutrition',
            'Mental Health',
            'Yoga & Meditation',
            'Weight Loss',
            'Sleep',
            'Supplements',
            'Healthy Recipes',
            'Wellness Tips',
            'Medical Advice',
        ],
    },
    entertainment: {
        label: 'Entertainment',
        icon: Film,
        subcategories: [
            'Movies',
            'TV Shows',
            'Music',
            'Gaming',
            'Books',
            'Podcasts',
            'Streaming',
            'Celebrity News',
            'Pop Culture',
            'Comedy',
        ],
    },
    education: {
        label: 'Education',
        icon: GraduationCap,
        subcategories: [
            'Online Learning',
            'Study Tips',
            'Career Development',
            'Language Learning',
            'Science',
            'History',
            'Mathematics',
            'Coding Tutorials',
            'Academic Writing',
            'Test Preparation',
        ],
    },
    sports: {
        label: 'Sports',
        icon: Trophy,
        subcategories: [
            'Football',
            'Basketball',
            'Soccer',
            'Tennis',
            'Baseball',
            'Cricket',
            'Golf',
            'MMA',
            'Olympics',
            'Sports News',
        ],
    },
    travel: {
        label: 'Travel',
        icon: Plane,
        subcategories: [
            'Travel Tips',
            'Destinations',
            'Budget Travel',
            'Luxury Travel',
            'Adventure Travel',
            'Solo Travel',
            'Travel Photography',
            'Hotels & Resorts',
            'Travel Hacks',
            'Cultural Experiences',
        ],
    },
    food: {
        label: 'Food & Cooking',
        icon: Utensils,
        subcategories: [
            'Recipes',
            'Baking',
            'Healthy Eating',
            'Vegan/Vegetarian',
            'Meal Prep',
            'Restaurant Reviews',
            'Food Photography',
            'Cooking Tips',
            'International Cuisine',
            'Desserts',
        ],
    },
    fashion: {
        label: 'Fashion & Beauty',
        icon: Shirt,
        subcategories: [
            'Fashion Trends',
            'Makeup',
            'Skincare',
            'Hair Care',
            'Style Tips',
            'Sustainable Fashion',
            'Accessories',
            'Beauty Products',
            'Fashion Week',
            'Personal Style',
        ],
    },
    science: {
        label: 'Science',
        icon: Microscope,
        subcategories: [
            'Space & Astronomy',
            'Physics',
            'Biology',
            'Chemistry',
            'Environmental Science',
            'Research',
            'Innovations',
            'Scientific Discoveries',
            'Climate Change',
            'Neuroscience',
        ],
    },
    politics: {
        label: 'Politics',
        icon: Landmark,
        subcategories: [
            'Current Events',
            'Elections',
            'Policy',
            'International Relations',
            'Government',
            'Political Commentary',
            'Social Issues',
            'Activism',
            'Democracy',
            'Political News',
        ],
    },
    art: {
        label: 'Art & Design',
        icon: Palette,
        subcategories: [
            'Digital Art',
            'Graphic Design',
            'Photography',
            'Illustration',
            'UI/UX Design',
            'Architecture',
            'Fine Arts',
            'Creative Process',
            'Design Trends',
            'Art History',
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
