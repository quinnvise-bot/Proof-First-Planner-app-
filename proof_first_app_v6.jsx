import { useState, useEffect } from "react";

const ProofFirstPlanner = () => {
  // ═══════════════ LOGIN & STORAGE STATE ═══════════════
  const [showSplash, setShowSplash] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('calculator');
  const [calculatorData, setCalculatorData] = useState({ servicePrice: '', timeMinutes: '', commissionRate: '' });
  const [pillars, setPillars] = useState({
    purpose: { signature: '', favorite: '', whyBehindChair: '' },
    progress: { educationHours: '', newTechniques: '', certifications: '' },
    profit: { serviceDollars: '', retailAttachment: '', rebookRate: '' },
    process: { consultationFramework: '', documentedFormulas: '', timeSystem: '' }
  });
  const [goals, setGoals] = useState({
    followers: { current: '', goal: '' },
    engagement: { current: '', goal: '' },
    posts: { current: '', goal: '' },
    stories: { current: '', goal: '' }
  });
  const [calendarEvents, setCalendarEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({ type: 'post', content: '', pillar: 'purpose' });
  const [challengeDay, setChallengeDay] = useState(1);
  const [completedDays, setCompletedDays] = useState([]);
  const [resourceTab, setResourceTab] = useState('templates');
  const [selectedDivision, setSelectedDivision] = useState('salon');
  const [userTemplates, setUserTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState({ name: '', category: 'post', notes: '' });
  const [myGoals, setMyGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', pillar: 'purpose', target: '', deadline: '', notes: '' });
  const [myGoalsView, setMyGoalsView] = useState('active');
  const [myChallenges, setMyChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState({ title: '', duration: '7', description: '' });
  const [activeChallengeId, setActiveChallengeId] = useState(null);
  const [challengeTab, setChallengeTab] = useState('30day');
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState({ title: '', quarter: 'Q1', year: '2026', pillar: 'purpose', status: 'planned' });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // ═══════════════ MY PROGRESS STATE ═══════════════
  const [progressView, setProgressView] = useState('map'); // 'map', 'enter', 'stats'
  const [progressPeriod, setProgressPeriod] = useState('daily'); // 'daily', 'weekly', 'monthly', 'yearly'
  const [showAssociatePath, setShowAssociatePath] = useState(true);
  const [dailyEntry, setDailyEntry] = useState({
    serviceTotal: '',
    tips: '',
    retailSales: '',
    serviceHours: '',
    contentHours: '',
    clientsSeen: '',
    rebooks: '',
    retailUnits: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [entries, setEntries] = useState([]);
  const [stylistCommission, setStylistCommission] = useState('');

  // ═══════════════ PERSISTENT STORAGE FUNCTIONS ═══════════════
  const storageKey = (key) => `pf-${userName.toLowerCase().replace(/\s+/g, '-')}-${key}`;

  const saveData = async (key, data) => {
    if (!userName || typeof window === 'undefined' || !window.storage) return;
    try {
      await window.storage.set(storageKey(key), JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const loadData = async (key) => {
    if (!userName || typeof window === 'undefined' || !window.storage) return null;
    try {
      const result = await window.storage.get(storageKey(key));
      return result ? JSON.parse(result.value) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  };

  // Load all user data when logged in
  useEffect(() => {
    const loadAllData = async () => {
      if (!userName || !window.storage) return;
      setIsLoading(true);
      try {
        const [
          savedCalculator, savedPillars, savedGoals, savedCalendarEvents,
          savedChallengeDay, savedCompletedDays, savedUserTemplates, savedMyGoals,
          savedMyChallenges, savedMilestones, savedEntries, savedCommission
        ] = await Promise.all([
          loadData('calculatorData'),
          loadData('pillars'),
          loadData('goals'),
          loadData('calendarEvents'),
          loadData('challengeDay'),
          loadData('completedDays'),
          loadData('userTemplates'),
          loadData('myGoals'),
          loadData('myChallenges'),
          loadData('milestones'),
          loadData('entries'),
          loadData('stylistCommission')
        ]);

        if (savedCalculator) setCalculatorData(savedCalculator);
        if (savedPillars) setPillars(savedPillars);
        if (savedGoals) setGoals(savedGoals);
        if (savedCalendarEvents) setCalendarEvents(savedCalendarEvents);
        if (savedChallengeDay) setChallengeDay(savedChallengeDay);
        if (savedCompletedDays) setCompletedDays(savedCompletedDays);
        if (savedUserTemplates) setUserTemplates(savedUserTemplates);
        if (savedMyGoals) setMyGoals(savedMyGoals);
        if (savedMyChallenges) setMyChallenges(savedMyChallenges);
        if (savedMilestones) setMilestones(savedMilestones);
        if (savedEntries) setEntries(savedEntries);
        if (savedCommission) setStylistCommission(savedCommission);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
      setIsLoading(false);
    };
    loadAllData();
  }, [userName]);

  // Auto-save whenever data changes
  useEffect(() => { if (userName) saveData('calculatorData', calculatorData); }, [calculatorData, userName]);
  useEffect(() => { if (userName) saveData('pillars', pillars); }, [pillars, userName]);
  useEffect(() => { if (userName) saveData('goals', goals); }, [goals, userName]);
  useEffect(() => { if (userName) saveData('calendarEvents', calendarEvents); }, [calendarEvents, userName]);
  useEffect(() => { if (userName) saveData('challengeDay', challengeDay); }, [challengeDay, userName]);
  useEffect(() => { if (userName) saveData('completedDays', completedDays); }, [completedDays, userName]);
  useEffect(() => { if (userName) saveData('userTemplates', userTemplates); }, [userTemplates, userName]);
  useEffect(() => { if (userName) saveData('myGoals', myGoals); }, [myGoals, userName]);
  useEffect(() => { if (userName) saveData('myChallenges', myChallenges); }, [myChallenges, userName]);
  useEffect(() => { if (userName) saveData('milestones', milestones); }, [milestones, userName]);
  useEffect(() => { if (userName) saveData('entries', entries); }, [entries, userName]);
  useEffect(() => { if (userName) saveData('stylistCommission', stylistCommission); }, [stylistCommission, userName]);

  // ═══════════════ QVD LEVEL DATA (10-LEVEL SYSTEM) ═══════════════
  const qvdLevels = [
    { level: 1, dailySales: 325, monthlySales: 7047, annualSales: 84568, rebook: 50, retailUnits: 0.5, dailyRetail: 27, commission: 41, serviceComm: 2889, retailComm: 58, tips: 705, monthlyPotential: 3652, annualPotential: 43820, cutPrice: 59, barberPrice: 29, singleProcess: 79, foilPrice: 178, phase: 'LEARN', experience: '1 year', schedule: '4 Nights Fri/Sat', referrals: 12, wealth: 'Cash not credit' },
    { level: 2, dailySales: 421, monthlySales: 9121, annualSales: 109455, rebook: 60, retailUnits: 0.6, dailyRetail: 38, commission: 42, serviceComm: 3831, retailComm: 83, tips: 912, monthlyPotential: 4826, annualPotential: 57910, cutPrice: 66, barberPrice: 34, singleProcess: 84, foilPrice: 190, phase: 'LEARN', experience: '2-3 years', schedule: '3 Nights Fri/Sat', referrals: 10, wealth: '3 months expenses in bank' },
    { level: 3, dailySales: 535, monthlySales: 11583, annualSales: 138999, rebook: 70, retailUnits: 0.7, dailyRetail: 51, commission: 43, serviceComm: 4981, retailComm: 110, tips: 1158, monthlyPotential: 6250, annualPotential: 74994, cutPrice: 73, barberPrice: 39, singleProcess: 89, foilPrice: 190, phase: 'LEARN', experience: '4-5 years', schedule: '2 Nights Fri/Sat', referrals: 8, wealth: 'Own don\'t rent' },
    { level: 4, dailySales: 629, monthlySales: 13621, annualSales: 163448, rebook: 75, retailUnits: 0.8, dailyRetail: 67, commission: 44, serviceComm: 5993, retailComm: 145, tips: 1362, monthlyPotential: 7500, annualPotential: 90001, cutPrice: 79, barberPrice: 44, singleProcess: 94, foilPrice: 196, phase: 'EARN', experience: '6-7 years', schedule: '2 Nights EO/Sat', referrals: 6, wealth: 'Max your 401k' },
    { level: 5, dailySales: 879, monthlySales: 19038, annualSales: 228451, rebook: 80, retailUnits: 0.9, dailyRetail: 79, commission: 45, serviceComm: 8567, retailComm: 170, tips: 1904, monthlyPotential: 10641, annualPotential: 127691, cutPrice: 86, barberPrice: 49, singleProcess: 99, foilPrice: 202, phase: 'EARN', experience: '7+ years', schedule: 'Flex', referrals: 4, wealth: 'Pay down mortgage' },
    { level: 6, dailySales: 941, monthlySales: 20378, annualSales: 244531, rebook: 83, retailUnits: 1.0, dailyRetail: 115, commission: 46, serviceComm: 9374, retailComm: 248, tips: 2038, monthlyPotential: 11660, annualPotential: 139918, cutPrice: 95, barberPrice: 54, singleProcess: 104, foilPrice: 208, phase: 'LIVE', experience: '8+ years', schedule: 'Flex', referrals: 4, wealth: 'Invest 10-20%' },
    { level: 7, dailySales: 981, monthlySales: 18923, annualSales: 227073, rebook: 83, retailUnits: 1.0, dailyRetail: 74, commission: 47, serviceComm: 8894, retailComm: 248, tips: 1514, monthlyPotential: 10569, annualPotential: 126822, cutPrice: 100, barberPrice: 59, singleProcess: 109, foilPrice: 214 },
    { level: 8, dailySales: 1263, monthlySales: 19661, annualSales: 235935, rebook: 83, retailUnits: 1.0, dailyRetail: 74, commission: 48, serviceComm: 9437, retailComm: 248, tips: 1573, monthlyPotential: 11171, annualPotential: 134056, cutPrice: 105, barberPrice: 64, singleProcess: 114, foilPrice: 220 },
    { level: 9, dailySales: 1313, monthlySales: 20400, annualSales: 244797, rebook: 83, retailUnits: 1.0, dailyRetail: 74, commission: 49, serviceComm: 9996, retailComm: 248, tips: 1632, monthlyPotential: 11789, annualPotential: 141466, cutPrice: 110, barberPrice: 69, singleProcess: 119, foilPrice: 226 },
    { level: 10, dailySales: 1363, monthlySales: 21138, annualSales: 253659, rebook: 83, retailUnits: 1.0, dailyRetail: 74, commission: 50, serviceComm: 10569, retailComm: 248, tips: 1691, monthlyPotential: 12421, annualPotential: 149054, cutPrice: 115, barberPrice: 74, singleProcess: 124, foilPrice: 232 }
  ];

  // Calculate current level based on entries
  const getCurrentStats = () => {
    if (entries.length === 0) return { level: 1, avgDailySales: 0, avgHourlyRate: 0, rebookPct: 0, avgRetailUnits: 0, totalEntries: 0, percentToNext: 0 };
    
    const commRate = (parseFloat(stylistCommission) || 41) / 100;
    const totalServiceSales = entries.reduce((s, e) => s + (parseFloat(e.serviceTotal) || 0), 0);
    const totalTips = entries.reduce((s, e) => s + (parseFloat(e.tips) || 0), 0);
    const totalRetailSales = entries.reduce((s, e) => s + (parseFloat(e.retailSales) || 0), 0);
    const totalServiceHours = entries.reduce((s, e) => s + (parseFloat(e.serviceHours) || 0), 0);
    const totalContentHours = entries.reduce((s, e) => s + (parseFloat(e.contentHours) || 0), 0);
    const totalClients = entries.reduce((s, e) => s + (parseFloat(e.clientsSeen) || 0), 0);
    const totalRebooks = entries.reduce((s, e) => s + (parseFloat(e.rebooks) || 0), 0);
    const totalRetailUnits = entries.reduce((s, e) => s + (parseFloat(e.retailUnits) || 0), 0);
    
    const avgDailySales = totalServiceSales / entries.length;
    const totalHours = totalServiceHours + totalContentHours;
    const totalEarnings = (totalServiceSales * commRate) + totalTips;
    const avgHourlyRate = totalHours > 0 ? totalEarnings / totalHours : 0;
    const rebookPct = totalClients > 0 ? (totalRebooks / totalClients) * 100 : 0;
    const avgRetailUnits = totalClients > 0 ? totalRetailUnits / totalClients : 0;
    
    // Determine level based on average daily sales
    let currentLevel = 1;
    for (let i = qvdLevels.length - 1; i >= 0; i--) {
      if (avgDailySales >= qvdLevels[i].dailySales) {
        currentLevel = qvdLevels[i].level;
        break;
      }
    }
    
    // Calculate percent to next level
    let percentToNext = 100;
    if (currentLevel < 10) {
      const currentTarget = qvdLevels[currentLevel - 1].dailySales;
      const nextTarget = qvdLevels[currentLevel].dailySales;
      percentToNext = Math.min(100, Math.max(0, ((avgDailySales - currentTarget) / (nextTarget - currentTarget)) * 100));
    }
    
    return {
      level: currentLevel,
      avgDailySales: avgDailySales.toFixed(0),
      avgHourlyRate: avgHourlyRate.toFixed(2),
      rebookPct: rebookPct.toFixed(0),
      avgRetailUnits: avgRetailUnits.toFixed(1),
      totalEntries: entries.length,
      percentToNext: percentToNext.toFixed(0),
      totalEarnings: totalEarnings.toFixed(0),
      monthlySalesEst: (avgDailySales * 21.67).toFixed(0),
      annualSalesEst: (avgDailySales * 260).toFixed(0)
    };
  };

  const stats = getCurrentStats();

  const addDailyEntry = () => {
    if (dailyEntry.serviceTotal) {
      setEntries([...entries, { ...dailyEntry, id: Date.now() }]);
      setDailyEntry({
        serviceTotal: '',
        tips: '',
        retailSales: '',
        serviceHours: '',
        contentHours: '',
        clientsSeen: '',
        rebooks: '',
        retailUnits: '',
        date: new Date().toISOString().split('T')[0]
      });
      setProgressView('map');
    }
  };

  const calculateHourlyRate = () => {
    const price = parseFloat(calculatorData.servicePrice) || 0;
    const minutes = parseFloat(calculatorData.timeMinutes) || 0;
    const commission = parseFloat(calculatorData.commissionRate) || 0;
    if (minutes === 0) return { gross: 0, net: 0 };
    const hourlyGross = (price / minutes) * 60;
    const hourlyNet = hourlyGross * (commission / 100);
    return { gross: hourlyGross.toFixed(2), net: hourlyNet.toFixed(2) };
  };
  const rates = calculateHourlyRate();

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['S','M','T','W','T','F','S'];

  const addEvent = () => {
    if (selectedDate && newEvent.content) {
      const dateKey = `${currentYear}-${currentMonth}-${selectedDate}`;
      setCalendarEvents(prev => ({ ...prev, [dateKey]: [...(prev[dateKey] || []), { ...newEvent, id: Date.now() }] }));
      setNewEvent({ type: 'post', content: '', pillar: 'purpose' });
    }
  };

  const addUserTemplate = () => {
    if (newTemplate.name) {
      setUserTemplates([...userTemplates, { ...newTemplate, id: Date.now(), division: selectedDivision }]);
      setNewTemplate({ name: '', category: 'post', notes: '' });
    }
  };

  const addMyGoal = () => {
    if (newGoal.title) {
      setMyGoals([...myGoals, { ...newGoal, id: Date.now(), progress: 0, completed: false, createdAt: new Date().toLocaleDateString() }]);
      setNewGoal({ title: '', pillar: 'purpose', target: '', deadline: '', notes: '' });
    }
  };

  const addMyChallenge = () => {
    if (newChallenge.title) {
      const days = Array.from({ length: parseInt(newChallenge.duration) }, (_, i) => ({ day: i + 1, completed: false, note: '' }));
      setMyChallenges([...myChallenges, { ...newChallenge, id: Date.now(), days, active: true, createdAt: new Date().toLocaleDateString() }]);
      setNewChallenge({ title: '', duration: '7', description: '' });
    }
  };

  const addMilestone = () => {
    if (newMilestone.title) {
      setMilestones([...milestones, { ...newMilestone, id: Date.now() }]);
      setNewMilestone({ title: '', quarter: 'Q1', year: '2026', pillar: 'purpose', status: 'planned' });
    }
  };

  const toggleChallengeDay = (day) => {
    setCompletedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const pillarConfig = {
    purpose: { label: 'Purpose', num: '01', color: '#C9B8A8' },
    progress: { label: 'Progress', num: '02', color: '#D4AF37' },
    profit: { label: 'Profit', num: '03', color: '#D4A5A5' },
    process: { label: 'Process', num: '04', color: '#8B7D6B' }
  };

  const PillarIcon = ({ type, size = 18 }) => {
    const icons = {
      purpose: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>,
      progress: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
      profit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      process: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
    };
    return icons[type] || null;
  };

  // Lightning bolt icon for progress tracker
  const BoltIcon = ({ size = 20, fill = '#D4AF37', glow = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="none" style={glow ? { filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.6))' } : {}}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  );

  const divisionContent = {
    salon: {
      name: 'QVD Salon', tagline: 'Luxury. Self-care. Evolved.', color: '#C9B8A8',
      mission: 'QVD connects self-care, luxury style and your highest self, with highly educated, community obsessed artists.',
      vision: 'To transform our community by empowering mothers and community leaders to embrace self-care as essential, not optional—boldly accepting that filling their own cups first, they reshape the world around them.',
      principles: [
        { title: 'Self-Care as a Revolutionary Act', desc: "Prioritizing yourself isn't selfish—it's how you change the world." },
        { title: 'Mothers & Community Leaders First', desc: 'We champion the mental shift for mothers and leaders as their personal cheerleaders.' },
        { title: 'Highly Educated Artists', desc: "Our team commits to continuous education and mastery of craft. Bettering our best—it's our standard." },
        { title: 'Community Obsessed', desc: 'We build genuine relationships rooted in West Michigan, staying close to home for the greatest impact.' },
        { title: 'Luxury Experience, Always', desc: 'We deliver elevated experiences that honor your investment in yourself.' }
      ],
      hashtags: ['#QVDSalon','#LuxurySelfCare','#HollandMI','#WestMichiganSalon','#SelfCareEvolved','#QuinnViseHairDesign'],
      doPost: ['Before/after transformations','Education moments','Team celebrations','Client testimonials','Self-care tips','Product recommendations'],
      dontPost: ['Competitor mentions','Pricing complaints','Unedited/poor lighting photos','Personal drama','Anything without client consent']
    },
    bridal: {
      name: 'QVD Bridal', tagline: 'Where Your Special Day Begins', color: '#D4A5A5',
      mission: 'We create intimate, high-touch bridal experiences where every detail is thoughtfully considered.',
      vision: "To lead Michigan's bridal industry by creating lifelong friendships around every bride's most sacred day.",
      principles: [
        { title: 'Licensed & Experienced', desc: 'ALL stylists hold current Michigan Cosmetology and Beauty Licenses.' },
        { title: 'Historic Baker Building', desc: 'Reclaimed wood flooring, exposed brick walls create a welcoming, luxurious environment.' },
        { title: 'Dedicated Bridal Team', desc: 'Specialists committed to making your day perfect.' },
        { title: 'Lifelong Friendships', desc: "We don't just do wedding day hair; we celebrate with you through every step." },
        { title: "Michigan's Premier Experience", desc: 'Expanding collaborations throughout the state to serve entire wedding parties.' }
      ],
      hashtags: ['#QVDBridal','#MichiganBride','#WeddingHair','#BridalMakeup','#HollandWedding','#LakeMichiganWedding'],
      doPost: ['Bridal transformations','Wedding party moments','Behind-the-scenes prep','Venue collaborations','Bride testimonials'],
      dontPost: ['Photos without bride permission','Venue criticism','Pricing details publicly','Rushed or chaotic moments']
    },
    leadership: {
      name: 'QVD Leadership', tagline: 'Leading the Self-Care Revolution', color: '#8B7D6B',
      mission: 'We lead through ego-free communication, creative collaboration, by modeling the physical and emotional well-being we champion.',
      vision: 'To build a bold culture of success from the top down that creates authentic impact within the self-care industry.',
      principles: [
        { title: 'Communication Without Ego', desc: 'We lead through honest, humble dialogue that empowers rather than diminishes.' },
        { title: 'Well-Being First, Always', desc: "Physical and emotional wellness are non-negotiable—we model what we teach." },
        { title: 'Creative Collaboration Over Competition', desc: 'Our greatest innovations come from working together with diverse perspectives.' },
        { title: 'Fearless Relearning', desc: 'Lead by example in constantly evolving and challenging old paradigms.' },
        { title: 'Radical Accountability', desc: 'Every team member owns their role in collective success.' }
      ],
      hashtags: ['#QVDLeadership','#SalonLeader','#BeautyIndustryLeader','#TeamCulture','#SalonOwner'],
      doPost: ['Team wins','Education investments','Leadership lessons','Culture moments','Growth mindset content'],
      dontPost: ['Team conflicts','Financial struggles publicly','Complaints about industry','Anything undermining morale']
    },
    hospitality: {
      name: 'QVD Hospitality', tagline: 'Details Matter', color: '#7B9E87',
      mission: 'We create a sanctuary where self-care is celebrated & details matter.',
      vision: "Because self-care isn't optional. It's essential.",
      principles: [
        { title: 'First Impressions Matter', desc: 'Every guest interaction sets the tone for their entire experience.' },
        { title: 'Anticipate Needs', desc: "Great hospitality means solving problems before they're voiced." },
        { title: 'Warm & Professional', desc: 'Balance genuine warmth with polished professionalism.' },
        { title: 'Details Create Luxury', desc: 'Small touches—beverages, comfort, ambiance—elevate the experience.' },
        { title: 'Seamless Coordination', desc: 'Front desk to service provider communication must be flawless.' }
      ],
      hashtags: ['#QVDExperience','#LuxurySalon','#SalonHospitality','#ClientExperience','#SalonLife'],
      doPost: ['Beverage bar moments','Cozy salon vibes','Welcome experiences','Detail shots','Happy client arrivals'],
      dontPost: ['Messy spaces','Waiting room complaints','Scheduling chaos','Anything that looks rushed']
    }
  };

  const brandedTemplates = {
    post: [
      { id: 1, name: 'Before & After Grid', desc: 'Side-by-side transformation with QVD branding', division: 'all' },
      { id: 2, name: 'Client Testimonial Card', desc: 'Quote overlay on blurred salon background', division: 'all' },
      { id: 3, name: 'Meet the Artist', desc: 'Team member spotlight with bio', division: 'salon' },
      { id: 4, name: 'Bridal Party Grid', desc: 'Multi-photo layout for wedding parties', division: 'bridal' },
      { id: 5, name: 'Education Moment', desc: 'What I learned + technique showcase', division: 'salon' },
      { id: 6, name: 'Product Feature', desc: 'Clean product shot with benefits', division: 'salon' }
    ],
    story: [
      { id: 7, name: 'This or That Poll', desc: 'Hair preference polls with branded colors', division: 'all' },
      { id: 8, name: 'Behind the Chair', desc: 'In-progress service snapshot', division: 'salon' },
      { id: 9, name: 'Bride Prep Countdown', desc: 'Getting ready timeline story', division: 'bridal' },
      { id: 10, name: 'Quick Tip', desc: 'Single tip with QVD styling', division: 'all' },
      { id: 11, name: 'Team Shoutout', desc: 'Celebrate a team member', division: 'leadership' },
      { id: 12, name: 'Booking Reminder', desc: 'Availability alert template', division: 'all' }
    ],
    reel: [
      { id: 13, name: 'Transformation Reveal', desc: '3-5 second dramatic before/after', division: 'all' },
      { id: 14, name: 'Day in the Life', desc: 'Quick cuts of salon day', division: 'salon' },
      { id: 15, name: 'Tutorial Teaser', desc: 'Quick technique with "full video in bio"', division: 'salon' },
      { id: 16, name: 'Bridal Reveal', desc: 'Bride seeing herself moment', division: 'bridal' },
      { id: 17, name: 'Product Demo', desc: 'How-to with retail product', division: 'salon' },
      { id: 18, name: 'Trend Alert', desc: "What's trending + your take", division: 'all' }
    ]
  };

  const challengePrompts = [
    { day: 1, prompt: "Share your WHY — why did you become a stylist?", type: "Story" },
    { day: 2, prompt: "Before & After transformation post", type: "Feed" },
    { day: 3, prompt: "Share a hair tip your clients always love", type: "Reel" },
    { day: 4, prompt: "Behind the scenes of your station setup", type: "Story" },
    { day: 5, prompt: "Client testimonial or review share", type: "Feed" },
    { day: 6, prompt: "Product recommendation you swear by", type: "Reel" },
    { day: 7, prompt: "Sunday self-care routine", type: "Story" },
    { day: 8, prompt: "Your signature service explained", type: "Feed" },
    { day: 9, prompt: "Quick styling hack tutorial", type: "Reel" },
    { day: 10, prompt: "Day in the life at the salon", type: "Story" },
    { day: 11, prompt: "Transformation Tuesday post", type: "Feed" },
    { day: 12, prompt: "Answer a common client question", type: "Reel" },
    { day: 13, prompt: "Share what you're learning right now", type: "Story" },
    { day: 14, prompt: "Feature your favorite tool or product", type: "Feed" },
    { day: 15, prompt: "Hair myth busted!", type: "Reel" },
    { day: 16, prompt: "Your morning routine before clients", type: "Story" },
    { day: 17, prompt: "Color formula breakdown (no secrets!)", type: "Feed" },
    { day: 18, prompt: "Quick tip for at-home maintenance", type: "Reel" },
    { day: 19, prompt: "Shoutout to a mentor or colleague", type: "Story" },
    { day: 20, prompt: "Your most-requested service", type: "Feed" },
    { day: 21, prompt: "3 things clients should tell their stylist", type: "Reel" },
    { day: 22, prompt: "Weekend vibes — what recharges you?", type: "Story" },
    { day: 23, prompt: "Client spotlight with their permission", type: "Feed" },
    { day: 24, prompt: "Common mistakes & how to fix them", type: "Reel" },
    { day: 25, prompt: "Share a recent win or proud moment", type: "Story" },
    { day: 26, prompt: "Seasonal hair care tips", type: "Feed" },
    { day: 27, prompt: "Your consultation process explained", type: "Reel" },
    { day: 28, prompt: "Gratitude post — thank your clients", type: "Story" },
    { day: 29, prompt: "Ask your audience a question", type: "Feed" },
    { day: 30, prompt: "Celebrate! Recap your 30-day journey", type: "Reel" }
  ];

  const tabs = [
    { id: 'progress', label: '⚡ My Level' },
    { id: 'calculator', label: 'Calculator' },
    { id: 'pillars', label: 'Pillars' },
    { id: 'mygoals', label: 'My Goals' },
    { id: 'timeline', label: 'My Timeline' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'challenge', label: 'Challenges' },
    { id: 'goals', label: 'Social Goals' },
    { id: 'resources', label: 'Resources' }
  ];

  const Input = ({ label, ...props }) => (
    <div>
      {label && <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B7D6B', marginBottom: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>{label}</label>}
      <input {...props} style={{ width: '100%', padding: '12px 16px', border: '1px solid #E8E0D8', borderRadius: 8, fontSize: 14, fontFamily: "'Montserrat', sans-serif", outline: 'none', background: '#FDFCFB', transition: 'border-color 0.2s', color: '#2D2D2D', boxSizing: 'border-box', ...props.style }} onFocus={e => e.target.style.borderColor = '#D4AF37'} onBlur={e => e.target.style.borderColor = '#E8E0D8'} />
    </div>
  );

  const Select = ({ label, children, ...props }) => (
    <div>
      {label && <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B7D6B', marginBottom: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>{label}</label>}
      <select {...props} style={{ width: '100%', padding: '12px 16px', border: '1px solid #E8E0D8', borderRadius: 8, fontSize: 14, fontFamily: "'Montserrat', sans-serif", outline: 'none', background: '#FDFCFB', color: '#2D2D2D', boxSizing: 'border-box', ...props.style }}>{children}</select>
    </div>
  );

  const Btn = ({ variant = 'primary', children, ...props }) => {
    const styles = {
      primary: { background: '#2D2D2D', color: '#FAF7F2', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s', width: '100%' },
      secondary: { background: 'transparent', color: '#2D2D2D', border: '1px solid #2D2D2D', padding: '10px 20px', borderRadius: 8, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' },
      gold: { background: 'linear-gradient(135deg, #D4AF37, #C9A030)', color: '#2D2D2D', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', width: '100%' }
    };
    return <button {...props} style={{ ...styles[variant], ...props.style }}>{children}</button>;
  };

  const SectionHead = ({ eyebrow, title, accent, subtitle }) => (
    <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative' }}>
      {eyebrow && <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: 8, fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>{eyebrow}</p>}
      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: '#2D2D2D', lineHeight: 1.2, margin: 0 }}>{title} <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>{accent}</em></h2>
      {subtitle && <p style={{ fontSize: 13, color: '#8B7D6B', marginTop: 8, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', letterSpacing: '0.02em' }}>{subtitle}</p>}
      <div style={{ width: 40, height: 1, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)', margin: '16px auto 0' }} />
    </div>
  );

  const Card = ({ children, style: customStyle, ...props }) => (
    <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 24, border: '1px solid #EDE8E2', position: 'relative', overflow: 'hidden', ...customStyle }} {...props}>{children}</div>
  );

  /* ═══════════════════════════════════════════
     SPLASH SCREEN — Editorial Cover
     ═══════════════════════════════════════════ */
  if (showSplash && !showLogin && !showApp) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#FAF7F2',
        fontFamily: "'Montserrat', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 20px'
      }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '15%', width: 1, background: 'rgba(212,175,55,0.06)' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: '15%', width: 1, background: 'rgba(212,175,55,0.06)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48, color: '#D4AF37', opacity: 0.7 }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 82, fontWeight: 700, color: '#2D2D2D',
          letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, lineHeight: 0.9, textAlign: 'center'
        }}>PROOF</h1>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', margin: '-4px 0 0', position: 'relative' }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 82, fontWeight: 700, color: '#2D2D2D',
            letterSpacing: '0.12em', textTransform: 'none', margin: 0, lineHeight: 0.9, textAlign: 'center',
            display: 'flex', alignItems: 'baseline'
          }}>
            <span style={{ textTransform: 'uppercase' }}>F</span>
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span style={{ textTransform: 'none' }}>{'\u0131'}</span>
              <svg width={28} height={28} viewBox="0 0 24 24" fill="#D4AF37" stroke="none" style={{ 
                position: 'absolute', top: '-0.02em', left: '50%', transform: 'translateX(-68%)'
              }}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </span>
            <span style={{ textTransform: 'uppercase' }}>RST</span>
          </h1>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#D4AF37', marginTop: 4, marginLeft: 3, fontFamily: "'Montserrat', sans-serif" }}>™</span>
        </div>
        <div style={{ width: 60, height: 1.5, background: '#D4AF37', margin: '28px 0 24px' }} />
        <p style={{ fontSize: 13, letterSpacing: '0.6em', textTransform: 'uppercase', color: '#8B7D6B', fontWeight: 500, margin: '0 0 6px', fontFamily: "'Montserrat', sans-serif" }}>PLANNER</p>
        <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, margin: '0 0 8px', fontFamily: "'Montserrat', sans-serif" }}>Commission Stylist Edition</p>
        <p style={{ fontSize: 14, color: '#8B7D6B', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', margin: '0 0 52px', letterSpacing: '0.02em' }}>Developed for Quinn Vise Hair Design & Co.</p>
        <button onClick={() => { setShowSplash(false); setShowLogin(true); }} style={{
          background: 'transparent', color: '#2D2D2D', border: '1.5px solid #2D2D2D', padding: '16px 64px',
          borderRadius: 0, fontSize: 12, letterSpacing: '0.35em', textTransform: 'uppercase',
          fontFamily: "'Montserrat', sans-serif", fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease'
        }}
          onMouseEnter={e => { e.target.style.background = '#2D2D2D'; e.target.style.color = '#FAF7F2'; }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#2D2D2D'; }}
        >Begin</button>
        <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center' }}>
          <p style={{ fontSize: 9, color: '#C9C0B5', margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>© 2026 Proof-First™ by Quinn Vise · A Quinnessentials Brand</p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     LOGIN SCREEN — Welcome / Name Entry
     ═══════════════════════════════════════════ */
  if (showLogin && !showApp) {
    const handleLogin = () => {
      if (nameInput.trim()) {
        setUserName(nameInput.trim());
        setShowLogin(false);
        setShowApp(true);
      }
    };

    return (
      <div style={{
        minHeight: '100vh',
        background: '#FAF7F2',
        fontFamily: "'Montserrat', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 20px'
      }}>
        {/* Subtle vertical lines */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '15%', width: 1, background: 'rgba(212,175,55,0.06)' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: '15%', width: 1, background: 'rgba(212,175,55,0.06)' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{ width: 24, height: 1, background: '#D4AF37' }} />
          <span style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600 }}>Proof-First™</span>
          <div style={{ width: 24, height: 1, background: '#D4AF37' }} />
        </div>

        {/* Welcome */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 56,
          fontWeight: 300,
          color: '#2D2D2D',
          letterSpacing: '0.04em',
          margin: '0 0 12px',
          textAlign: 'center'
        }}>Welcome</h1>

        <p style={{
          fontSize: 14,
          color: '#8B7D6B',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: 'italic',
          margin: '0 0 48px',
          textAlign: 'center'
        }}>Enter your first name to begin</p>

        {/* Name Input */}
        <div style={{ width: '100%', maxWidth: 320, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Your first name"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
            style={{
              width: '100%',
              padding: '16px 20px',
              fontSize: 16,
              fontFamily: "'Montserrat', sans-serif",
              border: '1.5px solid #E8E0D8',
              borderRadius: 0,
              background: '#FFFFFF',
              color: '#2D2D2D',
              textAlign: 'center',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={e => { e.target.style.borderColor = '#D4AF37'; }}
            onBlur={e => { e.target.style.borderColor = '#E8E0D8'; }}
          />
        </div>

        {/* Enter Button */}
        <button
          onClick={handleLogin}
          disabled={!nameInput.trim()}
          style={{
            background: nameInput.trim() ? '#2D2D2D' : '#E8E0D8',
            color: nameInput.trim() ? '#FAF7F2' : '#B0A698',
            border: 'none',
            padding: '16px 48px',
            borderRadius: 0,
            fontSize: 12,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            cursor: nameInput.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            marginBottom: 24
          }}
        >Enter My Planner</button>

        {/* Privacy Note */}
        <p style={{
          fontSize: 11,
          color: '#B0A698',
          fontFamily: "'Montserrat', sans-serif",
          textAlign: 'center',
          maxWidth: 280,
          lineHeight: 1.5
        }}>Your data is saved privately to your name.</p>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center' }}>
          <p style={{ fontSize: 9, color: '#C9C0B5', margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>© 2026 Proof-First™ by Quinn Vise · A Quinnessentials Brand</p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     LOADING SCREEN
     ═══════════════════════════════════════════ */
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#FAF7F2',
        fontFamily: "'Montserrat', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <BoltIcon size={48} glow />
        <p style={{
          fontSize: 12,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#8B7D6B',
          marginTop: 24
        }}>Loading your data...</p>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     MAIN APPLICATION
     ═══════════════════════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(175deg, #FAF7F2 0%, #F5F0E8 40%, #FAF7F2 70%, #F2EDE5 100%)', fontFamily: "'Montserrat', sans-serif" }}>
      
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 20% 50%, #D4AF37 1px, transparent 1px), radial-gradient(circle at 80% 20%, #C9B8A8 1px, transparent 1px)', backgroundSize: '80px 80px, 60px 60px' }} />

      <header style={{ background: 'rgba(250, 247, 242, 0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212, 175, 55, 0.15)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '14px 20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 3 }}>
            <div style={{ width: 20, height: 1, background: '#D4AF37' }} />
            <p style={{ fontSize: 8, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, margin: 0 }}>Proof-First™</p>
            <div style={{ width: 20, height: 1, background: '#D4AF37' }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 300, color: '#2D2D2D', letterSpacing: '0.04em', margin: 0 }}>
            Welcome, <em style={{ fontStyle: 'italic', color: '#D4AF37' }}>{userName}</em>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
            <p style={{ fontSize: 8, color: '#B0A698', margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Developed for Quinn Vise Hair Design & Co.</p>
            <span style={{ color: '#D4D0C8' }}>·</span>
            <button 
              onClick={() => { setShowApp(false); setShowLogin(true); setShowSplash(false); setUserName(''); setNameInput(''); }}
              style={{ 
                background: 'none', border: 'none', padding: 0, fontSize: 8, color: '#B0A698', 
                letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
                textDecoration: 'underline', fontFamily: "'Montserrat', sans-serif"
              }}
            >Switch User</button>
          </div>
        </div>
      </header>

      <nav style={{ background: 'rgba(250, 247, 242, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(212, 175, 55, 0.08)', position: 'sticky', top: 72, zIndex: 40 }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '8px 12px', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '8px 14px', borderRadius: 20, fontSize: 11, fontFamily: "'Montserrat', sans-serif",
              fontWeight: activeTab === tab.id ? 600 : 400, letterSpacing: '0.05em', whiteSpace: 'nowrap',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
              background: activeTab === tab.id ? '#2D2D2D' : 'transparent',
              color: activeTab === tab.id ? '#FAF7F2' : '#8B7D6B',
            }}>{tab.label}</button>
          ))}
        </div>
      </nav>

      <main style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 40px' }}>

        {/* ═══════════════ MY PROGRESS / LEVEL TRACKER ═══════════════ */}
        {activeTab === 'progress' && (
          <div>
            <SectionHead eyebrow="Proof of Progress" title="My" accent="Level" subtitle="Track your numbers. See your growth. Own your proof." />

            {/* Commission Setup */}
            {!stylistCommission && (
              <Card style={{ marginBottom: 20, border: '1px solid rgba(212,175,55,0.3)' }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <BoltIcon size={24} glow />
                  <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, marginTop: 8 }}>Set Your Commission Rate</p>
                  <p style={{ fontSize: 12, color: '#8B7D6B', marginTop: 4, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}>This powers your True Hourly Rate calculation</p>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <Input label="Your Commission %" type="number" placeholder="41" value={stylistCommission} onChange={e => setStylistCommission(e.target.value)} />
                  </div>
                  <Btn variant="gold" onClick={() => {}} style={{ width: 'auto', padding: '12px 20px' }}>Set</Btn>
                </div>
              </Card>
            )}

            {/* Sub-navigation */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[{ id: 'map', label: 'Level Map' }, { id: 'enter', label: 'Log Day' }, { id: 'stats', label: 'My Stats' }].map(v => (
                <button key={v.id} onClick={() => setProgressView(v.id)} style={{
                  flex: 1, padding: '10px 8px', borderRadius: 8, fontSize: 11, fontWeight: progressView === v.id ? 700 : 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                  background: progressView === v.id ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.25))' : '#FFFFFF',
                  color: progressView === v.id ? '#2D2D2D' : '#8B7D6B',
                  borderWidth: 1, borderStyle: 'solid',
                  borderColor: progressView === v.id ? 'rgba(212,175,55,0.3)' : '#EDE8E2'
                }}>{v.label}</button>
              ))}
            </div>

            {/* ═══ LEVEL MAP VIEW ═══ */}
            {progressView === 'map' && (
              <div>
                {/* Current Level Hero */}
                <Card style={{ marginBottom: 20, background: 'linear-gradient(135deg, #2D2D2D 0%, #3D3D3D 100%)', border: 'none' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, marginBottom: 8 }}>Current Level</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                      <BoltIcon size={36} glow />
                      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 64, fontWeight: 300, color: '#FAF7F2', lineHeight: 1 }}>{stats.level}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(250,247,242,0.6)', marginTop: 8, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}>
                      {qvdLevels[stats.level - 1]?.phase || 'LEARN'} Phase · {qvdLevels[stats.level - 1]?.experience || '1 year'}
                    </p>
                    {stats.level < 10 && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 9, color: 'rgba(250,247,242,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Progress to Level {stats.level + 1}</span>
                          <span style={{ fontSize: 9, color: '#D4AF37', fontWeight: 600 }}>{stats.percentToNext}%</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(250,247,242,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${stats.percentToNext}%`, background: 'linear-gradient(90deg, #D4AF37, #E8C84A)', borderRadius: 2, transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Quick Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                  <Card style={{ padding: 16, textAlign: 'center' }}>
                    <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B7D6B', marginBottom: 4 }}>True Hourly Rate</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: '#2D2D2D', margin: 0 }}>${stats.avgHourlyRate}</p>
                  </Card>
                  <Card style={{ padding: 16, textAlign: 'center' }}>
                    <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B7D6B', marginBottom: 4 }}>Avg Daily Sales</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: '#2D2D2D', margin: 0 }}>${stats.avgDailySales}</p>
                  </Card>
                  <Card style={{ padding: 16, textAlign: 'center' }}>
                    <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B7D6B', marginBottom: 4 }}>Rebook Rate</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: '#2D2D2D', margin: 0 }}>{stats.rebookPct}%</p>
                  </Card>
                  <Card style={{ padding: 16, textAlign: 'center' }}>
                    <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B7D6B', marginBottom: 4 }}>Days Logged</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: '#2D2D2D', margin: 0 }}>{stats.totalEntries}</p>
                  </Card>
                </div>

                {/* The Level Path — Vertical Lightning Bolt Journey */}
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid #EDE8E2' }}>
                    <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, textAlign: 'center', margin: 0 }}>The Path · All 10 Levels</p>
                  </div>
                  
                  <div style={{ padding: '8px 16px 16px' }}>
                    {qvdLevels.slice().reverse().map((lvl, idx) => {
                      const isActive = lvl.level === stats.level;
                      const isPassed = lvl.level < stats.level;
                      const isFuture = lvl.level > stats.level;
                      const phaseColors = { LEARN: '#C9B8A8', EARN: '#D4AF37', LIVE: '#7B9E87' };
                      const phaseColor = phaseColors[lvl.phase] || '#8B7D6B';
                      
                      return (
                        <div key={lvl.level} style={{ display: 'flex', alignItems: 'stretch', gap: 12, minHeight: 72 }}>
                          {/* Left: Level indicator + connector line */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
                            {/* Connector line top */}
                            {idx > 0 && <div style={{ width: 2, flex: 1, background: isPassed || isActive ? '#D4AF37' : '#EDE8E2' }} />}
                            {idx === 0 && <div style={{ flex: 1 }} />}
                            
                            {/* Level node */}
                            <div style={{
                              width: isActive ? 36 : 28, height: isActive ? 36 : 28,
                              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: isActive ? 'linear-gradient(135deg, #D4AF37, #E8C84A)' : isPassed ? '#2D2D2D' : '#F5F0E8',
                              border: isActive ? '2px solid #D4AF37' : isPassed ? '2px solid #2D2D2D' : '2px solid #E8E0D8',
                              transition: 'all 0.3s', flexShrink: 0,
                              boxShadow: isActive ? '0 0 16px rgba(212,175,55,0.4)' : 'none'
                            }}>
                              {isActive ? (
                                <BoltIcon size={16} fill="#2D2D2D" />
                              ) : isPassed ? (
                                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                              ) : (
                                <span style={{ fontSize: 10, fontWeight: 600, color: '#C9C0B5' }}>{lvl.level}</span>
                              )}
                            </div>
                            
                            {/* Connector line bottom */}
                            {idx < 9 && <div style={{ width: 2, flex: 1, background: isPassed ? '#D4AF37' : '#EDE8E2' }} />}
                            {idx === 9 && <div style={{ flex: 1 }} />}
                          </div>

                          {/* Right: Level details */}
                          <div style={{
                            flex: 1, padding: '8px 12px', borderRadius: 8, display: 'flex', alignItems: 'center',
                            background: isActive ? 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.15))' : 'transparent',
                            border: isActive ? '1px solid rgba(212,175,55,0.2)' : '1px solid transparent',
                            opacity: isFuture ? 0.5 : 1, transition: 'all 0.3s'
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#D4AF37' : '#2D2D2D', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Level {lvl.level}</span>
                                {lvl.phase && (
                                  <span style={{ fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: phaseColor, fontWeight: 700, background: `${phaseColor}15`, padding: '2px 6px', borderRadius: 4 }}>{lvl.phase}</span>
                                )}
                              </div>
                              <p style={{ fontSize: 10, color: '#8B7D6B', margin: 0 }}>
                                ${lvl.dailySales}/day · {lvl.commission}% · {lvl.rebook}% rebook
                              </p>
                              <p style={{ fontSize: 9, color: '#B0A698', margin: '2px 0 0' }}>
                                ${(lvl.annualPotential || 0).toLocaleString()}/yr potential
                              </p>
                            </div>
                            {/* Service pricing quick view */}
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ fontSize: 9, color: '#B0A698', margin: 0 }}>Cut ${lvl.cutPrice}</p>
                              <p style={{ fontSize: 9, color: '#B0A698', margin: '1px 0 0' }}>Foil ${lvl.foilPrice}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Lifestyle Milestone for Current Level */}
                {qvdLevels[stats.level - 1]?.wealth && (
                  <Card style={{ marginTop: 16, background: 'linear-gradient(135deg, rgba(123,158,135,0.08), rgba(123,158,135,0.15))', border: '1px solid rgba(123,158,135,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(123,158,135,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#7B9E87" strokeWidth="1.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"/></svg>
                      </div>
                      <div>
                        <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7B9E87', fontWeight: 600, marginBottom: 2 }}>Level {stats.level} Wealth Goal</p>
                        <p style={{ fontSize: 14, color: '#2D2D2D', margin: 0, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}>{qvdLevels[stats.level - 1].wealth}</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Log button */}
                <div style={{ marginTop: 20 }}>
                  <Btn variant="gold" onClick={() => setProgressView('enter')}>⚡ Log Today's Numbers</Btn>
                </div>
              </div>
            )}

            {/* ═══ LOG DAY VIEW ═══ */}
            {progressView === 'enter' && (
              <div>
                <Card>
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <BoltIcon size={24} glow />
                    <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, marginTop: 8 }}>Log Your Day</p>
                    <p style={{ fontSize: 12, color: '#8B7D6B', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}>The work is the proof. Track it.</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <Input label="Date" type="date" value={dailyEntry.date} onChange={e => setDailyEntry({...dailyEntry, date: e.target.value})} />
                    
                    <div style={{ borderTop: '1px solid #EDE8E2', paddingTop: 14 }}>
                      <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9B8A8', fontWeight: 600, marginBottom: 10 }}>Revenue</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <Input label="Service Total ($)" type="number" placeholder="0" value={dailyEntry.serviceTotal} onChange={e => setDailyEntry({...dailyEntry, serviceTotal: e.target.value})} />
                        <Input label="Tips ($)" type="number" placeholder="0" value={dailyEntry.tips} onChange={e => setDailyEntry({...dailyEntry, tips: e.target.value})} />
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <Input label="Retail Sales ($)" type="number" placeholder="0" value={dailyEntry.retailSales} onChange={e => setDailyEntry({...dailyEntry, retailSales: e.target.value})} />
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #EDE8E2', paddingTop: 14 }}>
                      <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, marginBottom: 10 }}>Hours</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <Input label="Service Hours" type="number" placeholder="0" step="0.5" value={dailyEntry.serviceHours} onChange={e => setDailyEntry({...dailyEntry, serviceHours: e.target.value})} />
                        <Input label="Content Hours" type="number" placeholder="0" step="0.5" value={dailyEntry.contentHours} onChange={e => setDailyEntry({...dailyEntry, contentHours: e.target.value})} />
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #EDE8E2', paddingTop: 14 }}>
                      <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4A5A5', fontWeight: 600, marginBottom: 10 }}>Clients</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                        <Input label="Clients Seen" type="number" placeholder="0" value={dailyEntry.clientsSeen} onChange={e => setDailyEntry({...dailyEntry, clientsSeen: e.target.value})} />
                        <Input label="Rebooks" type="number" placeholder="0" value={dailyEntry.rebooks} onChange={e => setDailyEntry({...dailyEntry, rebooks: e.target.value})} />
                        <Input label="Retail Units" type="number" placeholder="0" step="0.1" value={dailyEntry.retailUnits} onChange={e => setDailyEntry({...dailyEntry, retailUnits: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* Live Preview of Today's Hourly Rate */}
                  {dailyEntry.serviceTotal && (
                    <div style={{ marginTop: 20, padding: 16, background: '#F5F0E8', borderRadius: 8 }}>
                      <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B7D6B', marginBottom: 8, textAlign: 'center' }}>Today's Proof-First Hourly Rate</p>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 300, color: '#2D2D2D', margin: 0, textAlign: 'center' }}>
                        ${(() => {
                          const svc = parseFloat(dailyEntry.serviceTotal) || 0;
                          const tips = parseFloat(dailyEntry.tips) || 0;
                          const sHrs = parseFloat(dailyEntry.serviceHours) || 0;
                          const cHrs = parseFloat(dailyEntry.contentHours) || 0;
                          const comm = (parseFloat(stylistCommission) || 41) / 100;
                          const totalHrs = sHrs + cHrs;
                          if (totalHrs === 0) return '0.00';
                          return (((svc * comm) + tips) / totalHrs).toFixed(2);
                        })()}
                      </p>
                      <p style={{ fontSize: 10, color: '#B0A698', textAlign: 'center', marginTop: 4, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}>
                        (${dailyEntry.serviceTotal} × {stylistCommission || 41}% + ${dailyEntry.tips || 0} tips) ÷ {((parseFloat(dailyEntry.serviceHours) || 0) + (parseFloat(dailyEntry.contentHours) || 0)).toFixed(1)} hrs
                      </p>
                    </div>
                  )}

                  <div style={{ marginTop: 20 }}>
                    <Btn variant="gold" onClick={addDailyEntry}>⚡ Save & See My Level</Btn>
                  </div>
                </Card>
              </div>
            )}

            {/* ═══ STATS VIEW ═══ */}
            {progressView === 'stats' && (
              <div>
                {/* Earning Projection */}
                <Card style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, textAlign: 'center', marginBottom: 16 }}>Earning Projection</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <div style={{ textAlign: 'center', padding: 12, background: '#F5F0E8', borderRadius: 8 }}>
                      <p style={{ fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B7D6B', marginBottom: 4 }}>Monthly Est.</p>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 600, color: '#2D2D2D', margin: 0 }}>${Number(stats.monthlySalesEst || 0).toLocaleString()}</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: 12, background: '#F5F0E8', borderRadius: 8 }}>
                      <p style={{ fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B7D6B', marginBottom: 4 }}>Annual Est.</p>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 600, color: '#2D2D2D', margin: 0 }}>${Number(stats.annualSalesEst || 0).toLocaleString()}</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: 12, background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.15))', borderRadius: 8, border: '1px solid rgba(212,175,55,0.2)' }}>
                      <p style={{ fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: 4 }}>Potential</p>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 600, color: '#2D2D2D', margin: 0 }}>${(qvdLevels[stats.level - 1]?.annualPotential || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </Card>

                {/* Level Targets vs Actuals */}
                <Card style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D6B', fontWeight: 600, textAlign: 'center', marginBottom: 16 }}>Level {stats.level} Targets vs Your Averages</p>
                  {[
                    { label: 'Daily Service Sales', target: `$${qvdLevels[stats.level - 1]?.dailySales}`, actual: `$${stats.avgDailySales}`, pct: ((stats.avgDailySales / (qvdLevels[stats.level - 1]?.dailySales || 1)) * 100) },
                    { label: 'Rebook Rate', target: `${qvdLevels[stats.level - 1]?.rebook}%`, actual: `${stats.rebookPct}%`, pct: ((stats.rebookPct / (qvdLevels[stats.level - 1]?.rebook || 1)) * 100) },
                    { label: 'Retail Units/Guest', target: `${qvdLevels[stats.level - 1]?.retailUnits}`, actual: `${stats.avgRetailUnits}`, pct: ((stats.avgRetailUnits / (qvdLevels[stats.level - 1]?.retailUnits || 1)) * 100) },
                  ].map((metric, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: '#2D2D2D', fontWeight: 500 }}>{metric.label}</span>
                        <span style={{ fontSize: 11, color: metric.pct >= 100 ? '#7B9E87' : '#D4A5A5', fontWeight: 600 }}>{metric.actual} / {metric.target}</span>
                      </div>
                      <div style={{ height: 6, background: '#F5F0E8', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(100, metric.pct)}%`, background: metric.pct >= 100 ? 'linear-gradient(90deg, #7B9E87, #8DB99A)' : metric.pct >= 70 ? 'linear-gradient(90deg, #D4AF37, #E8C84A)' : 'linear-gradient(90deg, #D4A5A5, #E0BFBF)', borderRadius: 3, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  ))}
                </Card>

                {/* Service Pricing at Current Level */}
                <Card style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, textAlign: 'center', marginBottom: 16 }}>Level {stats.level} Service Menu</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { service: 'Cut & Style', price: qvdLevels[stats.level - 1]?.cutPrice },
                      { service: 'Barber Cut', price: qvdLevels[stats.level - 1]?.barberPrice },
                      { service: 'Single Process', price: qvdLevels[stats.level - 1]?.singleProcess },
                      { service: 'Foil/Balayage', price: qvdLevels[stats.level - 1]?.foilPrice },
                    ].map((svc, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: i % 2 === 0 ? '#F5F0E8' : '#FDFCFB', borderRadius: 6 }}>
                        <span style={{ fontSize: 11, color: '#8B7D6B' }}>{svc.service}</span>
                        <span style={{ fontSize: 13, color: '#2D2D2D', fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>${svc.price}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recent Entries */}
                {entries.length > 0 && (
                  <Card>
                    <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7D6B', fontWeight: 600, textAlign: 'center', marginBottom: 12 }}>Recent Entries</p>
                    {entries.slice(-5).reverse().map((entry, i) => (
                      <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < Math.min(entries.length, 5) - 1 ? '1px solid #F5F0E8' : 'none' }}>
                        <div>
                          <p style={{ fontSize: 12, color: '#2D2D2D', margin: 0, fontWeight: 500 }}>{entry.date}</p>
                          <p style={{ fontSize: 10, color: '#8B7D6B', margin: '2px 0 0' }}>{entry.clientsSeen || 0} clients · {entry.rebooks || 0} rebooks</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: 14, color: '#2D2D2D', margin: 0, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>${entry.serviceTotal}</p>
                          <p style={{ fontSize: 9, color: '#D4AF37', margin: '2px 0 0' }}>+${entry.tips || 0} tips</p>
                        </div>
                      </div>
                    ))}
                  </Card>
                )}

                {entries.length === 0 && (
                  <Card style={{ textAlign: 'center', padding: 40 }}>
                    <BoltIcon size={32} fill="#EDE8E2" />
                    <p style={{ fontSize: 14, color: '#8B7D6B', marginTop: 12, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}>No entries yet. Log your first day to see your stats come alive.</p>
                    <Btn variant="secondary" onClick={() => setProgressView('enter')} style={{ marginTop: 16, width: 'auto', display: 'inline-block' }}>Log Your First Day</Btn>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ CALCULATOR ═══════════════ */}
        {activeTab === 'calculator' && (
          <div>
            <SectionHead eyebrow="Proof of Profit" title="Hourly Rate" accent="Calculator" subtitle="Know your numbers. Know your worth." />
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Input label="Service Price ($)" type="number" value={calculatorData.servicePrice} onChange={e => setCalculatorData({...calculatorData, servicePrice: e.target.value})} placeholder="150" />
                <Input label="Service Time (minutes)" type="number" value={calculatorData.timeMinutes} onChange={e => setCalculatorData({...calculatorData, timeMinutes: e.target.value})} placeholder="90" />
                <Input label="Your Commission Rate (%)" type="number" value={calculatorData.commissionRate} onChange={e => setCalculatorData({...calculatorData, commissionRate: e.target.value})} placeholder="45" />
              </div>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #EDE8E2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#F5F0E8', borderRadius: 10, padding: 20, textAlign: 'center' }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B7D6B', marginBottom: 6 }}>Gross Hourly</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 300, color: '#2D2D2D', margin: 0 }}>${rates.gross}</p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.15))', borderRadius: 10, padding: 20, textAlign: 'center', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: 6, fontWeight: 600 }}>Your Hourly</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 300, color: '#2D2D2D', margin: 0 }}>${rates.net}</p>
                </div>
              </div>
            </Card>
            <div style={{ marginTop: 16, padding: '16px 20px', background: 'rgba(255,255,255,0.5)', borderRadius: 8, border: '1px solid rgba(212,175,55,0.1)', textAlign: 'center' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontStyle: 'italic', color: '#8B7D6B', margin: 0 }}>"Know your value. Reach your potential. Elevate the team."</p>
            </div>
          </div>
        )}

        {/* ═══════════════ PILLARS ═══════════════ */}
        {activeTab === 'pillars' && (
          <div>
            <SectionHead eyebrow="The Framework" title="The Four" accent="Pillars" subtitle="Commission Stylist Edition" />
            {Object.entries(pillarConfig).map(([key, config]) => (
              <Card key={key} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${config.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: config.color }}><PillarIcon type={key} /></div>
                  <div>
                    <span style={{ fontSize: 10, color: config.color, fontWeight: 600, letterSpacing: '0.1em' }}>{config.num}</span>
                    <h3 style={{ fontSize: 16, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, color: '#2D2D2D', margin: 0 }}>Proof of <em style={{ color: config.color, fontStyle: 'italic' }}>{config.label}</em></h3>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Object.entries(pillars[key]).map(([field, value]) => (
                    <Input key={field} label={field.replace(/([A-Z])/g, ' $1').trim()} value={value} onChange={e => setPillars({...pillars, [key]: {...pillars[key], [field]: e.target.value}})} placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}...`} />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ═══════════════ MY GOALS ═══════════════ */}
        {activeTab === 'mygoals' && (
          <div>
            <SectionHead eyebrow="Proof of Purpose" title="My" accent="Goals" subtitle="Set it. Track it. Prove it." />
            <Card style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Input label="Goal Title" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} placeholder="What are you working toward?" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Select label="Pillar" value={newGoal.pillar} onChange={e => setNewGoal({...newGoal, pillar: e.target.value})}>
                    {Object.entries(pillarConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </Select>
                  <Input label="Target" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} placeholder="e.g. $5,000" />
                </div>
                <Input label="Deadline" type="date" value={newGoal.deadline} onChange={e => setNewGoal({...newGoal, deadline: e.target.value})} />
                <Btn onClick={addMyGoal}>Add Goal</Btn>
              </div>
            </Card>
            {myGoals.filter(g => !g.completed).map(goal => (
              <Card key={goal.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: `${pillarConfig[goal.pillar]?.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: pillarConfig[goal.pillar]?.color }}><PillarIcon type={goal.pillar} size={14} /></div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 14, color: '#2D2D2D', margin: 0 }}>{goal.title}</h4>
                    <p style={{ fontSize: 11, color: '#8B7D6B', margin: '2px 0 0' }}>{goal.target} · {goal.deadline || 'No deadline'}</p>
                  </div>
                  <button onClick={() => setMyGoals(myGoals.map(g => g.id === goal.id ? {...g, completed: true} : g))} style={{ width: 28, height: 28, borderRadius: 6, border: '2px solid #D4AF37', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ═══════════════ TIMELINE ═══════════════ */}
        {activeTab === 'timeline' && (
          <div>
            <SectionHead eyebrow="Proof of Process" title="My" accent="Timeline" subtitle="Milestones that map your journey." />
            <Card style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Input label="Milestone" value={newMilestone.title} onChange={e => setNewMilestone({...newMilestone, title: e.target.value})} placeholder="What milestone are you planning?" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <Select label="Quarter" value={newMilestone.quarter} onChange={e => setNewMilestone({...newMilestone, quarter: e.target.value})}>
                    <option value="Q1">Q1</option><option value="Q2">Q2</option><option value="Q3">Q3</option><option value="Q4">Q4</option>
                  </Select>
                  <Select label="Year" value={newMilestone.year} onChange={e => setNewMilestone({...newMilestone, year: e.target.value})}>
                    <option value="2026">2026</option><option value="2027">2027</option>
                  </Select>
                  <Select label="Status" value={newMilestone.status} onChange={e => setNewMilestone({...newMilestone, status: e.target.value})}>
                    <option value="planned">Planned</option><option value="in-progress">In Progress</option><option value="complete">Complete</option>
                  </Select>
                </div>
                <Btn onClick={addMilestone}>Add Milestone</Btn>
              </div>
            </Card>
            {['Q1','Q2','Q3','Q4'].map(q => {
              const qMilestones = milestones.filter(m => m.quarter === q);
              if (qMilestones.length === 0) return null;
              return (
                <div key={q} style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, marginBottom: 8 }}>{q} · {newMilestone.year}</p>
                  {qMilestones.map(m => (
                    <Card key={m.id} style={{ marginBottom: 8, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.status === 'complete' ? '#7B9E87' : m.status === 'in-progress' ? '#D4AF37' : '#E8E0D8' }} />
                        <span style={{ fontSize: 13, color: '#2D2D2D', flex: 1 }}>{m.title}</span>
                        <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: m.status === 'complete' ? '#7B9E87' : m.status === 'in-progress' ? '#D4AF37' : '#8B7D6B', fontWeight: 600 }}>{m.status}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════ CALENDAR ═══════════════ */}
        {activeTab === 'calendar' && (
          <div>
            <SectionHead eyebrow="Content Strategy" title="Content" accent="Calendar" subtitle="Plan your proof. Schedule your impact." />
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else setCurrentMonth(currentMonth - 1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#8B7D6B' }}>←</button>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 400, color: '#2D2D2D', margin: 0 }}>{months[currentMonth]} {currentYear}</h3>
                <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else setCurrentMonth(currentMonth + 1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#8B7D6B' }}>→</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 16 }}>
                {dayNames.map((d, i) => <div key={i} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#B0A698', padding: 4 }}>{d}</div>)}
                {Array.from({ length: getFirstDayOfMonth(currentYear, currentMonth) }, (_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: getDaysInMonth(currentYear, currentMonth) }, (_, i) => {
                  const day = i + 1;
                  const dateKey = `${currentYear}-${currentMonth}-${day}`;
                  const hasEvent = calendarEvents[dateKey]?.length > 0;
                  const isSelected = selectedDate === day;
                  return (
                    <button key={day} onClick={() => setSelectedDate(day === selectedDate ? null : day)} style={{
                      padding: 8, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                      background: isSelected ? '#2D2D2D' : hasEvent ? 'rgba(212,175,55,0.1)' : 'transparent',
                      color: isSelected ? '#FAF7F2' : '#2D2D2D', fontWeight: isSelected ? 600 : 400,
                      position: 'relative', fontFamily: "'Montserrat', sans-serif"
                    }}>
                      {day}
                      {hasEvent && <div style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#D4AF37' }} />}
                    </button>
                  );
                })}
              </div>
              {selectedDate && (
                <div style={{ borderTop: '1px solid #EDE8E2', paddingTop: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#2D2D2D', marginBottom: 12 }}>{months[currentMonth]} {selectedDate}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <Select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}>
                        <option value="post">Post</option><option value="story">Story</option><option value="reel">Reel</option><option value="education">Education</option>
                      </Select>
                      <Select value={newEvent.pillar} onChange={e => setNewEvent({...newEvent, pillar: e.target.value})}>
                        {Object.entries(pillarConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </Select>
                    </div>
                    <Input placeholder="What's the content?" value={newEvent.content} onChange={e => setNewEvent({...newEvent, content: e.target.value})} />
                    <Btn onClick={addEvent}>Add to Calendar</Btn>
                  </div>
                  {(calendarEvents[`${currentYear}-${currentMonth}-${selectedDate}`] || []).map(event => (
                    <div key={event.id} style={{ padding: 10, background: '#F5F0E8', borderRadius: 8, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: `${pillarConfig[event.pillar]?.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: pillarConfig[event.pillar]?.color }}><PillarIcon type={event.pillar} size={12} /></div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 12, color: '#2D2D2D', margin: 0 }}>{event.content}</p>
                        <p style={{ fontSize: 10, color: '#8B7D6B', margin: '2px 0 0', textTransform: 'capitalize' }}>{event.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ═══════════════ CHALLENGES ═══════════════ */}
        {activeTab === 'challenge' && (
          <div>
            <SectionHead eyebrow="Proof of Progress" title="Content" accent="Challenges" subtitle="30 days of building your brand." />
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[{ id: '30day', label: '30-Day Challenge' }, { id: 'custom', label: 'My Challenges' }].map(t => (
                <button key={t.id} onClick={() => setChallengeTab(t.id)} style={{
                  flex: 1, padding: '10px 8px', borderRadius: 8, fontSize: 11, fontWeight: challengeTab === t.id ? 700 : 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                  background: challengeTab === t.id ? '#2D2D2D' : '#FFFFFF', color: challengeTab === t.id ? '#FAF7F2' : '#8B7D6B'
                }}>{t.label}</button>
              ))}
            </div>
            {challengeTab === '30day' && (
              <div>
                <Card style={{ marginBottom: 16 }}>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: '#2D2D2D', margin: 0 }}>Day {challengeDay} of 30</p>
                    <div style={{ width: '100%', height: 4, background: '#F5F0E8', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(completedDays.length / 30) * 100}%`, background: 'linear-gradient(90deg, #D4AF37, #E8C84A)', borderRadius: 2 }} />
                    </div>
                    <p style={{ fontSize: 11, color: '#8B7D6B', marginTop: 4 }}>{completedDays.length} / 30 completed</p>
                  </div>
                </Card>
                {challengePrompts.map(prompt => (
                  <Card key={prompt.day} style={{ marginBottom: 8, padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button onClick={() => toggleChallengeDay(prompt.day)} style={{
                        width: 28, height: 28, borderRadius: 6, border: `2px solid ${completedDays.includes(prompt.day) ? '#7B9E87' : '#E8E0D8'}`,
                        background: completedDays.includes(prompt.day) ? '#7B9E87' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {completedDays.includes(prompt.day) && <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                      </button>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 12, color: completedDays.includes(prompt.day) ? '#B0A698' : '#2D2D2D', margin: 0, textDecoration: completedDays.includes(prompt.day) ? 'line-through' : 'none' }}>Day {prompt.day}: {prompt.prompt}</p>
                        <span style={{ fontSize: 10, color: '#D4AF37', fontWeight: 500 }}>{prompt.type}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {challengeTab === 'custom' && (
              <div>
                <Card style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Input label="Challenge Name" value={newChallenge.title} onChange={e => setNewChallenge({...newChallenge, title: e.target.value})} placeholder="Name your challenge" />
                    <Select label="Duration (days)" value={newChallenge.duration} onChange={e => setNewChallenge({...newChallenge, duration: e.target.value})}>
                      <option value="7">7 Days</option><option value="14">14 Days</option><option value="21">21 Days</option><option value="30">30 Days</option>
                    </Select>
                    <Btn onClick={addMyChallenge}>Create Challenge</Btn>
                  </div>
                </Card>
                {myChallenges.map(challenge => (
                  <Card key={challenge.id} style={{ marginBottom: 12 }}>
                    <h4 style={{ fontSize: 14, color: '#2D2D2D', margin: '0 0 8px' }}>{challenge.title}</h4>
                    <p style={{ fontSize: 11, color: '#8B7D6B', marginBottom: 8 }}>{challenge.days.filter(d => d.completed).length} / {challenge.days.length} days</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {challenge.days.map(day => (
                        <button key={day.day} onClick={() => {
                          setMyChallenges(myChallenges.map(c => c.id === challenge.id ? { ...c, days: c.days.map(d => d.day === day.day ? { ...d, completed: !d.completed } : d) } : c));
                        }} style={{
                          width: 28, height: 28, borderRadius: 6, fontSize: 10, fontWeight: 600,
                          border: `1px solid ${day.completed ? '#7B9E87' : '#E8E0D8'}`, cursor: 'pointer',
                          background: day.completed ? '#7B9E87' : 'transparent', color: day.completed ? '#FFF' : '#8B7D6B'
                        }}>{day.day}</button>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ SOCIAL GOALS ═══════════════ */}
        {activeTab === 'goals' && (
          <div>
            <SectionHead eyebrow="Proof of Progress" title="Social" accent="Goals" subtitle="Numbers don't lie. Track your reach." />
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {Object.entries(goals).map(([key, val]) => (
                  <div key={key}>
                    <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B7D6B', marginBottom: 8, fontWeight: 500 }}>{key}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <Input placeholder="Current" type="number" value={val.current} onChange={e => setGoals({...goals, [key]: {...val, current: e.target.value}})} />
                      <Input placeholder="Goal" type="number" value={val.goal} onChange={e => setGoals({...goals, [key]: {...val, goal: e.target.value}})} />
                    </div>
                    {val.current && val.goal && (
                      <div style={{ marginTop: 6 }}>
                        <div style={{ height: 4, background: '#F5F0E8', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(100, (parseFloat(val.current) / parseFloat(val.goal)) * 100)}%`, background: 'linear-gradient(90deg, #D4AF37, #E8C84A)', borderRadius: 2 }} />
                        </div>
                        <p style={{ fontSize: 10, color: '#8B7D6B', marginTop: 3, textAlign: 'right' }}>{((parseFloat(val.current) / parseFloat(val.goal)) * 100).toFixed(0)}%</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ═══════════════ RESOURCES ═══════════════ */}
        {activeTab === 'resources' && (
          <div>
            <SectionHead eyebrow="Brand Guidelines" title="QVD" accent="Resources" subtitle="Everything you need, on brand." />
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto' }}>
              {Object.entries(divisionContent).map(([key, div]) => (
                <button key={key} onClick={() => setSelectedDivision(key)} style={{
                  padding: '8px 16px', borderRadius: 20, fontSize: 11, whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
                  background: selectedDivision === key ? div.color : '#F5F0E8',
                  color: selectedDivision === key ? '#FAF7F2' : '#8B7D6B',
                  fontWeight: selectedDivision === key ? 600 : 400, fontFamily: "'Montserrat', sans-serif"
                }}>{div.name}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              {[{ id: 'templates', label: 'Templates' }, { id: 'brand', label: 'Brand' }, { id: 'mytemplates', label: 'My Templates' }].map(t => (
                <button key={t.id} onClick={() => setResourceTab(t.id)} style={{
                  flex: 1, padding: '10px 8px', borderRadius: 8, fontSize: 11, fontWeight: resourceTab === t.id ? 700 : 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                  background: resourceTab === t.id ? '#2D2D2D' : '#FFFFFF', color: resourceTab === t.id ? '#FAF7F2' : '#8B7D6B'
                }}>{t.label}</button>
              ))}
            </div>
            {resourceTab === 'templates' && (
              <div>
                {['post', 'story', 'reel'].map(type => (
                  <div key={type} style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, marginBottom: 8 }}>{type}s</p>
                    {brandedTemplates[type].filter(t => t.division === 'all' || t.division === selectedDivision).map(template => (
                      <Card key={template.id} style={{ marginBottom: 8, padding: 14 }}>
                        <h4 style={{ fontSize: 13, color: '#2D2D2D', margin: '0 0 4px', fontWeight: 600 }}>{template.name}</h4>
                        <p style={{ fontSize: 11, color: '#8B7D6B', margin: 0 }}>{template.desc}</p>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {resourceTab === 'brand' && (
              <div>
                <Card style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: divisionContent[selectedDivision].color, marginBottom: 8 }}>{divisionContent[selectedDivision].name}</h4>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontStyle: 'italic', color: '#8B7D6B', marginBottom: 16, lineHeight: 1.5 }}>"{divisionContent[selectedDivision].tagline}"</p>
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, marginBottom: 6 }}>Mission</p>
                    <p style={{ fontSize: 13, color: '#2D2D2D', lineHeight: 1.6 }}>{divisionContent[selectedDivision].mission}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, marginBottom: 6 }}>Vision</p>
                    <p style={{ fontSize: 13, color: '#2D2D2D', lineHeight: 1.6 }}>{divisionContent[selectedDivision].vision}</p>
                  </div>
                </Card>
                <Card style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5C4033', marginBottom: 14 }}>Core Principles</h4>
                  {divisionContent[selectedDivision].principles.map((p, i) => (
                    <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < 4 ? '1px solid #F5F0E8' : 'none' }}>
                      <h5 style={{ fontSize: 13, color: '#2D2D2D', margin: '0 0 4px', fontWeight: 600 }}>{p.title}</h5>
                      <p style={{ fontSize: 12, color: '#8B7D6B', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
                    </div>
                  ))}
                </Card>
                <Card style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7B9E87', marginBottom: 14 }}>Do Post</h4>
                  {divisionContent[selectedDivision].doPost.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#7B9E87" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                      <span style={{ fontSize: 12, color: '#2D2D2D' }}>{item}</span>
                    </div>
                  ))}
                  <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4A5A5', marginTop: 20, marginBottom: 14 }}>Don't Post</h4>
                  {divisionContent[selectedDivision].dontPost.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#D4A5A5" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      <span style={{ fontSize: 12, color: '#2D2D2D' }}>{item}</span>
                    </div>
                  ))}
                </Card>
                <Card>
                  <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5C4033', marginBottom: 14 }}>Approved Hashtags</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {divisionContent[selectedDivision].hashtags.map((tag, i) => (
                      <span key={i} style={{ padding: '6px 12px', background: '#F5F0E8', borderRadius: 16, fontSize: 12, color: divisionContent[selectedDivision].color, fontWeight: 500 }}>{tag}</span>
                    ))}
                  </div>
                </Card>
              </div>
            )}
            {resourceTab === 'mytemplates' && (
              <div>
                <Card style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Input label="Template Name" value={newTemplate.name} onChange={e => setNewTemplate({...newTemplate, name: e.target.value})} placeholder="My custom template" />
                    <Select label="Category" value={newTemplate.category} onChange={e => setNewTemplate({...newTemplate, category: e.target.value})}>
                      <option value="post">Post</option><option value="story">Story</option><option value="reel">Reel</option><option value="other">Other</option>
                    </Select>
                    <Input label="Notes" value={newTemplate.notes} onChange={e => setNewTemplate({...newTemplate, notes: e.target.value})} placeholder="Description or notes..." />
                    <Btn onClick={addUserTemplate}>Save Template</Btn>
                  </div>
                </Card>
                {userTemplates.filter(t => t.division === selectedDivision).map(template => (
                  <Card key={template.id} style={{ marginBottom: 8, padding: 14 }}>
                    <h4 style={{ fontSize: 13, color: '#2D2D2D', margin: '0 0 4px', fontWeight: 600 }}>{template.name}</h4>
                    <p style={{ fontSize: 11, color: '#8B7D6B', margin: 0 }}>{template.notes || template.category}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      <footer style={{ textAlign: 'center', padding: '24px 20px 32px', borderTop: '1px solid rgba(212,175,55,0.1)', background: 'rgba(250,247,242,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 16, height: 1, background: '#D4AF37' }} />
          <span style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600 }}>Proof-First™</span>
          <div style={{ width: 16, height: 1, background: '#D4AF37' }} />
        </div>
        <p style={{ fontSize: 11, color: '#B0A698', margin: '0 0 2px' }}>Commission Stylist Edition · Developed for QVD</p>
        <p style={{ fontSize: 10, color: '#C9C0B5', margin: 0 }}>© 2026 Proof-First™ by Quinn Vise · A Quinnessentials Brand</p>
      </footer>
    </div>
  );
};

export default ProofFirstPlanner;
