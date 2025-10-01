// Mock authentication data
export const mockUsers = [
  {
    _id: "user_1",
    email: "organization@gmail.com",
    password: "organization@gmail.com",
    is_owner: true,
    status: true,
    profile_image: "",
    name: "TechCorp Events & Solutions",
    bio: {
      description: "Premier technology event organizer and solutions provider",
      website: "https://techcorp-events.com",
      industry: "Technology & Events",
      founded_year: 2020
    },
    social_links: {
      facebook: "https://facebook.com/techcorp-events",
      twitter: "https://twitter.com/techcorpevents",
      linkedin: "https://linkedin.com/company/techcorp-events",
      instagram: "https://instagram.com/techcorpevents"
    }
  },
  {
    _id: "user_2",
    email: "jane@example.com",
    password: "password123",
    is_owner: false,
    status: true,
    profile_image: "",
    name: "Jane's Organization",
    bio: {
      description: "Professional event management company",
      website: "https://janes-org.com",
      industry: "Event Management",
      founded_year: 2019
    },
    social_links: {
      facebook: "https://facebook.com/janes-org",
      twitter: "https://twitter.com/janesorg",
      linkedin: "https://linkedin.com/company/janes-org",
      instagram: "https://instagram.com/janesorg"
    }
  },
];

// Mock verification codes storage
export const mockVerificationCodes = new Map();

// Helper function to generate verification code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to simulate API delay
export const simulateApiDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
