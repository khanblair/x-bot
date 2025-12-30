// Hashtag database organized by niche and subcategory - Complete coverage for all 12 niches

// Hashtag database organized by niche and subcategory - Complete coverage for all 12 niches
export const HASHTAG_DATABASE = {
    technology: {
        
        'AI & Machine Learning': ['#AI', '#MachineLearning', '#DeepLearning', '#ArtificialIntelligence', '#ML', '#DataScience', '#NeuralNetworks', '#AITech'],
        'Web Development': ['#WebDev', '#JavaScript', '#React', '#Frontend', '#Backend', '#FullStack', '#WebDesign', '#Coding'],
        'Mobile Apps': ['#MobileApp', '#AppDevelopment', '#iOS', '#Android', '#ReactNative', '#Flutter', '#MobileDev', '#AppDesign'],
        'Cybersecurity': ['#Cybersecurity', '#InfoSec', '#DataProtection', '#CyberSafe', '#Security', '#Hacking', '#Privacy', '#CyberDefense'],
        'Cloud Computing': ['#CloudComputing', '#AWS', '#Azure', '#Cloud', '#DevOps', '#ServerLess', '#CloudNative', '#CloudTech'],
        'Blockchain': ['#Blockchain', '#Crypto', '#Web3', '#DeFi', '#NFT', '#Bitcoin', '#Ethereum', '#CryptoTech'],
        'IoT': ['#IoT', '#InternetOfThings', '#SmartHome', '#ConnectedDevices', '#IoTSecurity', '#SmartTech', '#IoTDev'],
        'DevOps': ['#DevOps', '#CICD', '#Automation', '#Docker', '#Kubernetes', '#CloudOps', '#SRE', '#InfraAsCode'],
        'Software Engineering': ['#SoftwareEngineering', '#Programming', '#CodeQuality', '#SoftwareDev', '#Engineering', '#Tech', '#Developer'],
        'Data Science': ['#DataScience', '#BigData', '#Analytics', '#DataAnalytics', '#Python', '#DataViz', '#Statistics', '#DataDriven'],

        'Core Tech Hashtags': [
            '#AI', '#TechNews', '#Innovation', '#Technology', '#Gadgets', '#FutureTech',
            '#ArtificialIntelligence', '#TechTuesday', '#SmartDevices', '#CyberTalk',
            '#DigitalTools', '#TechSavvy'
        ],
        'FinTech & Finance': [
            '#FinTech', '#Finance', '#PersonalFinance', '#FinTechInnovation', '#Payments',
            '#Lending', '#DigitalBanking', '#FinancialTechnology', '#FinTechNews', '#AIinFinance'
        ],
        'Crypto & Blockchain': [
            '#Crypto', '#Bitcoin', '#BTC', '#Ethereum', '#ETH', '#XRP', '#Blockchain',
            '#DeFi', '#Web3', '#NFTs', '#CryptoNews', '#CryptoGiveaway', '#Airdrop',
            '#Airdrops', '#Giveaway', '#USDT', '#Stablecoins', '#CryptoRegulation'
        ],
        'Startups & Entrepreneurship': [
            '#Startup', '#Business', '#Entrepreneurship', '#EntrepreneurMindset', '#Innovate'
        ],
        'Emerging/Intersectional': [
            '#DeFiInfra', '#AIInfra', '#RWA', '#AgenticAI', '#Tokenization'
        ]
    }
};

// Get relevant hashtags for a niche and subcategory
export const getRelevantHashtags = (niche: string, subcategory: string): string[] => {
    const nicheData = HASHTAG_DATABASE[niche as keyof typeof HASHTAG_DATABASE];
    if (!nicheData) return [];

    const subcategoryHashtags = nicheData[subcategory as keyof typeof nicheData];
    return subcategoryHashtags || [];
};

// Select best hashtags (2-3) based on context
export const selectBestHashtags = (
    niche: string,
    subcategory: string,
    tweetText: string
): string[] => {
    const availableHashtags = getRelevantHashtags(niche, subcategory);
    if (availableHashtags.length === 0) return [];

    // Simple scoring: prefer hashtags that match words in the tweet
    const tweetLower = tweetText.toLowerCase();
    const scored = availableHashtags.map(tag => {
        const tagWord = tag.replace('#', '').toLowerCase();
        const score = tweetLower.includes(tagWord) ? 2 : 1;
        return { tag, score };
    });

    // Sort by score and take top 2-3
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 2).map(s => s.tag);
};

// Add hashtags to tweet if not already present
export const addHashtagsToTweet = (
    tweetText: string,
    niche: string,
    subcategory: string
): string => {
    // Check if tweet already has hashtags
    const hasHashtags = tweetText.includes('#');
    if (hasHashtags) return tweetText;

    // Get best hashtags
    const hashtags = selectBestHashtags(niche, subcategory, tweetText);
    if (hashtags.length === 0) return tweetText;

    // Add hashtags at the end
    const hashtagString = hashtags.join(' ');
    const combined = `${tweetText} ${hashtagString}`;

    // Ensure it fits in 280 characters
    if (combined.length <= 280) {
        return combined;
    }

    // If too long, try with just one hashtag
    const singleHashtag = `${tweetText} ${hashtags[0]}`;
    if (singleHashtag.length <= 280) {
        return singleHashtag;
    }

    // If still too long, return original
    return tweetText;
};
