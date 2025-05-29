import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export abstract class AnimationStep {
  abstract execute(dispatch: any): void;
}

export class Delay {
  constructor(private ms: number) { }
  getDuration() { return this.ms; }
}

export class WaitForEvent {
  constructor(private eventName: string) { }
  getEventName() { return this.eventName; }
}

export type SequenceItem = AnimationStep | Delay | WaitForEvent;

export interface AnimationState {
  sequence: SequenceItem[];
  currentStepIndex: number;
  isRunning: boolean;
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
    },

    advanceToNextStep: (state) => {
      if (!state.isRunning || state.currentStepIndex >= state.sequence.length - 1) {
        state.sequence = [];
        state.currentStepIndex = 0;
        state.isRunning = false;
        return;
      }
      state.currentStepIndex += 1;
    },

    stopSequence: (state) => {
      state.sequence = [];
      state.currentStepIndex = 0;
      state.isRunning = false;
    },

    handleEvent: (state, action: PayloadAction<string>) => {
      console.log('handleEvent called with:', action.payload, 'current state:', { isRunning: state.isRunning, currentStepIndex: state.currentStepIndex });

      if (!state.isRunning) return;

      const currentItem = state.sequence[state.currentStepIndex];
      console.log('Current item:', currentItem);

      if (currentItem instanceof WaitForEvent &&
        currentItem.getEventName() === action.payload) {
        console.log('Event matches current WaitForEvent, advancing to next step');

        // Advance to next step
        if (state.currentStepIndex >= state.sequence.length - 1) {
          console.log('Sequence completed');
          state.sequence = [];
          state.currentStepIndex = 0;
          state.isRunning = false;
        } else {
          console.log('Advancing to step:', state.currentStepIndex + 1);
          state.currentStepIndex += 1;
        }
      } else {
        console.log('Event does not match current item or not waiting for event');
      }
    }
  }
});

export const {
  startSequence,
  advanceToNextStep,
  stopSequence,
  handleEvent
} = animationSlice.actions;

export const selectAnimationState = (state: { animations: AnimationState }) => state.animations;

export default animationSlice.reducer; 