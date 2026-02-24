const APP_DATA = {

  user: {
    id: "EP-2F9A-4C71-8B3E",
    name: "Guest User",
    authenticated: false,
    qrSeed: 0xABCDEF12
  },

  signedInUser: {
    id: "EP-2F9A-4C71-8B3E",
    name: "Kirill S.",
    email: "kirill@example.com",
    authenticated: true,
    qrSeed: 0xABCDEF12
  },

  guestUser: {
    id: "EP-2F9A-4C71-8B3E",
    name: "Guest User",
    authenticated: false,
    qrSeed: 0xABCDEF12
  },

  cards: [
    // ── Punch cards (8) ──
    {
      id: "punch-1",
      type: "punch",
      shopName: "Brew & Co",
      address: "42 Bean Street, Downtown",
      program: "Buy 10 coffees, get 1 free",
      reward: "1 free coffee of your choice",
      current: 7,
      total: 10,
      accent: "#6B4C3B",
      emoji: "☕"
    },
    {
      id: "punch-2",
      type: "punch",
      shopName: "Sweet Crumbs",
      address: "15 Pastry Lane, West Side",
      program: "8 stamps for a free pastry",
      reward: "1 free pastry up to $6",
      current: 3,
      total: 8,
      accent: "#C2703E",
      emoji: "🥐"
    },
    {
      id: "punch-3",
      type: "punch",
      shopName: "Green Squeeze",
      address: "88 Juice Ave, East Park",
      program: "6 smoothies, get 1 free",
      reward: "1 free smoothie, any size",
      current: 6,
      total: 6,
      accent: "#4A7C59",
      emoji: "🥤"
    },
    {
      id: "punch-4",
      type: "punch",
      shopName: "Daily Grind",
      address: "5 Espresso Blvd, Midtown",
      program: "12 espressos, get 1 free",
      reward: "1 free double espresso",
      current: 2,
      total: 12,
      accent: "#8B6F47",
      emoji: "☕"
    },
    {
      id: "punch-5",
      type: "punch",
      shopName: "Pasta Palace",
      address: "22 Noodle Street, Old Town",
      program: "10 meals for a free pasta",
      reward: "1 free pasta dish",
      current: 9,
      total: 10,
      accent: "#C4463A",
      emoji: "🍝"
    },
    {
      id: "punch-6",
      type: "punch",
      shopName: "Sushi Roll",
      address: "77 Fish Market, Harbor",
      program: "6 sets for a free roll",
      reward: "1 free sushi roll",
      current: 1,
      total: 6,
      accent: "#2D6A7A",
      emoji: "🍣"
    },
    {
      id: "punch-7",
      type: "punch",
      shopName: "The Book Nook",
      address: "3 Library Row, University",
      program: "5 coffees for a free book",
      reward: "1 book up to $15",
      current: 5,
      total: 5,
      accent: "#7B5EA7",
      emoji: "📚"
    },
    {
      id: "punch-8",
      type: "punch",
      shopName: "Flower Power",
      address: "91 Garden Blvd, Riverside",
      program: "8 bouquets, get 1 free",
      reward: "1 free seasonal bouquet",
      current: 0,
      total: 8,
      accent: "#D4768C",
      emoji: "🌸"
    },

    // ── Bundles (4) ──
    {
      id: "bundle-1",
      type: "bundle",
      shopName: "Brew & Co",
      address: "42 Bean Street, Downtown",
      program: "5-Pack Espresso",
      remaining: 3,
      total: 5,
      accent: "#6B4C3B",
      emoji: "☕"
    },
    {
      id: "bundle-2",
      type: "bundle",
      shopName: "Green Squeeze",
      address: "88 Juice Ave, East Park",
      program: "10-Pack Fresh Juice",
      remaining: 7,
      total: 10,
      accent: "#4A7C59",
      emoji: "🥤"
    },
    {
      id: "bundle-3",
      type: "bundle",
      shopName: "Daily Grind",
      address: "5 Espresso Blvd, Midtown",
      program: "Morning Bundle (3 drinks)",
      remaining: 1,
      total: 3,
      accent: "#8B6F47",
      emoji: "☕"
    },
    {
      id: "bundle-4",
      type: "bundle",
      shopName: "Yoga Flow",
      address: "40 Zen Street, Hillside",
      program: "10 Class Pass",
      remaining: 4,
      total: 10,
      accent: "#9B8EC4",
      emoji: "🧘"
    },

    // ── Benefit cards (3) ──
    {
      id: "benefit-1",
      type: "benefit",
      shopName: "Sweet Crumbs",
      address: "15 Pastry Lane, West Side",
      program: "10% off all pastries",
      status: "active",
      accent: "#C2703E",
      emoji: "🥐"
    },
    {
      id: "benefit-2",
      type: "benefit",
      shopName: "Brew & Co",
      address: "42 Bean Street, Downtown",
      program: "Free size upgrade on any drink",
      status: "active",
      accent: "#6B4C3B",
      emoji: "☕"
    },
    {
      id: "benefit-3",
      type: "benefit",
      shopName: "The Book Nook",
      address: "3 Library Row, University",
      program: "Happy hour 2-for-1 drinks",
      status: "expired",
      accent: "#7B5EA7",
      emoji: "📚"
    }
  ],

  feedEvents: [
    { id: "e1",  cardId: "punch-1",   event: "punch",           time: "2 hours ago",   group: "Today" },
    { id: "e2",  cardId: "bundle-1",  event: "bundle_use",      time: "3 hours ago",   group: "Today" },
    { id: "e3",  cardId: "benefit-1", event: "benefit_activated", time: "5 hours ago",  group: "Today" },
    { id: "e4",  cardId: "punch-2",   event: "punch",           time: "9 hours ago",   group: "Today" },
    { id: "e5",  cardId: "punch-3",   event: "reward_ready",    time: "Yesterday",     group: "Yesterday" },
    { id: "e6",  cardId: "punch-5",   event: "punch",           time: "Yesterday",     group: "Yesterday" },
    { id: "e7",  cardId: "bundle-4",  event: "bundle_purchase",  time: "Yesterday",    group: "Yesterday" },
    { id: "e8",  cardId: "punch-7",   event: "reward_ready",    time: "2 days ago",    group: "Earlier" },
    { id: "e9",  cardId: "punch-4",   event: "punch",           time: "3 days ago",    group: "Earlier" },
    { id: "e10", cardId: "bundle-2",  event: "bundle_use",      time: "3 days ago",    group: "Earlier" },
    { id: "e11", cardId: "punch-6",   event: "new_card",        time: "4 days ago",    group: "Earlier" },
    { id: "e12", cardId: "punch-8",   event: "new_card",        time: "5 days ago",    group: "Earlier" },
    { id: "e13", cardId: "benefit-3", event: "benefit_expired",  time: "1 week ago",   group: "Last week" },
    { id: "e14", cardId: "bundle-3",  event: "bundle_use",      time: "1 week ago",    group: "Last week" },
    { id: "e15", cardId: "punch-1",   event: "punch",           time: "1 week ago",    group: "Last week" }
  ]
};

// Helper: is a punch card reward-ready?
APP_DATA.isRewardReady = function(card) {
  return card.type === "punch" && card.current >= card.total;
};

// Helper: get all reward-ready cards
APP_DATA.rewardReadyCards = function() {
  return this.cards.filter(c => this.isRewardReady(c));
};

// Helper: get card by id
APP_DATA.getCard = function(id) {
  return this.cards.find(c => c.id === id);
};

// Helper: get cards by type
APP_DATA.cardsByType = function(type) {
  return this.cards.filter(c => c.type === type);
};

// Helper: event description text
APP_DATA.eventText = function(event) {
  const card = this.getCard(event.cardId);
  if (!card) return "";
  switch (event.event) {
    case "punch":             return `Got a punch at ${card.shopName}`;
    case "reward_ready":      return `Reward ready at ${card.shopName}!`;
    case "new_card":          return `New card from ${card.shopName}`;
    case "bundle_use":        return `Used ${card.program} at ${card.shopName}`;
    case "bundle_purchase":   return `Purchased ${card.program} at ${card.shopName}`;
    case "benefit_activated": return `Benefit activated: ${card.program}`;
    case "benefit_expired":   return `Benefit expired: ${card.program}`;
    default:                  return event.event;
  }
};

// ?auth= presets: in, out (default: out)
(function() {
  const auth = new URLSearchParams(window.location.search).get('auth')
    || localStorage.getItem('epunch-auth')
    || 'out';
  APP_DATA.user = auth === 'in' ? { ...APP_DATA.signedInUser } : { ...APP_DATA.guestUser };
})();

// ?state= presets
// empty — new user, no cards
// one — single card, just started
// few — 2 punch cards
// reward — 1 card ready to redeem
// full — everything (default)
(function() {
  const state = new URLSearchParams(window.location.search).get('state')
    || localStorage.getItem('epunch-state')
    || 'full';
  if (state === 'full') return;

  const allCards = APP_DATA.cards;
  const allEvents = APP_DATA.feedEvents;

  if (state === 'empty') {
    APP_DATA.cards = [];
    APP_DATA.feedEvents = [];
  } else if (state === 'one') {
    APP_DATA.cards = allCards.filter(c => c.id === 'punch-8');
    APP_DATA.feedEvents = allEvents.filter(e => e.cardId === 'punch-8');
  } else if (state === 'few') {
    const keep = ['punch-1', 'punch-2'];
    APP_DATA.cards = allCards.filter(c => keep.includes(c.id));
    APP_DATA.feedEvents = allEvents.filter(e => keep.includes(e.cardId));
  } else if (state === 'reward') {
    const keep = ['punch-3'];
    APP_DATA.cards = allCards.filter(c => keep.includes(c.id));
    APP_DATA.feedEvents = allEvents.filter(e => keep.includes(e.cardId));
  } else if (state === 'rewards3') {
    APP_DATA.cards = allCards.map(c => {
      if (c.id === 'punch-5') return { ...c, current: c.total };
      return c;
    });
  }
})();
