import { AnimationStep } from './animationSlice';
import { showAlert, hideAlert } from '../alert/alertSlice';
import { showOverlay } from '../dashboard/overlay/completionOverlaySlice';
import { updatePunchCardById, scrollToCard } from '../punchCards/punchCardsSlice';
import type { AppDispatch } from '../../store/store';

export class ShowPunchAnimation extends AnimationStep {
  constructor(
    private cardId: string, 
    private punchIndex: number
  ) {
    super();
  }

  getWaitForEvent(): string | null {
    return 'PUNCH_ANIMATION_COMPLETE';
  }

  execute(dispatch: AppDispatch) {
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        animationFlags: { 
          punchAnimation: { punchIndex: this.punchIndex }
        }
      }
    }));
  }

  cleanup(dispatch: AppDispatch) {
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        showLastFilledPunchAsNotFilled: false,
        animationFlags: { 
          punchAnimation: undefined
        }
      }
    }));
  }
}

export class ShowPunchAlert extends AnimationStep {
  getWaitForEvent(): string | null {
    return null; // Don't wait for event, use timeout
  }

  execute(dispatch: AppDispatch) {
    dispatch(showAlert("✨ New punch! ✨"));

    setTimeout(() => {
      dispatch(hideAlert());
    }, 3000);
  }
}

export class ShowCompletionOverlay extends AnimationStep {
  constructor(private cardId: string) {
    super();
  }

  getWaitForEvent(): string | null {
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

  getWaitForEvent(): string | null {
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

export class ShowNewCardAnimation extends AnimationStep {
  constructor(private cardId: string) {
    super();
  }

  getWaitForEvent(): string | null {
    return 'SLIDE_IN_ANIMATION_COMPLETE';
  }

  execute(dispatch: AppDispatch) {
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        visible: true,
        animationFlags: { 
          slideAnimation: true
        }
      }
    }));
  }

  cleanup(dispatch: AppDispatch) {
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        animationFlags: { 
          slideAnimation: false
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

export class ShowRewardClaimedAnimation extends AnimationStep {
  constructor(private cardId: string) {
    super();
  }

  getWaitForEvent(): string | null {
    return null; // Don't wait for event, use timeout instead
  }

  execute(dispatch: AppDispatch) {
    dispatch(showAlert("🎉 Reward redeemed! Enjoy your treat!"));

    // With Framer Motion, we can immediately change the status
    // AnimatePresence will handle the smooth exit animation
    setTimeout(() => {
      this.cleanup(dispatch);
    }, 500); // Just enough time for alert to show
  }

  cleanup(dispatch: AppDispatch) {
    // Update the card status to REWARD_REDEEMED - Framer Motion handles the rest
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        status: 'REWARD_REDEEMED'
      }
    }));
    
    dispatch(hideAlert());
  }
} 