import { AnimationStep, advanceToNextStep } from './animationSlice';
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

  execute(dispatch: AppDispatch) {
    // Set punch animation flag
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        animationFlags: { 
          punchAnimation: { punchIndex: this.punchIndex }
        }
      }
    }));

    // Show alert
    dispatch(showAlert("✨ You've got a new punch!"));

    // Auto-advance after 3 seconds
    setTimeout(() => {
      // Clear punch animation
      dispatch(updatePunchCardById({
        id: this.cardId,
        updates: { 
          animationFlags: { 
            punchAnimation: undefined
          }
        }
      }));
      
      dispatch(hideAlert());
      dispatch(advanceToNextStep());
    }, 3000);
  }
}

export class ShowCompletionOverlay extends AnimationStep {
  constructor(private cardId: string) {
    super();
  }

  async execute(dispatch: AppDispatch) {
    try {
      console.log('ShowCompletionOverlay executing, showing overlay and advancing to next step');
      
      // Show overlay
      dispatch(showOverlay({
        cardId: this.cardId
      }));
      
      // Immediately advance to next step (which should be WaitForEvent)
      dispatch(advanceToNextStep());
    } catch (error) {
      console.error('Failed to show completion overlay:', error);
      dispatch(advanceToNextStep());
    }
  }
}

export class HighlightCard extends AnimationStep {
  constructor(private cardId: string) {
    super();
  }

  execute(dispatch: AppDispatch) {
    // Set highlight flag
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        animationFlags: { 
          highlighted: true
        }
      }
    }));

    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      dispatch(updatePunchCardById({
        id: this.cardId,
        updates: { 
          animationFlags: { 
            highlighted: false
          }
        }
      }));
      
      dispatch(advanceToNextStep());
    }, 1500);
  }
}

export class ShowNewCardAnimation extends AnimationStep {
  constructor(private cardId: string) {
    super();
  }

  execute(dispatch: AppDispatch) {
    console.log('ShowNewCardAnimation executing for card:', this.cardId);
    
    // Make card visible and start slide animation
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

    // Auto-advance after animation completes
    setTimeout(() => {
      console.log('Clearing slideAnimation for card:', this.cardId);
      
      dispatch(updatePunchCardById({
        id: this.cardId,
        updates: { 
          animationFlags: { 
            slideAnimation: false
          }
        }
      }));
      
      dispatch(advanceToNextStep());
    }, 600);
  }
}

export class ScrollToCard extends AnimationStep {
  constructor(private cardId: string) {
    super();
  }

  execute(dispatch: AppDispatch) {
    // Trigger scroll to card
    dispatch(scrollToCard(this.cardId));
    
    // Auto-advance immediately since scrolling doesn't need to block
    setTimeout(() => {
      dispatch(advanceToNextStep());
    }, 100);
  }
}

export class ShowRewardClaimedAnimation extends AnimationStep {
  constructor(private cardId: string) {
    super();
  }

  execute(dispatch: AppDispatch) {
    // Set reward claimed animation flag
    dispatch(updatePunchCardById({
      id: this.cardId,
      updates: { 
        animationFlags: { 
          rewardClaimedAnimation: true
        }
      }
    }));

    // Show alert
    dispatch(showAlert("🎉 Reward redeemed! Enjoy your treat!"));

    // Auto-advance after animation completes
    setTimeout(() => {
      dispatch(updatePunchCardById({
        id: this.cardId,
        updates: { 
          animationFlags: { 
            rewardClaimedAnimation: false
          }
        }
      }));
      
      dispatch(hideAlert());
      dispatch(advanceToNextStep());
    }, 1200);
  }
} 