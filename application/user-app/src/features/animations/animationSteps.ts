import { AnimationStep } from './animationSlice';
import { showAlert, hideAlert } from '../alert/alertSlice';
import { showOverlay } from '../dashboard/completionOverlaySlice';
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

    dispatch(showAlert("✨ You've got a new punch!"));
  }

  cleanup(dispatch: AppDispatch) {
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        animationFlags: { 
          punchAnimation: undefined
        }
      }
    }));
    
    dispatch(hideAlert());
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
      console.log('ShowCompletionOverlay executing, showing overlay');
      
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
    console.log('ShowNewCardAnimation executing for card:', this.cardId);
    
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        visible: true,
        animationFlags: { 
          slideAnimation: true
        }
      }
    }));

    console.log('Set card visible and slideAnimation to true for:', this.cardId);
  }

  cleanup(dispatch: AppDispatch) {
    console.log('Clearing slideAnimation for card:', this.cardId);
    
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
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        animationFlags: { 
          rewardClaimedAnimation: true
        }
      }
    }));

    dispatch(showAlert("🎉 Reward redeemed! Enjoy your treat!"));

    // Auto-cleanup after animation duration (1s for slideOutAndFade)
    setTimeout(() => {
      this.cleanup(dispatch);
    }, 3000); // Slightly longer than animation duration for safety
  }

  cleanup(dispatch: AppDispatch) {
    // First clear the animation flag
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        animationFlags: { 
          rewardClaimedAnimation: false
        }
      }
    }));
    
    // Then update the card status to REWARD_REDEEMED so it gets filtered out
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        status: 'REWARD_REDEEMED'
      }
    }));
    
    dispatch(hideAlert());
  }
} 