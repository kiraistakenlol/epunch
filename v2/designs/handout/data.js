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
      programI18n: { en: "Buy 8, get 1 free", es: "Compra 8, lleva 1 gratis", ru: "Купи 8, получи 1 бесплатно", zh: "买8送1" },
      reward: "1 free item of your choice",
      rewardI18n: { en: "1 free item of your choice", es: "1 artículo gratis a tu elección", ru: "1 бесплатный товар на выбор", zh: "免费获得1件商品" },
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
      programI18n: { en: "Buy 6, get 1 free", es: "Compra 6, lleva 1 gratis", ru: "Купи 6, получи 1 бесплатно", zh: "买6送1" },
      reward: "1 free item",
      rewardI18n: { en: "1 free item", es: "1 artículo gratis", ru: "1 бесплатный товар", zh: "免费获得1件商品" },
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

APP_DATA.eventText = function(event, lang) {
  const card = this.getCard(event.cardId);
  if (!card) return "";
  const shop = card.shopName;
  const prog = (card.programI18n && card.programI18n[lang]) || card.program;
  const texts = {
    punch:             { en: `Got a punch at ${shop}`, es: `Sello en ${shop}`, ru: `Печать в ${shop}`, zh: `在${shop}获得印章` },
    reward_ready:      { en: `Reward ready at ${shop}!`, es: `¡Premio listo en ${shop}!`, ru: `Награда готова в ${shop}!`, zh: `${shop}的奖励已就绪！` },
    new_card:          { en: `New card from ${shop}`, es: `Nueva tarjeta de ${shop}`, ru: `Новая карта от ${shop}`, zh: `来自${shop}的新卡片` },
    bundle_use:        { en: `Used ${prog} at ${shop}`, es: `Usado ${prog} en ${shop}`, ru: `Использован ${prog} в ${shop}`, zh: `在${shop}使用了${prog}` },
    bundle_purchase:   { en: `Purchased ${prog} at ${shop}`, es: `Comprado ${prog} en ${shop}`, ru: `Куплен ${prog} в ${shop}`, zh: `在${shop}购买了${prog}` },
    benefit_activated: { en: `Benefit activated: ${prog}`, es: `Beneficio activado: ${prog}`, ru: `Бонус активирован: ${prog}`, zh: `权益已激活：${prog}` },
    benefit_expired:   { en: `Benefit expired: ${prog}`, es: `Beneficio vencido: ${prog}`, ru: `Бонус истёк: ${prog}`, zh: `权益已过期：${prog}` },
  };
  const t = texts[event.event];
  return (t && (t[lang] || t.en)) || event.event;
};
