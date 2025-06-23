import { AnimationStep, advanceToNextStep } from './animationSlice';
import { showOverlay } from '../dashboard/overlay/completionOverlaySlice';
import { updatePunchCardById, scrollToCard, addPunchCard } from '../punchCards/punchCardsSlice';
import type { AppDispatch } from '../../store/store';

export class ShowPunchAnimation extends AnimationStep {
  constructor(
    private cardId: string, 
    private punchIndex: number
  ) {
    super();
  }

  execute(dispatch: AppDispatch) {
    // Set the animated punch index to trigger Framer Motion animation
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        animationFlags: { 
          punchAnimation: { punchIndex: this.punchIndex }
        }
      }
    }));

    // Auto-advance after animation duration
    setTimeout(() => {
      // Clear animation flag
      dispatch(updatePunchCardById({
        id: this.cardId,
        updates: { 
          animationFlags: { 
            punchAnimation: undefined
          }
        }
      }));
      // Advance to next step in sequence
      dispatch(advanceToNextStep());
    }, 1500); // Match Framer Motion animation duration
  }
}

export class ShowCompletionOverlay extends AnimationStep {
  constructor(private cardId: string) {
    super();
  }

  getCompletionEventName(): string | null {
    return 'COMPLETION_OVERLAY_CLOSED';
  }

  async execute(dispatch: AppDispatch) {
    try {
      dispatch(showOverlay({
        cardId: this.cardId
      }));
    } catch (error) {
      console.error('Failed to show completion overlay:', error);
    }
  }
}

export class HighlightCard extends AnimationStep {
  constructor(private cardId: string) {
    super();
  }

  getCompletionEventName(): string | null {
    return 'HIGHLIGHT_ANIMATION_COMPLETE';
  }

  execute(dispatch: AppDispatch) {
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        animationFlags: { 
          highlighted: true
        }
      }
    }));
  }

  cleanup(dispatch: AppDispatch) {
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        animationFlags: { 
          highlighted: false
        }
      }
    }));
  }
}

export class ScrollToCard extends AnimationStep {
  constructor(private cardId: string) {
    super();
  }

  execute(dispatch: AppDispatch) {
    dispatch(scrollToCard(this.cardId));
  }
}

export class AddNewCard extends AnimationStep {
  constructor(private card: any) {
    super();
  }

  execute(dispatch: AppDispatch) {
    dispatch(addPunchCard(this.card));
  }
}