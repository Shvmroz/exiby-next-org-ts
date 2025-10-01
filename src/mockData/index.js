// Mock data for the application
export const mockUsers = [
  {
    _id: "user_1",
    first_name: "John",
    last_name: "Doe",
    email: "admin@example.com",
    password: "password123",
    is_owner: true,
    status: true,
    profile_image: "",
  },
  {
    _id: "user_2",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@example.com",
    password: "password123",
    is_owner: false,
    status: true,
    profile_image: "",
  },
];

export const mockCompanies = [
  {
    _id: "comp_1",
    orgn_user: {
      _id: "org_1",
      name: "TechCorp Solutions",
    },
    bio: {
      services: ["Web Development", "Mobile Apps", "Cloud Services"],
      description: "<p>Leading technology solutions provider specializing in innovative software development and digital transformation services.</p>",
      industry: "technology",
      company_size: "51-200",
      founded_year: 2015,
      location: "San Francisco, CA, USA",
    },
    social_links: {
      linkedin: "https://linkedin.com/company/techcorp",
      twitter: "https://twitter.com/techcorp",
      facebook: "https://facebook.com/techcorp",
    },
    contact: {
      email: "contact@techcorp.com",
      phone: "+1-555-0123",
      address: "123 Tech Street, San Francisco, CA 94105",
    },
    status: true,
    total_events: 15,
    total_payments: 45000,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-12-01T14:20:00Z",
  },
  {
    _id: "comp_2",
    orgn_user: {
      _id: "org_2",
      name: "Innovation Labs",
    },
    bio: {
      services: ["AI Research", "Machine Learning", "Data Analytics"],
      description: "<p>Cutting-edge research and development company focused on artificial intelligence and machine learning solutions.</p>",
      industry: "technology",
      company_size: "11-50",
      founded_year: 2018,
      location: "Austin, TX, USA",
    },
    social_links: {
      linkedin: "https://linkedin.com/company/innovationlabs",
      twitter: "https://twitter.com/innovationlabs",
    },
    contact: {
      email: "hello@innovationlabs.com",
      phone: "+1-555-0456",
      address: "456 Innovation Drive, Austin, TX 78701",
    },
    status: true,
    total_events: 8,
    total_payments: 28000,
    createdAt: "2024-02-20T09:15:00Z",
    updatedAt: "2024-11-28T16:45:00Z",
  },
  {
    _id: "comp_3",
    orgn_user: {
      _id: "org_3",
      name: "Digital Marketing Pro",
    },
    bio: {
      services: ["Digital Marketing", "SEO", "Social Media Management"],
      description: "<p>Full-service digital marketing agency helping businesses grow their online presence and reach their target audience.</p>",
      industry: "media",
      company_size: "21-50",
      founded_year: 2020,
      location: "New York, NY, USA",
    },
    social_links: {
      linkedin: "https://linkedin.com/company/digitalmarketingpro",
      facebook: "https://facebook.com/digitalmarketingpro",
    },
    contact: {
      email: "info@digitalmarketingpro.com",
      phone: "+1-555-0789",
      address: "789 Marketing Ave, New York, NY 10001",
    },
    status: false,
    total_events: 12,
    total_payments: 35000,
    createdAt: "2024-03-10T11:00:00Z",
    updatedAt: "2024-12-02T08:30:00Z",
  },
];

export const mockEvents = [
  {
    _id: "event_1",
    title: "Tech Innovation Summit 2024",
    description: "<p>Join us for the biggest technology innovation summit of the year featuring keynote speakers, workshops, and networking opportunities.</p>",
    slug: "tech-innovation-summit-2024",
    status: "published",
    current_attendees: 150,
    max_attendees: 500,
    registration_deadline: "2024-12-20T23:59:59Z",
    startAt: "2024-12-25T09:00:00Z",
    endAt: "2024-12-25T17:00:00Z",
    venue: {
      type: "physical",
      address: "Convention Center",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postal_code: "94105",
    },
    ticketPrice: 299,
    currency: "USD",
    isPaidEvent: true,
    is_public: true,
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-12-01T15:30:00Z",
    orgn_user: {
      _id: "org_1",
      name: "TechCorp Solutions",
    },
  },
  {
    _id: "event_2",
    title: "AI & Machine Learning Workshop",
    description: "<p>Hands-on workshop covering the latest trends in artificial intelligence and machine learning technologies.</p>",
    slug: "ai-ml-workshop",
    status: "published",
    current_attendees: 75,
    max_attendees: 100,
    registration_deadline: "2024-12-15T23:59:59Z",
    startAt: "2024-12-18T14:00:00Z",
    endAt: "2024-12-18T18:00:00Z",
    venue: {
      type: "virtual",
      platform: "Zoom",
      virtual_link: "https://zoom.us/j/1234567890",
    },
    ticketPrice: 0,
    currency: "USD",
    isPaidEvent: false,
    is_public: true,
    createdAt: "2024-10-15T12:00:00Z",
    updatedAt: "2024-11-20T09:45:00Z",
    orgn_user: {
      _id: "org_2",
      name: "Innovation Labs",
    },
  },
  {
    _id: "event_3",
    title: "Digital Marketing Masterclass",
    description: "<p>Comprehensive masterclass on digital marketing strategies, SEO optimization, and social media marketing.</p>",
    slug: "digital-marketing-masterclass",
    status: "draft",
    current_attendees: 0,
    max_attendees: 200,
    registration_deadline: "2025-01-10T23:59:59Z",
    startAt: "2025-01-15T10:00:00Z",
    endAt: "2025-01-15T16:00:00Z",
    venue: {
      type: "hybrid",
      address: "Marketing Hub",
      city: "New York",
      state: "NY",
      country: "USA",
      postal_code: "10001",
      platform: "Microsoft Teams",
      virtual_link: "https://teams.microsoft.com/l/meetup-join/...",
    },
    ticketPrice: 149,
    currency: "USD",
    isPaidEvent: true,
    is_public: false,
    createdAt: "2024-11-25T14:30:00Z",
    updatedAt: "2024-12-01T11:15:00Z",
    orgn_user: {
      _id: "org_3",
      name: "Digital Marketing Pro",
    },
  },
];

export const mockOrganizations = [
  {
    _id: "org_1",
    orgn_user: {
      _id: "org_user_1",
      name: "TechCorp Solutions",
    },
    total_events: 15,
    total_revenue: 45000,
    status: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-12-01T14:20:00Z",
  },
  {
    _id: "org_2",
    orgn_user: {
      _id: "org_user_2",
      name: "Innovation Labs",
    },
    total_events: 8,
    total_revenue: 28000,
    status: true,
    createdAt: "2024-02-20T09:15:00Z",
    updatedAt: "2024-11-28T16:45:00Z",
  },
  {
    _id: "org_3",
    orgn_user: {
      _id: "org_user_3",
      name: "Digital Marketing Pro",
    },
    total_events: 12,
    total_revenue: 35000,
    status: false,
    createdAt: "2024-03-10T11:00:00Z",
    updatedAt: "2024-12-02T08:30:00Z",
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