// Mock participating companies data
export const mockParticipatingCompanies = [
  {
    _id: "comp_1",
    company_id: "64f5a2b8c9d4e5f6a7b8c9e0",
    company_name: "TechCorp Solutions",
    booth: {
      number: "B-20",
      size: "4x4",
      location: "Innovation Zone",
      facilities: ["Power", "Internet", "Table", "Chairs", "Monitor"]
    },
    participation_fee: 2000,
    auto_approve: false,
    special_requirements: "Need additional power outlets for demo setup",
    status: "approved"
  },
  {
    _id: "comp_2",
    company_id: "64f5a2b8c9d4e5f6a7b8c9e1",
    company_name: "Innovation Labs",
    booth: {
      number: "A-15",
      size: "3x3",
      location: "Main Hall",
      facilities: ["Power", "Internet", "Table", "Chairs"]
    },
    participation_fee: 1500,
    auto_approve: true,
    special_requirements: "",
    status: "approved"
  },
  {
    _id: "comp_3",
    company_id: "64f5a2b8c9d4e5fda7b8c9e1",
    company_name: "Digital Innovations",
    booth: {
      number: "C-10",
      size: "5x5",
      location: "Tech Pavilion",
      facilities: ["Power", "Internet", "Table", "Chairs", "Monitor", "AV Equipment"]
    },
    participation_fee: 2500,
    auto_approve: false,
    special_requirements: "Requires high-speed internet connection",
    status: "pending"
  },
  {
    _id: "comp_4",
    company_id: "64f5a2b8cxx4e5fda7b8c9e1",
    company_name: "Digital Innovations",
    booth: {
      number: "C-10",
      size: "5x5",
      location: "Tech Pavilion",
      facilities: ["Power", "Internet", "Table", "Chairs", "Monitor", "AV Equipment"]
    },
    participation_fee: 2500,
    auto_approve: false,
    special_requirements: "Requires high-speed internet connection",
    status: "approved"
  }
];
