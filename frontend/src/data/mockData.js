// Mock data for the rider-facing pages (Dashboard, Find Rides, Post Route,
// Cost Split, Emergency Contact). In a full build this would come from the
// backend API instead.

export const currentUser = {
  name: 'Akash Kumar',
  role: 'Student',
  initials: 'AK',
  homeLabel: 'Home',
  campusLabel: 'University',
}

export const dashboardStats = [
  {
    id: 'upcoming',
    label: 'Upcoming Rides',
    value: '3',
    sublabel: 'Next: Today, 07:30 AM',
    tone: 'purple',
  },
  {
    id: 'requests',
    label: 'Active Requests',
    value: '2',
    sublabel: 'Awaiting response',
    tone: 'blue',
  },
  {
    id: 'savings',
    label: 'Monthly Savings',
    value: 'PKR 2,450',
    sublabel: '18% from last month',
    tone: 'green',
    trend: 'up',
  },
  {
    id: 'rating',
    label: 'Your Rating',
    value: '4.7',
    sublabel: 'From 28 reviews',
    tone: 'amber',
  },
]

export const nextRide = {
  from: 'Home',
  to: 'University',
  date: 'Today',
  time: '07:30 AM',
  driver: { name: 'Danish Ali', rating: 4.8, initials: 'DA' },
  passengers: [
    { initials: 'RF' },
    { initials: 'UA' },
  ],
  extraPassengers: 2,
  pricePerPerson: 'PKR 120',
}

export const quickActions = [
  { id: 'find-rides', label: 'Find Rides', sublabel: 'Search matching rides', page: 'find-rides' },
  { id: 'post-route', label: 'Post Route', sublabel: 'Share your route', page: 'post-route' },
  { id: 'on-my-way', label: "I'm On My Way", sublabel: 'Send live update', page: null },
  { id: 'emergency', label: 'Emergency Contact', sublabel: 'Share your location', page: 'emergency' },
]

export const recentActivity = [
  { id: 1, initials: 'SK', text: 'Sarah Khan approved your request', time: '10m ago' },
  { id: 2, initials: 'DA', text: 'Trip completed with Danish Ali', time: '2h ago' },
  { id: 3, initials: 'HR', text: 'You rated Hassan Raza 5 stars', time: 'Yesterday' },
  { id: 4, initials: 'YO', text: 'You posted a new route', time: '2d ago' },
]

export const rideMatches = [
  {
    id: 'm1',
    driver: { name: 'Danish Ali', initials: 'DA', verified: true, rating: 4.8, reviews: 24 },
    car: 'Honda Civic · ABC-123',
    seatsAvailable: 3,
    seatsTotal: 4,
    match: 95,
    departTime: '07:30 AM',
    arriveTime: '08:00 AM',
    fromLabel: 'Home',
    toLabel: 'University',
    postedAgo: '2h ago',
    days: 'Mon, Tue, Wed, Thu',
    price: 'PKR 120',
    bucket: 'best',
  },
  {
    id: 'm2',
    driver: { name: 'Sarah Khan', initials: 'SK', verified: true, rating: 4.7, reviews: 18 },
    car: 'Suzuki Swift · DEF-456',
    seatsAvailable: 2,
    seatsTotal: 3,
    match: 90,
    departTime: '07:40 AM',
    arriveTime: '08:15 AM',
    fromLabel: 'Home',
    toLabel: 'University',
    postedAgo: '3h ago',
    days: 'Mon, Wed, Fri',
    price: 'PKR 150',
    bucket: 'best',
  },
  {
    id: 'm3',
    driver: { name: 'Hassan Raza', initials: 'HR', verified: true, rating: 4.6, reviews: 15 },
    car: 'Toyota Corolla · GHI-789',
    seatsAvailable: 1,
    seatsTotal: 3,
    match: 85,
    departTime: '07:20 AM',
    arriveTime: '07:55 AM',
    fromLabel: 'Home',
    toLabel: 'University',
    postedAgo: '3h ago',
    days: 'Mon, Tue, Thu, Fri',
    price: 'PKR 110',
    bucket: 'best',
  },
  {
    id: 'm4',
    driver: { name: 'Usman Tariq', initials: 'UT', verified: true, rating: 4.5, reviews: 11 },
    car: 'Toyota Yaris · JKL-321',
    seatsAvailable: 2,
    seatsTotal: 4,
    match: 78,
    departTime: '06:50 AM',
    arriveTime: '07:25 AM',
    fromLabel: 'Home',
    toLabel: 'University',
    postedAgo: '5h ago',
    days: 'Mon, Tue, Wed, Thu, Fri',
    price: 'PKR 100',
    bucket: 'earlier',
  },
  {
    id: 'm5',
    driver: { name: 'Ayesha Noor', initials: 'AN', verified: true, rating: 4.9, reviews: 30 },
    car: 'Honda City · MNO-654',
    seatsAvailable: 3,
    seatsTotal: 4,
    match: 72,
    departTime: '08:30 AM',
    arriveTime: '09:05 AM',
    fromLabel: 'Home',
    toLabel: 'University',
    postedAgo: '1h ago',
    days: 'Tue, Thu',
    price: 'PKR 130',
    bucket: 'later',
  },
]

export const defaultEmergencyContacts = {
  primary: { name: 'Amara Kumar', phone: '+92 300 1234567' },
  shareLiveStatus: true,
  secondary: { name: '', phone: '' },
}

export const defaultCostSplit = {
  distanceKm: 12.4,
  riders: 4,
  ratePerKm: 24.2,
  parkingAndTolls: 180,
}
