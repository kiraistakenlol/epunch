# Punch Card Animation System

## Architecture Overview

The animation system uses a **sequence-based state machine** where each animation is a series of steps executed in order. The system is built with three main concepts:

- **Sequences**: Arrays of steps that define complete animation flows
- **Steps**: Individual actions (animations, delays, or wait conditions)  
- **Executor**: Hook that processes sequences step by step

## Core Components

### Animation Slice (`animationSlice.ts`)
Manages the sequence execution state:
```typescript
interface AnimationState {
  sequence: SequenceItem[];
  currentStepIndex: number;
  isRunning: boolean;
}
```

### Step Types
- **AnimationStep**: Classes that execute UI changes (extend `AnimationStep`)
- **Delay**: Time-based delays with auto-advance
- **WaitForEvent**: Pauses until specific event is dispatched

### Animation Executor (`useAnimationExecutor.ts`)
Hook that:
- Executes current step when sequence state changes
- Sets timeouts for delays
- Waits for events to advance sequence

## Step Implementation

### Animation Steps (Auto-advancing)
```typescript
class ShowPunchAnimation extends AnimationStep {
  execute(dispatch) {
    // 1. Update UI state (show animation)
    // 2. Set timeout to clear animation and advance
    setTimeout(() => {
      dispatch(advanceToNextStep());
    }, duration);
  }
}
```

### Event-Based Steps (Wait for user interaction)
```typescript
new WaitForEvent('COMPLETION_OVERLAY_CLOSED')
// Advances when: dispatch(handleEvent('COMPLETION_OVERLAY_CLOSED'))
```

## Animation Flows

### Punch Added (Simple)
```typescript
[
  new ShowPunchAnimation(cardId, punchIndex),  // 3s auto-advance
]
```

### Punch Added (Card Completed)
```typescript
[
  new ShowPunchAnimation(cardId, punchIndex),     // 3s auto-advance
  new ShowCompletionOverlay(cardId),              // Shows overlay + advances
  new WaitForEvent('COMPLETION_OVERLAY_CLOSED'),  // Waits for user
  new Delay(500),                                 // 0.5s auto-advance
  new ShowNewCardAnimation(newCardId)             // 0.6s auto-advance
]
```

### Reward Claimed
```typescript
[
  new ShowRewardClaimedAnimation(cardId)  // 1.2s auto-advance
]
```

## State Management

### Separated Concerns
- **Animation Slice**: Sequence execution only
- **Alert Slice**: Global alert system (`showAlert()`, `hideAlert()`)
- **Completion Overlay Slice**: Overlay state (`showOverlay()`, `hideOverlay()`)
- **Punch Cards Slice**: Card data and animation flags

### Global Components (in App.tsx)
- `useAnimationExecutor()` - Runs sequences
- `<Alert />` - Shows alerts globally  
- `<CompletionOverlay />` - Shows completion overlays globally

## Event Flow

```
WebSocket Event → Sequence Creation → useAnimationExecutor → Step Execution → UI Changes → Auto/Event Advance → Next Step
```

### Example: Card Completion Flow
1. WebSocket receives `PUNCH_ADDED` with new card
2. Handler creates sequence with 5 steps
3. `useAnimationExecutor` starts with step 0 (ShowPunchAnimation)
4. Step shows punch animation, auto-advances after 3s
5. Step 1 (ShowCompletionOverlay) shows overlay, advances immediately
6. Step 2 (WaitForEvent) waits for user to close overlay
7. User clicks → `dispatch(handleEvent('COMPLETION_OVERLAY_CLOSED'))` → advances
8. Step 3 (Delay) waits 500ms, auto-advances
9. Step 4 (ShowNewCardAnimation) shows new card, auto-advances after 600ms
10. Sequence complete

## Key Features

- **Declarative**: Animation flows defined as simple arrays
- **Self-contained**: Each step manages its own timing and advancement
- **Event-driven**: Supports user interaction within sequences
- **Global**: Alerts and overlays work across entire app
- **Debuggable**: Current sequence and step visible in Redux DevTools 