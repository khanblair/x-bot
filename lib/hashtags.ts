import { NICHES } from './niches';

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
    },
    business: {
        'Entrepreneurship': ['#Entrepreneurship', '#Startup', '#Business', '#Entrepreneur', '#StartupLife', '#SmallBusiness', '#BusinessOwner', '#Hustle'],
        'Marketing': ['#Marketing', '#DigitalMarketing', '#ContentMarketing', '#SocialMedia', '#SEO', '#Branding', '#MarketingTips', '#GrowthHacking'],
        'Investing': ['#Investing', '#StockMarket', '#Finance', '#Investment', '#Stocks', '#Trading', '#WealthBuilding', '#FinancialFreedom'],
        'Cryptocurrency': ['#Crypto', '#Cryptocurrency', '#Bitcoin', '#Ethereum', '#CryptoTrading', '#DeFi', '#Web3', '#CryptoNews'],
        'E-commerce': ['#Ecommerce', '#OnlineBusiness', '#Shopify', '#OnlineStore', '#DigitalCommerce', '#Retail', '#EcommerceTips'],
        'Leadership': ['#Leadership', '#Management', '#LeadershipDevelopment', '#TeamLeadership', '#ExecutiveLeadership', '#LeadershipSkills'],
        'Productivity': ['#Productivity', '#TimeManagement', '#ProductivityHacks', '#Efficiency', '#WorkSmart', '#ProductivityTips', '#GetThingsDone'],
        'Sales': ['#Sales', '#SalesTips', '#B2B', '#SalesStrategy', '#Selling', '#SalesSuccess', '#SalesGrowth', '#SalesLeadership'],
        'Startups': ['#Startup', '#Startups', '#StartupLife', '#TechStartup', '#Innovation', '#Entrepreneurship', '#StartupGrowth'],
        'Personal Finance': ['#PersonalFinance', '#FinancialPlanning', '#MoneyManagement', '#Budgeting', '#Savings', '#FinancialLiteracy', '#WealthBuilding'],
    },
    health: {
        'Fitness': ['#Fitness', '#Workout', '#FitnessMotivation', '#Gym', '#FitnessJourney', '#Exercise', '#FitLife', '#Training'],
        'Nutrition': ['#Nutrition', '#HealthyEating', '#Diet', '#NutritionTips', '#HealthyFood', '#Wellness', '#HealthyLifestyle', '#FoodForThought'],
        'Mental Health': ['#MentalHealth', '#MentalWellness', '#SelfCare', '#MentalHealthAwareness', '#Mindfulness', '#Therapy', '#MentalHealthMatters'],
        'Yoga & Meditation': ['#Yoga', '#Meditation', '#Mindfulness', '#YogaLife', '#YogaPractice', '#Zen', '#InnerPeace', '#Wellness'],
        'Weight Loss': ['#WeightLoss', '#WeightLossJourney', '#HealthyWeightLoss', '#FatLoss', '#Transformation', '#HealthyLiving', '#FitnessGoals'],
        'Sleep': ['#Sleep', '#SleepHealth', '#BetterSleep', '#SleepTips', '#RestWell', '#SleepQuality', '#HealthySleep', '#SleepWellness'],
        'Supplements': ['#Supplements', '#Vitamins', '#HealthSupplements', '#Nutrition', '#Wellness', '#HealthyLiving', '#FitnessSupplements'],
        'Healthy Recipes': ['#HealthyRecipes', '#HealthyFood', '#CleanEating', '#HealthyCooking', '#NutritiousFood', '#HealthyMeals', '#FoodPrep'],
        'Wellness Tips': ['#Wellness', '#WellnessTips', '#HealthyLiving', '#SelfCare', '#HealthAndWellness', '#WellnessJourney', '#Wellbeing'],
        'Medical Advice': ['#MedicalAdvice', '#Health', '#Healthcare', '#MedicalTips', '#HealthInfo', '#HealthAwareness', '#MedicalKnowledge'],
    },
    entertainment: {
        'Movies': ['#Movies', '#Film', '#Cinema', '#MovieNight', '#FilmReview', '#Hollywood', '#MovieLovers', '#Cinephile'],
        'TV Shows': ['#TVShows', '#Television', '#Streaming', '#BingeWatch', '#TVSeries', '#Netflix', '#TVAddict', '#MustWatch'],
        'Music': ['#Music', '#NewMusic', '#MusicLovers', '#NowPlaying', '#MusicLife', '#Spotify', '#MusicIsLife', '#SongOfTheDay'],
        'Gaming': ['#Gaming', '#Gamer', '#VideoGames', '#GamingCommunity', '#Esports', '#GamingLife', '#GamersUnite', '#GamingSetup'],
        'Books': ['#Books', '#Reading', '#BookLovers', '#Bookworm', '#BookRecommendations', '#AmReading', '#BookCommunity', '#Literature'],
        'Podcasts': ['#Podcast', '#Podcasting', '#PodcastRecommendation', '#PodcastLife', '#PodcastAddict', '#NewPodcast', '#PodcastCommunity'],
        'Streaming': ['#Streaming', '#StreamingNow', '#LiveStream', '#Twitch', '#ContentCreator', '#StreamerLife', '#GoLive', '#StreamingCommunity'],
        'Celebrity News': ['#Celebrity', '#CelebNews', '#Entertainment', '#Hollywood', '#CelebGossip', '#StarNews', '#CelebrityLife'],
        'Pop Culture': ['#PopCulture', '#TrendingNow', '#Viral', '#PopCultureNews', '#Entertainment', '#Trending', '#CultureTalk'],
        'Comedy': ['#Comedy', '#Funny', '#Humor', '#Comedian', '#StandUp', '#ComedyShow', '#LaughOutLoud', '#Jokes'],
    },
    education: {
        'Online Learning': ['#OnlineLearning', '#Elearning', '#DistanceLearning', '#OnlineCourses', '#LearnOnline', '#DigitalEducation', '#EdTech'],
        'Study Tips': ['#StudyTips', '#StudyMotivation', '#StudentLife', '#StudyHacks', '#Studying', '#ExamPrep', '#StudyGoals'],
        'Career Development': ['#CareerDevelopment', '#CareerGrowth', '#ProfessionalDevelopment', '#CareerAdvice', '#CareerGoals', '#CareerSuccess'],
        'Language Learning': ['#LanguageLearning', '#LearnLanguages', '#Polyglot', '#LanguageStudy', '#Bilingual', '#LanguageExchange', '#LearnALanguage'],
        'Science': ['#Science', '#ScienceFacts', '#ScienceEducation', '#STEM', '#ScienceNews', '#ScienceDaily', '#ScienceIsAwesome'],
        'History': ['#History', '#HistoryFacts', '#HistoryLovers', '#HistoricalEvents', '#LearnHistory', '#HistoryEducation', '#HistoryNerd'],
        'Mathematics': ['#Mathematics', '#Math', '#MathEducation', '#MathTips', '#MathHelp', '#MathIsBeautiful', '#MathLearning'],
        'Coding Tutorials': ['#CodingTutorial', '#LearnToCode', '#Programming', '#CodeNewbie', '#100DaysOfCode', '#WebDevelopment', '#CodingLife'],
        'Academic Writing': ['#AcademicWriting', '#Writing', '#ResearchPaper', '#ThesisWriting', '#AcademicLife', '#WritingTips', '#Scholar'],
        'Test Preparation': ['#TestPrep', '#ExamPreparation', '#StudyForExams', '#TestTaking', '#ExamSuccess', '#SAT', '#GRE'],
    },
    sports: {
        'Football': ['#Football', '#NFL', '#FootballSeason', '#FootballLife', '#FootballFans', '#FootballGame', '#FootballNews'],
        'Basketball': ['#Basketball', '#NBA', '#BasketballLife', '#Hoops', '#BasketballGame', '#BasketballFans', '#BallIsLife'],
        'Soccer': ['#Soccer', '#Football', '#FIFA', '#SoccerLife', '#SoccerGame', '#SoccerFans', '#BeautifulGame', '#SoccerNews'],
        'Tennis': ['#Tennis', '#TennisLife', '#TennisPlayer', '#TennisMatch', '#TennisFans', '#TennisWorld', '#TennisLove'],
        'Baseball': ['#Baseball', '#MLB', '#BaseballSeason', '#BaseballLife', '#BaseballGame', '#BaseballFans', '#BaseballNews'],
        'Cricket': ['#Cricket', '#CricketLovers', '#CricketMatch', '#CricketFans', '#CricketLife', '#CricketWorld', '#CricketNews'],
        'Golf': ['#Golf', '#GolfLife', '#GolfCourse', '#GolfSwing', '#GolfGame', '#GolfLove', '#GolfTips'],
        'MMA': ['#MMA', '#UFC', '#MixedMartialArts', '#MMAFighter', '#MMATraining', '#MMALife', '#FightNight'],
        'Olympics': ['#Olympics', '#OlympicGames', '#TeamUSA', '#OlympicSpirit', '#OlympicAthletes', '#GoForGold', '#OlympicDreams'],
        'Sports News': ['#SportsNews', '#Sports', '#SportsTalk', '#SportsUpdate', '#SportsWorld', '#SportsFans', '#AthletesLife'],
    },
    travel: {
        'Travel Tips': ['#TravelTips', '#TravelHacks', '#TravelAdvice', '#TravelSmart', '#TravelGuide', '#TravelPlanning', '#TravelWisdom'],
        'Destinations': ['#TravelDestinations', '#TravelGoals', '#BucketList', '#Wanderlust', '#TravelTheWorld', '#ExploreMore', '#TravelInspiration'],
        'Budget Travel': ['#BudgetTravel', '#TravelOnABudget', '#CheapTravel', '#BackpackerLife', '#AffordableTravel', '#TravelCheap', '#BudgetFriendly'],
        'Luxury Travel': ['#LuxuryTravel', '#LuxuryLifestyle', '#TravelInStyle', '#LuxuryDestinations', '#FiveStarTravel', '#LuxuryVacation'],
        'Adventure Travel': ['#AdventureTravel', '#Adventure', '#AdventureSeeker', '#ThrillSeeker', '#AdventureTime', '#ExtremeTravel', '#AdventureAwaits'],
        'Solo Travel': ['#SoloTravel', '#SoloTraveler', '#TravelSolo', '#SoloAdventure', '#IndependentTravel', '#SoloFemaleTravel', '#TravelAlone'],
        'Travel Photography': ['#TravelPhotography', '#TravelPhoto', '#Travelgram', '#InstaTravel', '#TravelPics', '#Photography', '#TravelCaptures'],
        'Hotels & Resorts': ['#Hotels', '#Resort', '#LuxuryHotel', '#HotelLife', '#Accommodation', '#HotelStay', '#ResortLife'],
        'Travel Hacks': ['#TravelHacks', '#TravelTips', '#SmartTravel', '#TravelSecrets', '#TravelTricks', '#TravelLife', '#TravelBetter'],
        'Cultural Experiences': ['#Culture', '#CulturalTravel', '#LocalCulture', '#CulturalExperience', '#TravelCulture', '#Traditions', '#CulturalHeritage'],
    },
    food: {
        'Recipes': ['#Recipes', '#FoodRecipes', '#CookingRecipes', '#EasyRecipes', '#HomeCooking', '#RecipeIdeas', '#RecipeOfTheDay'],
        'Baking': ['#Baking', '#BakingLove', '#Homemade', '#BakingFromScratch', '#BakingLife', '#BakingAddict', '#BakingGoals'],
        'Healthy Eating': ['#HealthyEating', '#EatClean', '#HealthyFood', '#CleanEating', '#NutritionTips', '#HealthyChoices', '#WellnessFood'],
        'Vegan/Vegetarian': ['#Vegan', '#Vegetarian', '#PlantBased', '#VeganFood', '#VegetarianRecipes', '#PlantBasedDiet', '#VeganLife'],
        'Meal Prep': ['#MealPrep', '#MealPlanning', '#MealPrepSunday', '#HealthyMealPrep', '#PrepYourMeals', '#MealPrepIdeas', '#FoodPrep'],
        'Restaurant Reviews': ['#FoodReview', '#RestaurantReview', '#Foodie', '#FoodBlogger', '#RestaurantLife', '#DiningOut', '#FoodCritic'],
        'Food Photography': ['#FoodPhotography', '#FoodPorn', '#Instafood', '#FoodPics', '#FoodStyling', '#FoodGram', '#FoodPhoto'],
        'Cooking Tips': ['#CookingTips', '#CookingHacks', '#KitchenTips', '#ChefTips', '#CookingSkills', '#CookBetter', '#CookingAdvice'],
        'International Cuisine': ['#InternationalCuisine', '#WorldFood', '#GlobalFlavors', '#EthnicFood', '#FoodCulture', '#InternationalFood'],
        'Desserts': ['#Desserts', '#Dessert', '#SweetTooth', '#DessertLover', '#Sweets', '#DessertTime', '#DessertGoals'],
    },
    fashion: {
        'Fashion Trends': ['#FashionTrends', '#Fashion', '#Style', '#Trendy', '#FashionWeek', '#FashionInspo', '#FashionStyle'],
        'Makeup': ['#Makeup', '#MakeupArtist', '#Beauty', '#MakeupLover', '#MakeupTutorial', '#MakeupLooks', '#MakeupAddict'],
        'Skincare': ['#Skincare', '#SkincareRoutine', '#SkincareAddict', '#HealthySkin', '#SkincareTips', '#BeautyRoutine', '#GlowingSkin'],
        'Hair Care': ['#HairCare', '#HealthyHair', '#HairGoals', '#HairTips', '#HairRoutine', '#HairHealth', '#BeautifulHair'],
        'Style Tips': ['#StyleTips', '#FashionTips', '#StyleAdvice', '#StyleGuide', '#FashionAdvice', '#StyleInspo', '#FashionHacks'],
        'Sustainable Fashion': ['#SustainableFashion', '#EcoFashion', '#SlowFashion', '#EthicalFashion', '#GreenFashion', '#SustainableStyle'],
        'Accessories': ['#Accessories', '#FashionAccessories', '#Jewelry', '#Bags', '#Shoes', '#AccessoriesOfTheDay', '#StyleAccessories'],
        'Beauty Products': ['#BeautyProducts', '#Beauty', '#Cosmetics', '#BeautyEssentials', '#BeautyFinds', '#BeautyReview', '#MakeupProducts'],
        'Fashion Week': ['#FashionWeek', '#NYFW', '#RunwayFashion', '#FashionShow', '#HighFashion', '#Runway', '#FashionEvent'],
        'Personal Style': ['#PersonalStyle', '#MyStyle', '#OOTD', '#StyleInspo', '#FashionStyle', '#StyleDiary', '#FashionDaily'],
    },
    science: {
        'Space & Astronomy': ['#Space', '#Astronomy', '#NASA', '#SpaceExploration', '#Cosmos', '#Universe', '#Astrophysics', '#SpaceScience'],
        'Physics': ['#Physics', '#QuantumPhysics', '#PhysicsLove', '#Science', '#PhysicsFacts', '#TheoreticalPhysics', '#PhysicsEducation'],
        'Biology': ['#Biology', '#LifeScience', '#BiologyFacts', '#Genetics', '#Microbiology', '#BiologyLove', '#BiologyEducation'],
        'Chemistry': ['#Chemistry', '#ChemistryLove', '#ChemistryFacts', '#OrganicChemistry', '#ChemLab', '#ChemistryEducation', '#Science'],
        'Environmental Science': ['#EnvironmentalScience', '#Environment', '#ClimateChange', '#Sustainability', '#EcoScience', '#GreenScience'],
        'Research': ['#Research', '#ScientificResearch', '#ResearchLife', '#Academia', '#ScienceResearch', '#ResearchPaper', '#Scholar'],
        'Innovations': ['#Innovation', '#ScienceInnovation', '#TechInnovation', '#FutureTech', '#Breakthrough', '#ScientificDiscovery'],
        'Scientific Discoveries': ['#ScientificDiscovery', '#Discovery', '#ScienceNews', '#Breakthrough', '#NewScience', '#ScienceFacts'],
        'Climate Change': ['#ClimateChange', '#GlobalWarming', '#ClimateAction', '#ClimateScience', '#SaveThePlanet', '#ClimateEmergency'],
        'Neuroscience': ['#Neuroscience', '#BrainScience', '#Neurology', '#CognitiveScience', '#BrainResearch', '#Neurobiology', '#BrainHealth'],
    },
    politics: {
        'Current Events': ['#CurrentEvents', '#News', '#BreakingNews', '#WorldNews', '#Politics', '#NewsUpdate', '#TodaysNews'],
        'Elections': ['#Elections', '#Vote', '#Election2024', '#Democracy', '#VotingMatters', '#ElectionDay', '#PoliticalElection'],
        'Policy': ['#Policy', '#PublicPolicy', '#PolicyChange', '#PolicyMatters', '#Government', '#PolicyDebate', '#PolicyAnalysis'],
        'International Relations': ['#InternationalRelations', '#ForeignPolicy', '#Diplomacy', '#GlobalPolitics', '#WorldAffairs', '#Geopolitics'],
        'Government': ['#Government', '#Politics', '#PublicService', '#GovernmentNews', '#PolicyMaking', '#Governance', '#PublicAffairs'],
        'Political Commentary': ['#PoliticalCommentary', '#Politics', '#PoliticalAnalysis', '#PoliticalOpinion', '#PoliticalDebate', '#Commentary'],
        'Social Issues': ['#SocialIssues', '#SocialJustice', '#Equality', '#HumanRights', '#SocialChange', '#Justice', '#Activism'],
        'Activism': ['#Activism', '#Activist', '#SocialChange', '#MakeADifference', '#ChangeTheWorld', '#SocialMovement', '#TakeAction'],
        'Democracy': ['#Democracy', '#DemocraticValues', '#Freedom', '#Liberty', '#DemocraticProcess', '#CivicEngagement', '#Vote'],
        'Political News': ['#PoliticalNews', '#Politics', '#NewsUpdate', '#PoliticsToday', '#PoliticalUpdate', '#GovernmentNews', '#PolicyNews'],
    },
    art: {
        'Digital Art': ['#DigitalArt', '#DigitalArtist', '#DigitalPainting', '#ArtOfTheDay', '#DigitalIllustration', '#ArtWork', '#DigitalCreative'],
        'Graphic Design': ['#GraphicDesign', '#Design', '#Designer', '#GraphicDesigner', '#DesignInspiration', '#CreativeDesign', '#VisualDesign'],
        'Photography': ['#Photography', '#Photo', '#Photographer', '#PhotoOfTheDay', '#InstaPhoto', '#PhotoArt', '#PhotographyLovers'],
        'Illustration': ['#Illustration', '#Illustrator', '#ArtIllustration', '#DrawingArt', '#IllustrationArt', '#ArtisticIllustration'],
        'UI/UX Design': ['#UIUXDesign', '#UIDesign', '#UXDesign', '#UserExperience', '#UserInterface', '#DesignThinking', '#ProductDesign'],
        'Architecture': ['#Architecture', '#ArchitectureDesign', '#Architect', '#ArchitectureLovers', '#ModernArchitecture', '#BuildingDesign'],
        'Fine Arts': ['#FineArt', '#Art', '#Artist', '#ArtGallery', '#ContemporaryArt', '#ArtLovers', '#ArtisticExpression'],
        'Creative Process': ['#CreativeProcess', '#Creative', '#Creativity', '#ArtProcess', '#CreativeJourney', '#MakingArt', '#ArtisticProcess'],
        'Design Trends': ['#DesignTrends', '#TrendingDesign', '#DesignInspiration', '#ModernDesign', '#DesignIdeas', '#DesignCommunity'],
        'Art History': ['#ArtHistory', '#HistoryOfArt', '#ClassicArt', '#ArtEducation', '#ArtMovement', '#ArtisticHeritage', '#ArtScholar'],
    },
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
