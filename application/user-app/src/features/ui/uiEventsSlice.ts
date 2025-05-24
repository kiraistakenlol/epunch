import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIEvent {
  id: string;
  type: 'PUNCH_ADDED' | 'CARD_CREATED';
  cardId: string;
  punchIndex?: number;
  timestamp: number;
  processed: boolean;
}

export interface UIEventsState {
  pendingEvents: UIEvent[];
  animations: {
    highlightedCardId: string | null;
    animatedPunch: { cardId: string; punchIndex: number } | null;
  };
  alert: string | null;
}

const initialState: UIEventsState = {
  pendingEvents: [],
  animations: {
    highlightedCardId: null,
    animatedPunch: null,
  },
  alert: null,
};

const uiEventsSlice = createSlice({
  name: 'uiEvents',
  initialState,
  reducers: {
    addPendingEvent: (state, action: PayloadAction<Omit<UIEvent, 'id' | 'timestamp' | 'processed'>>) => {
      const event: UIEvent = {
        ...action.payload,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        processed: false,
      };
      state.pendingEvents.push(event);
    },
    
    markEventProcessed: (state, action: PayloadAction<string>) => {
      const event = state.pendingEvents.find(e => e.id === action.payload);
      if (event) {
        event.processed = true;
      }
    },
    
    cleanupProcessedEvents: (state) => {
      const fiveSecondsAgo = Date.now() - 5000;
      state.pendingEvents = state.pendingEvents.filter(
        e => !e.processed || e.timestamp > fiveSecondsAgo
      );
    },
    
    setHighlightedCard: (state, action: PayloadAction<string | null>) => {
      state.animations.highlightedCardId = action.payload;
    },
    
    setAnimatedPunch: (state, action: PayloadAction<{ cardId: string; punchIndex: number } | null>) => {
      state.animations.animatedPunch = action.payload;
    },
    
    setAlert: (state, action: PayloadAction<string | null>) => {
      state.alert = action.payload;
    },
    
    clearAllAnimations: (state) => {
      state.animations.highlightedCardId = null;
      state.animations.animatedPunch = null;
      state.alert = null;
    },
  },
});

export const {
  addPendingEvent,
  markEventProcessed,
  cleanupProcessedEvents,
  setHighlightedCard,
  setAnimatedPunch,
  setAlert,
  clearAllAnimations,
} = uiEventsSlice.actions;

export const selectPendingEvents = (state: { uiEvents: UIEventsState }) => state.uiEvents.pendingEvents;
export const selectUnprocessedEvents = (state: { uiEvents: UIEventsState }) => 
  state.uiEvents.pendingEvents.filter(e => !e.processed);
export const selectHighlightedCardId = (state: { uiEvents: UIEventsState }) => state.uiEvents.animations.highlightedCardId;
export const selectAnimatedPunch = (state: { uiEvents: UIEventsState }) => state.uiEvents.animations.animatedPunch;
export const selectAlert = (state: { uiEvents: UIEventsState }) => state.uiEvents.alert;

export default uiEventsSlice.reducer; 