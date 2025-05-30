import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export abstract class AnimationStep {
  abstract execute(dispatch: any): void;
  
  // Return event name to wait for after execution, or null for immediate advancement
  getWaitForEvent(): string | null {
    return null;
  }
  
  // Called automatically when the waited-for event is received
  cleanup(_dispatch: any): void {
    // Override in subclasses that need cleanup
  }
}

export class Wait {
  constructor(private ms: number) { }
  getDuration() { return this.ms; }
}

export class WaitForEvent {
  constructor(private eventName: string) { }
  getEventName() { return this.eventName; }
}

export type SequenceItem = AnimationStep | Wait | WaitForEvent;

export interface AnimationState {
  sequence: SequenceItem[];
  currentStepIndex: number;
  isRunning: boolean;
  waitingForEvent?: string;
  pendingCleanupStep?: AnimationStep;
  receivedEvent?: string; // Store the last received event
}

const initialState: AnimationState = {
  sequence: [],
  currentStepIndex: 0,
  isRunning: false,
};

const animationSlice = createSlice({
  name: 'animations',
  initialState,
  reducers: {
    startSequence: (state, action: PayloadAction<SequenceItem[]>) => {
      state.sequence = action.payload;
      state.currentStepIndex = 0;
      state.isRunning = true;
      state.waitingForEvent = undefined;
      state.pendingCleanupStep = undefined;
      state.receivedEvent = undefined;
    },

    advanceToNextStep: (state) => {
      if (!state.isRunning || state.currentStepIndex >= state.sequence.length - 1) {
        state.sequence = [];
        state.currentStepIndex = 0;
        state.isRunning = false;
        state.waitingForEvent = undefined;
        state.pendingCleanupStep = undefined;
        state.receivedEvent = undefined;
        return;
      }
      state.currentStepIndex += 1;
      state.waitingForEvent = undefined;
      state.pendingCleanupStep = undefined;
      state.receivedEvent = undefined;
    },

    stopSequence: (state) => {
      state.sequence = [];
      state.currentStepIndex = 0;
      state.isRunning = false;
      state.waitingForEvent = undefined;
      state.pendingCleanupStep = undefined;
      state.receivedEvent = undefined;
    },

    setWaitingForEvent: (state, action: PayloadAction<{ eventName: string, step: AnimationStep }>) => {
      state.waitingForEvent = action.payload.eventName;
      state.pendingCleanupStep = action.payload.step;
    },

    handleEvent: (state, action: PayloadAction<string>) => {
      console.log('handleEvent: received event', action.payload);
      state.receivedEvent = action.payload;
    },

    clearReceivedEvent: (state) => {
      state.receivedEvent = undefined;
    }
  }
});

export const {
  startSequence,
  advanceToNextStep,
  stopSequence,
  setWaitingForEvent,
  handleEvent,
  clearReceivedEvent
} = animationSlice.actions;

export const selectAnimationState = (state: { animations: AnimationState }) => state.animations;

export default animationSlice.reducer; 