// Mock companies data
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
