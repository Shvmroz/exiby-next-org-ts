// Mock event attendees data
export const mockEventAttendees = [
  {
    _id: "attendee_1",
    event_id: "event_1",
    registration_id: "REG-2024-001",
    attendee: {
      _id: "user_1",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0123",
      job_title: "Software Engineer",
      company: "TechCorp Solutions",
      industry: "Technology",
      experience: "5+ years",
      avatar: "",
      linkedin: "https://linkedin.com/in/johnsmith",
      twitter: "https://twitter.com/johnsmith"
    },
    registration: {
      type: "Early Bird",
      status: "confirmed",
      registration_date: "2024-01-15T10:30:00Z",
      check_in_time: "2024-01-20T09:15:00Z",
      ticket_number: "TKT-001",
      badge_printed: true
    },
    payment: {
      status: "paid",
      amount: 299.99,
      currency: "USD",
      payment_method: "Credit Card",
      transaction_id: "TXN-789456123",
      payment_date: "2024-01-15T10:35:00Z",
      receipt_url: "#"
    },
    dietary_requirements: "Vegetarian",
    accessibility_needs: "",
    emergency_contact: {
      name: "Jane Smith",
      phone: "+1-555-0124",
      relationship: "Spouse"
    },
    special_requests: "Need quiet space for phone calls during breaks"
  },
  {
    _id: "attendee_2",
    event_id: "event_1",
    registration_id: "REG-2024-002",
    attendee: {
      _id: "user_2",
      name: "Sarah Johnson",
      email: "sarah.j@innovationlabs.com",
      phone: "+1-555-0456",
      job_title: "Product Manager",
      company: "Innovation Labs",
      industry: "Technology",
      experience: "8+ years",
      avatar: "",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: ""
    },
    registration: {
      type: "Standard",
      status: "confirmed",
      registration_date: "2024-01-16T14:20:00Z",
      check_in_time: "2024-01-20T08:45:00Z",
      ticket_number: "TKT-002",
      badge_printed: true
    },
    payment: {
      status: "paid",
      amount: 399.99,
      currency: "USD",
      payment_method: "PayPal",
      transaction_id: "PP-456789123",
      payment_date: "2024-01-16T14:25:00Z",
      receipt_url: "#"
    },
    dietary_requirements: "",
    accessibility_needs: "Wheelchair accessible seating",
    emergency_contact: {
      name: "Mike Johnson",
      phone: "+1-555-0457",
      relationship: "Brother"
    },
    special_requests: ""
  },
  {
    _id: "attendee_3",
    event_id: "event_1",
    registration_id: "REG-2024-003",
    attendee: {
      _id: "user_3",
      name: "Michael Chen",
      email: "m.chen@globalventures.com",
      phone: "+1-555-0789",
      job_title: "Investment Director",
      company: "Global Ventures",
      industry: "Finance",
      experience: "12+ years",
      avatar: "",
      linkedin: "https://linkedin.com/in/michaelchen",
      twitter: "https://twitter.com/mchen"
    },
    registration: {
      type: "VIP",
      status: "confirmed",
      registration_date: "2024-01-10T09:15:00Z",
      check_in_time: "2024-01-20T09:00:00Z",
      ticket_number: "TKT-003",
      badge_printed: true
    },
    payment: {
      status: "paid",
      amount: 599.99,
      currency: "USD",
      payment_method: "Bank Transfer",
      transaction_id: "BT-123456789",
      payment_date: "2024-01-10T11:00:00Z",
      receipt_url: "#"
    },
    dietary_requirements: "Gluten-free",
    accessibility_needs: "",
    emergency_contact: {
      name: "Lisa Chen",
      phone: "+1-555-0790",
      relationship: "Assistant"
    },
    special_requests: "Prefer front row seating for presentations"
  },
  {
    _id: "attendee_4",
    event_id: "event_1",
    registration_id: "REG-2024-004",
    attendee: {
      _id: "user_4",
      name: "Emma Rodriguez",
      email: "emma.r@digitaldynamics.com",
      phone: "+1-555-0321",
      job_title: "UX Designer",
      company: "Digital Dynamics",
      industry: "Design",
      experience: "4+ years",
      avatar: "",
      linkedin: "https://linkedin.com/in/emmarodriguez",
      twitter: "https://twitter.com/emmarodriguez"
    },
    registration: {
      type: "Student",
      status: "pending",
      registration_date: "2024-01-18T16:45:00Z",
      check_in_time: null,
      ticket_number: "TKT-004",
      badge_printed: false
    },
    payment: {
      status: "pending",
      amount: 199.99,
      currency: "USD",
      payment_method: "Credit Card",
      transaction_id: "",
      payment_date: "",
      receipt_url: ""
    },
    dietary_requirements: "Vegan",
    accessibility_needs: "",
    emergency_contact: {
      name: "Carlos Rodriguez",
      phone: "+1-555-0322",
      relationship: "Father"
    },
    special_requests: "Student discount verification pending"
  },
  {
    _id: "attendee_5",
    event_id: "event_1",
    registration_id: "REG-2024-005",
    attendee: {
      _id: "user_5",
      name: "David Kim",
      email: "d.kim@futuresystems.com",
      phone: "+1-555-0654",
      job_title: "AI Research Scientist",
      company: "Future Systems",
      industry: "Artificial Intelligence",
      experience: "10+ years",
      avatar: "",
      linkedin: "https://linkedin.com/in/davidkim",
      twitter: ""
    },
    registration: {
      type: "Speaker",
      status: "confirmed",
      registration_date: "2024-01-05T11:00:00Z",
      check_in_time: "2024-01-20T08:30:00Z",
      ticket_number: "TKT-005",
      badge_printed: true
    },
    payment: {
      status: "waived",
      amount: 0,
      currency: "USD",
      payment_method: "Speaker Pass",
      transaction_id: "SPK-001",
      payment_date: "2024-01-05T11:00:00Z",
      receipt_url: ""
    },
    dietary_requirements: "",
    accessibility_needs: "",
    emergency_contact: {
      name: "Grace Kim",
      phone: "+1-555-0655",
      relationship: "Wife"
    },
    special_requests: "Green room access, presentation equipment setup"
  },
  {
    _id: "attendee_6",
    event_id: "event_1",
    registration_id: "REG-2024-006",
    attendee: {
      _id: "user_6",
      name: "Lisa Thompson",
      email: "lisa.t@greentech.com",
      phone: "+1-555-0987",
      job_title: "Sustainability Consultant",
      company: "GreenTech Innovations",
      industry: "Environmental",
      experience: "6+ years",
      avatar: "",
      linkedin: "https://linkedin.com/in/lisathompson",
      twitter: "https://twitter.com/lisathompson"
    },
    registration: {
      type: "Standard",
      status: "cancelled",
      registration_date: "2024-01-12T13:30:00Z",
      check_in_time: null,
      ticket_number: "TKT-006",
      badge_printed: false
    },
    payment: {
      status: "refunded",
      amount: 399.99,
      currency: "USD",
      payment_method: "Credit Card",
      transaction_id: "TXN-789456124",
      payment_date: "2024-01-12T13:35:00Z",
      refund_date: "2024-01-19T10:00:00Z",
      receipt_url: "#"
    },
    dietary_requirements: "Vegetarian",
    accessibility_needs: "",
    emergency_contact: {
      name: "Tom Thompson",
      phone: "+1-555-0988",
      relationship: "Husband"
    },
    special_requests: "Unable to attend due to family emergency"
  },
  {
    _id: "attendee_7",
    event_id: "event_1",
    registration_id: "REG-2024-007",
    attendee: {
      _id: "user_7",
      name: "Alex Martinez",
      email: "alex.m@cloudtech.com",
      phone: "+1-555-0135",
      job_title: "Cloud Architect",
      company: "CloudTech Solutions",
      industry: "Cloud Computing",
      experience: "7+ years",
      avatar: "",
      linkedin: "https://linkedin.com/in/alexmartinez",
      twitter: ""
    },
    registration: {
      type: "Standard",
      status: "confirmed",
      registration_date: "2024-01-14T10:15:00Z",
      check_in_time: "2024-01-20T09:30:00Z",
      ticket_number: "TKT-007",
      badge_printed: true
    },
    payment: {
      status: "paid",
      amount: 399.99,
      currency: "USD",
      payment_method: "Credit Card",
      transaction_id: "TXN-789456125",
      payment_date: "2024-01-14T10:20:00Z",
      receipt_url: "#"
    },
    dietary_requirements: "",
    accessibility_needs: "",
    emergency_contact: {
      name: "Maria Martinez",
      phone: "+1-555-0136",
      relationship: "Sister"
    },
    special_requests: ""
  },
  {
    _id: "attendee_8",
    event_id: "event_1",
    registration_id: "REG-2024-008",
    attendee: {
      _id: "user_8",
      name: "Jennifer Lee",
      email: "jennifer.l@blockchaininnovations.com",
      phone: "+1-555-0246",
      job_title: "Blockchain Developer",
      company: "Blockchain Innovations",
      industry: "Blockchain",
      experience: "5+ years",
      avatar: "",
      linkedin: "https://linkedin.com/in/jenniferlee",
      twitter: "https://twitter.com/jenniferlee"
    },
    registration: {
      type: "Early Bird",
      status: "confirmed",
      registration_date: "2024-01-11T15:45:00Z",
      check_in_time: "2024-01-20T08:50:00Z",
      ticket_number: "TKT-008",
      badge_printed: true
    },
    payment: {
      status: "paid",
      amount: 299.99,
      currency: "USD",
      payment_method: "Cryptocurrency",
      transaction_id: "BTC-abc123def456",
      payment_date: "2024-01-11T15:50:00Z",
      receipt_url: "#"
    },
    dietary_requirements: "",
    accessibility_needs: "",
    emergency_contact: {
      name: "Robert Lee",
      phone: "+1-555-0247",
      relationship: "Brother"
    },
    special_requests: "Interested in networking with other blockchain developers"
  }
];
