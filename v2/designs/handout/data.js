const APP_DATA = {

  user: {
    id: "EP-2F9A-4C71-8B3E",
    name: "Maria G.",
    email: "maria@example.com",
    authenticated: true,
    qrSeed: 0xABCDEF12
  },

  signedInUser: {
    id: "EP-2F9A-4C71-8B3E",
    name: "Maria G.",
    email: "maria@example.com",
    authenticated: true,
    qrSeed: 0xABCDEF12
  },

  guestUser: {
    id: "EP-2F9A-4C71-8B3E",
    name: "Maria G.",
    authenticated: true,
    qrSeed: 0xABCDEF12
  },

  cards: [
    {
      id: "punch-1",
      type: "punch",
      shopName: "Your Business",
      address: "123 Main Street",
      program: "Buy 8, get 1 free",
      reward: "1 free item of your choice",
      current: 5,
      total: 8,
      accent: "#FF385C",
      emoji: "\u2605"
    },
    {
      id: "punch-2",
      type: "punch",
      shopName: "Your Business",
      address: "456 Oak Avenue",
      program: "Buy 6, get 1 free",
      reward: "1 free item",
      current: 6,
      total: 6,
      accent: "#008A05",
      emoji: "\u2666"
    }
  ],

  feedEvents: [
    { id: "e1", cardId: "punch-1", event: "punch", time: "2 hours ago", group: "Today" },
    { id: "e2", cardId: "punch-1", event: "punch", time: "Yesterday", group: "Yesterday" },
    { id: "e3", cardId: "punch-2", event: "reward_ready", time: "2 days ago", group: "Earlier" },
    { id: "e4", cardId: "punch-1", event: "new_card", time: "1 week ago", group: "Last week" }
  ]
};

APP_DATA.isRewardReady = function(card) {
  return card.type === "punch" && card.current >= card.total;
};

APP_DATA.rewardReadyCards = function() {
  return this.cards.filter(c => this.isRewardReady(c));
};

APP_DATA.getCard = function(id) {
  return this.cards.find(c => c.id === id);
};

APP_DATA.cardsByType = function(type) {
  return this.cards.filter(c => c.type === type);
};

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
