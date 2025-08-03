# BENEFIT CARDS IMPLEMENTATION TASK

## Problem
Implement a new "benefit cards" product type that integrates with the existing loyalty system (punch cards and bundles) to allow merchants to sell/give various benefits to users (discounts, free items, priority access, etc.) with a minimal initial implementation.

## GOAL
- Create a new benefit_card table with minimal schema: `id`, `user_id`, `merchant_id`, `item_name`, `expires_at`, `created_at`
- Integrate benefit cards into the user's loyalty wallet alongside punch cards and bundles
- Enable merchant scanning and creation of benefit cards
- Support real-time updates via WebSocket events
- Provide read-only scanning for benefit cards (like BundleScanResult but view-only)

## Implementation plan
* **Database**: Create minimal `benefit_card` table following existing patterns
* **Backend Feature**: Create complete benefit-card feature (repository, service, controller, module, mapper)
* **DTOs & Events**: Define benefit card DTOs and WebSocket events in common-core
* **Frontend State**: Create Redux slice for benefit cards following bundles pattern
* **User Interface**: Create benefit card component for loyalty wallet display
* **Merchant Scanner**: Add BenefitCardsTab to customer scan result with simple form
* **QR Integration**: Add benefit_card_id QR type and scanning result component
* **Real-time Updates**: Handle benefit card events in WebSocket handler

## Implementation progress
- [ ] Create benefit_card database table and migration
- [ ] Create backend benefit-card feature (repository, service, controller, module)
- [ ] Create benefit card DTOs in common-core
- [ ] Create benefit card mapper in backend
- [ ] Add benefit card endpoints to user controller
- [ ] Update app.module.ts to import BenefitCardModule
- [ ] Create benefit card Redux slice in user-app
- [ ] Update store.ts to include benefit cards reducer
- [ ] Create BenefitCardItem component for user app
- [ ] Update LoyaltyCards.tsx to include benefit cards
- [ ] Create BenefitCardsTab component for merchant scanner
- [ ] Update CustomerScanResult.tsx to include benefit cards tab
- [ ] Add benefit_card_id QR type to qr-value.dto.ts
- [ ] Create BenefitCardScanResult component for merchant app  
- [ ] Add benefit card events to events.dto.ts
- [ ] Update useWebSocketEventHandler.ts to handle benefit card events
- [ ] Test end-to-end functionality

## Implementation

### Step 1: Database Schema
Create the minimal benefit_card table:

```sql
-- Add to database/ddl/core-schema.sql
CREATE TABLE benefit_card (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    merchant_id UUID NOT NULL REFERENCES merchant(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_benefit_card_user_id ON benefit_card(user_id);
CREATE INDEX idx_benefit_card_merchant_id ON benefit_card(merchant_id);
```

### Step 2: Backend DTOs and Events
Create benefit card DTOs in `application/common-core/src/dto/benefit-card.dto.ts`:

```typescript
import { MerchantDto } from './merchant.dto';

export interface BenefitCardDto {
  id: string;
  userId: string;
  merchant: MerchantDto;
  itemName: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface BenefitCardCreateDto {
  userId: string;
  merchantId: string;
  itemName: string;
  expiresAt?: string; // ISO string
}
```

Add events to `application/common-core/src/dto/events.dto.ts`:

```typescript
export interface BenefitCardCreatedEvent extends BaseEvent {
  type: 'BENEFIT_CARD_CREATED';
  benefitCard: BenefitCardDto;
}

// Update union type
export type AppEvent = PunchAddedEvent | RewardClaimedEvent | BundleCreatedEvent | BundleUsedEvent | BenefitCardCreatedEvent;
```

Add QR type to `application/common-core/src/dto/qr-value.dto.ts`:

```typescript
export type QRValueType = 'user_id' | 'redemption_punch_card_id' | 'bundle_id' | 'benefit_card_id';

export interface QRValueBenefitCardIdDto {
  type: 'benefit_card_id';
  benefit_card_id: string;
}

export type QRValueDto = QRValueUserIdDto | QRValuePunchCardIdDto | QRValueBundleIdDto | QRValueBenefitCardIdDto;
```

### Step 3: Backend Repository
Create `application/backend/src/features/benefit-card/benefit-card.repository.ts`:

```typescript
import { Injectable, Logger, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { Merchant } from '../merchant/merchant.repository';

export interface BenefitCard {
  id: string;
  user_id: string;
  merchant_id: string;
  item_name: string;
  expires_at: Date | null;
  created_at: Date;
}

export interface BenefitCardWithMerchant extends BenefitCard {
  merchant: Merchant;
}

@Injectable()
export class BenefitCardRepository {
  private readonly logger = new Logger(BenefitCardRepository.name);

  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async findUserBenefitCards(userId: string): Promise<BenefitCardWithMerchant[]> {
    const query = `
      SELECT 
        bc.*,
        m.id as merchant_id,
        m.name as merchant_name,
        m.address as merchant_address,
        m.slug as merchant_slug,
        m.logo_url as merchant_logo_url,
        m.created_at as merchant_created_at
      FROM benefit_card bc
      JOIN merchant m ON bc.merchant_id = m.id
      WHERE bc.user_id = $1
      ORDER BY bc.created_at DESC
    `;
    
    try {
      const result = await this.pool.query(query, [userId]);
      this.logger.log(`Found ${result.rows.length} benefit cards for user: ${userId}`);
      
      return result.rows.map(row => ({
        id: row.id,
        user_id: row.user_id,
        merchant_id: row.merchant_id,
        item_name: row.item_name,
        expires_at: row.expires_at,
        created_at: row.created_at,
        merchant: {
          id: row.merchant_id,
          name: row.merchant_name,
          address: row.merchant_address,
          slug: row.merchant_slug,
          logo_url: row.merchant_logo_url,
          created_at: row.merchant_created_at
        }
      }));
    } catch (error: any) {
      this.logger.error(`Error finding benefit cards for user ${userId}:`, error.message);
      throw error;
    }
  }

  async createBenefitCard(userId: string, merchantId: string, itemName: string, expiresAt: Date | null): Promise<BenefitCard> {
    const query = `
      INSERT INTO benefit_card (user_id, merchant_id, item_name, expires_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [userId, merchantId, itemName, expiresAt];
    
    try {
      const result = await this.pool.query(query, values);
      const benefitCard = result.rows[0];
      this.logger.log(`Created benefit card: ${benefitCard.id}`);
      return benefitCard;
    } catch (error: any) {
      this.logger.error(`Error creating benefit card for user ${userId}:`, error.message);
      throw error;
    }
  }

  async getBenefitCardById(benefitCardId: string): Promise<BenefitCardWithMerchant> {
    const query = `
      SELECT 
        bc.*,
        m.id as merchant_id,
        m.name as merchant_name,
        m.address as merchant_address,
        m.slug as merchant_slug,
        m.logo_url as merchant_logo_url,
        m.created_at as merchant_created_at
      FROM benefit_card bc
      JOIN merchant m ON bc.merchant_id = m.id
      WHERE bc.id = $1
    `;
    
    try {
      const result = await this.pool.query(query, [benefitCardId]);
      if (result.rows.length === 0) {
        throw new Error(`Benefit card not found: ${benefitCardId}`);
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        user_id: row.user_id,
        merchant_id: row.merchant_id,
        item_name: row.item_name,
        expires_at: row.expires_at,
        created_at: row.created_at,
        merchant: {
          id: row.merchant_id,
          name: row.merchant_name,
          address: row.merchant_address,
          slug: row.merchant_slug,
          logo_url: row.merchant_logo_url,
          created_at: row.merchant_created_at
        }
      };
    } catch (error: any) {
      this.logger.error(`Error finding benefit card ${benefitCardId}:`, error.message);
      throw error;
    }
  }
}
```

### Step 4: Backend Service
Create `application/backend/src/features/benefit-card/benefit-card.service.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { BenefitCardRepository } from './benefit-card.repository';
import { BenefitCardDto, BenefitCardCreateDto, BenefitCardCreatedEvent } from 'e-punch-common-core';
import { BenefitCardMapper } from '../../mappers';
import { EventService } from '../../events/event.service';
import { UserRepository } from '../user/user.repository';
import { Authentication, AuthorizationService } from '../../core';

@Injectable()
export class BenefitCardService {
  private readonly logger = new Logger(BenefitCardService.name);

  constructor(
    private readonly benefitCardRepository: BenefitCardRepository,
    private readonly userRepository: UserRepository,
    private readonly eventService: EventService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async getBenefitCardById(benefitCardId: string, auth: Authentication): Promise<BenefitCardDto> {
    this.logger.log(`Fetching benefit card by ID: ${benefitCardId}`);

    const benefitCard = await this.benefitCardRepository.getBenefitCardById(benefitCardId);

    // Add authorization check here if needed
    // this.authorizationService.validateBenefitCardReadAccess(auth, benefitCard);

    this.logger.log(`Found benefit card: ${benefitCardId}`);
    return BenefitCardMapper.toDto(benefitCard);
  }

  async getUserBenefitCards(userId: string, auth: Authentication): Promise<BenefitCardDto[]> {
    this.logger.log(`Fetching benefit cards for user: ${userId}`);
    
    // Add authorization check here if needed
    // this.authorizationService.validateGetUserBenefitCardsAccess(auth, userId);

    try {
      const benefitCardsWithMerchant = await this.benefitCardRepository.findUserBenefitCards(userId);

      this.logger.log(`Found ${benefitCardsWithMerchant.length} benefit cards for user: ${userId}`);
      return BenefitCardMapper.toDtoArray(benefitCardsWithMerchant);
    } catch (error: any) {
      this.logger.error(`Error fetching benefit cards for user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }
  
  async createBenefitCard(data: BenefitCardCreateDto, auth: Authentication): Promise<BenefitCardDto> {
    this.logger.log(`Creating benefit card for user ${data.userId}`);

    try {
      // Add authorization check here
      // this.authorizationService.validateBenefitCardCreateAccess(auth, data.merchantId);

      const user = await this.userRepository.getUserById(data.userId);

      const expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

      const benefitCard = await this.benefitCardRepository.createBenefitCard(
        data.userId,
        data.merchantId,
        data.itemName,
        expiresAt
      );
      
      const benefitCardWithMerchant = await this.benefitCardRepository.getBenefitCardById(benefitCard.id);
      const benefitCardDto = BenefitCardMapper.toDto(benefitCardWithMerchant);

      this.logger.log(`Emitting BENEFIT_CARD_CREATED event for user ${data.userId}, benefit card ${benefitCard.id}`);
      const benefitCardCreatedEvent: BenefitCardCreatedEvent = {
        type: 'BENEFIT_CARD_CREATED',
        userId: data.userId,
        benefitCard: benefitCardDto,
      };
      this.eventService.emitAppEvent(benefitCardCreatedEvent);

      this.logger.log(`Successfully created benefit card: ${benefitCard.id}`);
      return benefitCardDto;
    } catch (error: any) {
      this.logger.error(`Error creating benefit card for user ${data.userId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

### Step 5: Backend Controller and Module
Create `application/backend/src/features/benefit-card/benefit-card.controller.ts`:

```typescript
import { Controller, Get, Post, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { BenefitCardService } from './benefit-card.service';
import { BenefitCardDto, BenefitCardCreateDto } from 'e-punch-common-core';
import { RequireMerchantUser, Auth } from '../../core/decorators/security.decorators';
import { Authentication } from '../../core/types/authentication.interface';

@Controller('benefit-cards')
export class BenefitCardController {
  constructor(private readonly benefitCardService: BenefitCardService) {}

  @Get(':benefitCardId')
  @RequireMerchantUser()
  async getBenefitCardById(
    @Param('benefitCardId', ParseUUIDPipe) benefitCardId: string,
    @Auth() auth: Authentication,
  ): Promise<BenefitCardDto> {
    return this.benefitCardService.getBenefitCardById(benefitCardId, auth);
  }

  @Post()
  @RequireMerchantUser()
  async createBenefitCard(
    @Body() createDto: BenefitCardCreateDto,
    @Auth() auth: Authentication,
  ): Promise<BenefitCardDto> {
    return this.benefitCardService.createBenefitCard(createDto, auth);
  }
}
```

Create `application/backend/src/features/benefit-card/benefit-card.module.ts`:

```typescript
import { Module, forwardRef } from '@nestjs/common';
import { BenefitCardController } from './benefit-card.controller';
import { BenefitCardService } from './benefit-card.service';
import { BenefitCardRepository } from './benefit-card.repository';
import { DatabaseModule } from '../../database/database.module';
import { WebSocketModule } from '../../websocket/websocket.module';
import { UserModule } from '../user/user.module';
import { CoreModule } from '../../core/core.module';

@Module({
  imports: [DatabaseModule, WebSocketModule, forwardRef(() => UserModule), forwardRef(() => CoreModule)],
  controllers: [BenefitCardController],
  providers: [BenefitCardService, BenefitCardRepository],
  exports: [BenefitCardService, BenefitCardRepository],
})
export class BenefitCardModule {}
```

### Step 6: Backend Mapper
Create `application/backend/src/mappers/benefit-card.mapper.ts`:

```typescript
import { BenefitCardDto } from 'e-punch-common-core';
import { BenefitCardWithMerchant } from '../features/benefit-card/benefit-card.repository';
import { MerchantMapper } from './merchant.mapper';

export class BenefitCardMapper {

  static toDto(benefitCard: BenefitCardWithMerchant): BenefitCardDto {
    const merchant = MerchantMapper.toDto(benefitCard.merchant);

    return {
      id: benefitCard.id,
      userId: benefitCard.user_id,
      merchant,
      itemName: benefitCard.item_name,
      expiresAt: benefitCard.expires_at?.toISOString() || null,
      createdAt: benefitCard.created_at.toISOString(),
    };
  }

  static toDtoArray(benefitCardsWithMerchant: BenefitCardWithMerchant[]): BenefitCardDto[] {
    return benefitCardsWithMerchant.map(benefitCard => this.toDto(benefitCard));
  }
}
```

Update `application/backend/src/mappers/index.ts`:

```typescript
export * from './benefit-card.mapper';
// ... existing exports
```

### Step 7: User Controller Integration
Update `application/backend/src/features/user/user.controller.ts`:

```typescript
// Add import
import { BenefitCardDto } from 'e-punch-common-core';
import { BenefitCardService } from '../benefit-card/benefit-card.service';

// Update constructor
constructor(
  private readonly punchCardsService: PunchCardsService,
  private readonly bundleService: BundleService,
  private readonly benefitCardService: BenefitCardService,
  private readonly userRepository: UserRepository,
) {}

// Add new endpoint
@Get(':userId/benefit-cards')
async getUserBenefitCards(
  @Param('userId', ParseUUIDPipe) userId: string,
  @Auth() auth: Authentication,
): Promise<BenefitCardDto[]> {
  return this.benefitCardService.getUserBenefitCards(userId, auth);
}
```

### Step 8: Frontend Redux Slice
Create `application/user-app/src/features/benefitCards/benefitCardsSlice.ts`:

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BenefitCardDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';

export interface BenefitCardState extends BenefitCardDto {
  animationFlags?: {
    highlighted?: boolean;
  };
}

export interface BenefitCardsState {
  benefitCards: BenefitCardState[] | undefined;
  selectedBenefitCardId: string | null;
  scrollTargetBenefitCardId: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  initialized: boolean;
}

const initialState: BenefitCardsState = {
  benefitCards: undefined,
  selectedBenefitCardId: null,
  scrollTargetBenefitCardId: null,
  isLoading: false,
  error: null,
  lastFetched: null,
  initialized: false
};

export const fetchBenefitCards = createAsyncThunk(
  'benefitCards/fetchBenefitCards',
  async (userId: string, { rejectWithValue }) => {
    try {
      const benefitCards = await apiClient.getUserBenefitCards(userId);
      return benefitCards || [];
    } catch (error: any) {
      const statusCode = error.response?.status;
      return rejectWithValue({ 
        message: error.message || 'Failed to fetch benefit cards',
        statusCode 
      });
    }
  }
);

const benefitCardsSlice = createSlice({
  name: 'benefitCards',
  initialState,
  reducers: {
    clearBenefitCards: (state) => {
      state.benefitCards = undefined;
      state.error = null;
      state.lastFetched = null;
      state.initialized = false;
    },
    updateBenefitCard: (state, action: PayloadAction<BenefitCardState>) => {
      if (!state.benefitCards) {
        state.benefitCards = [action.payload];
        return;
      }
      const index = state.benefitCards.findIndex(
        benefitCard => benefitCard.id === action.payload.id
      );
      if (index !== -1) {
        state.benefitCards[index] = action.payload;
      } else {
        state.benefitCards.unshift(action.payload);
      }
    },
    addBenefitCard: (state, action: PayloadAction<BenefitCardState>) => {
      if (!state.benefitCards) {
        state.benefitCards = [action.payload];
        return;
      }
      const exists = state.benefitCards.some(
        benefitCard => benefitCard.id === action.payload.id
      );
      if (!exists) {
        state.benefitCards.unshift(action.payload);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedBenefitCardId: (state, action: PayloadAction<string | null>) => {
      state.selectedBenefitCardId = action.payload;
    },
    clearSelectedBenefitCard: (state) => {
      state.selectedBenefitCardId = null;
    },
    scrollToBenefitCard: (state, action: PayloadAction<string>) => {
      state.scrollTargetBenefitCardId = action.payload;
    },
    clearScrollTarget: (state) => {
      state.scrollTargetBenefitCardId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBenefitCards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBenefitCards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.benefitCards = action.payload;
        state.lastFetched = Date.now();
        state.initialized = true;
      })
      .addCase(fetchBenefitCards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch benefit cards';
        state.initialized = true;
      });
  },
});

export const {
  clearBenefitCards,
  updateBenefitCard,
  addBenefitCard,
  clearError,
  setSelectedBenefitCardId,
  clearSelectedBenefitCard,
  scrollToBenefitCard,
  clearScrollTarget,
} = benefitCardsSlice.actions;

// Selectors
export const selectBenefitCards = (state: { benefitCards: BenefitCardsState }) => state.benefitCards.benefitCards;
export const selectBenefitCardsLoading = (state: { benefitCards: BenefitCardsState }) => state.benefitCards.isLoading;
export const selectBenefitCardsError = (state: { benefitCards: BenefitCardsState }) => state.benefitCards.error;
export const selectBenefitCardsInitialized = (state: { benefitCards: BenefitCardsState }) => state.benefitCards.initialized;
export const selectSelectedBenefitCardId = (state: { benefitCards: BenefitCardsState }) => state.benefitCards.selectedBenefitCardId;
export const selectScrollTargetBenefitCardId = (state: { benefitCards: BenefitCardsState }) => state.benefitCards.scrollTargetBenefitCardId;

export default benefitCardsSlice.reducer;
```

### Step 9: Frontend Card Component
Create `application/user-app/src/features/dashboard/loyalty-cards/benefit-card/BenefitCardItem.tsx`:

```typescript
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { BenefitCardDto } from 'e-punch-common-core';
import { appColors } from 'e-punch-common-ui';
import BaseCard from '../../../../components/BaseCard';
import BenefitCardFront from './front/BenefitCardFront';
import { setSelectedBenefitCardId, clearSelectedBenefitCard, scrollToBenefitCard, selectSelectedBenefitCardId } from '../../../benefitCards/benefitCardsSlice';
import { useAppSelector } from '../../../../store/hooks';
import { AppDispatch } from '../../../../store/store';
import styles from './BenefitCardItem.module.css';

interface BenefitAnimationFlags {
  highlighted?: boolean;
}

interface BenefitCardItemProps extends BenefitCardDto {
  interactive?: boolean;
  selectable?: boolean;
  enableAnimations?: boolean;
  
  onAction?: (action: 'select', benefitCardId: string) => void;
  
  animationFlags?: BenefitAnimationFlags;
}

const BenefitCardItem = forwardRef<HTMLDivElement, BenefitCardItemProps>(({
  id,
  itemName,
  merchant,
  expiresAt,
  interactive = true,
  selectable = true,
  enableAnimations = true,
  onAction,
  animationFlags
}, forwardedRef) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const selectedBenefitCardId = useAppSelector(selectSelectedBenefitCardId);
  const isSelected = selectedBenefitCardId === id;
  
  const isHighlighted = enableAnimations && (animationFlags?.highlighted || false);

  const isExpired = Boolean(expiresAt && new Date(expiresAt) < new Date());

  const handleClick = () => {
    if (!interactive || !selectable) return;
    
    if (isExpired) return;
    
    onAction?.(isSelected ? 'select' : 'select', id);
    
    if (isSelected) {
      dispatch(clearSelectedBenefitCard());
    } else {
      if (selectedBenefitCardId) {
        dispatch(clearSelectedBenefitCard());
      }
      dispatch(setSelectedBenefitCardId(id));
      dispatch(scrollToBenefitCard(id));
    }
  };

  const getCardVisualClasses = () => {
    const classes = [];

    if (isSelected && !isExpired) {
      classes.push(styles.scaleUp);
    }

    if (isExpired) {
      classes.push(styles.expired);
    }

    if (isHighlighted) {
      classes.push(styles.scaleUpAndBackToNormalAnimation);
    }

    return classes.join(' ');
  };

  const backgroundColor = appColors.epunchGray;
  const textColor = appColors.epunchBlack;

  const content = (
    <BenefitCardFront
      id={id}
      merchant={merchant}
      itemName={itemName}
      expiresAt={expiresAt}
      isExpired={isExpired}
      isAvailable={!isExpired}
      animationFlags={animationFlags}
    />
  );

  return (
    <BaseCard
      ref={forwardedRef}
      front={content}
      onClick={interactive && !isExpired ? handleClick : undefined}
      className={getCardVisualClasses()}
      disableFlipping={true}
      backgroundColor={backgroundColor}
      textColor={textColor}
    />
  );
});

BenefitCardItem.displayName = 'BenefitCardItem';

export default BenefitCardItem;
```

Create `application/user-app/src/features/dashboard/loyalty-cards/benefit-card/front/BenefitCardFront.tsx`:

```typescript
import { BenefitCardDto } from 'e-punch-common-core';
import styles from './BenefitCardFront.module.css';

interface BenefitCardFrontProps {
  id: string;
  merchant: BenefitCardDto['merchant'];
  itemName: string;
  expiresAt: string | null;
  isExpired: boolean;
  isAvailable: boolean;
  animationFlags?: {
    highlighted?: boolean;
  };
}

const BenefitCardFront: React.FC<BenefitCardFrontProps> = ({
  merchant,
  itemName,
  expiresAt,
  isExpired,
  isAvailable
}) => {
  return (
    <div className={styles.benefitCardFront}>
      <div className={styles.header}>
        <h3 className={styles.merchantName}>{merchant.name}</h3>
        <div className={styles.benefitIcon}>🎁</div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.itemName}>{itemName}</div>
        
        {expiresAt && (
          <div className={`${styles.expiration} ${isExpired ? styles.expired : ''}`}>
            {isExpired ? 'Expired' : 'Expires'}: {new Date(expiresAt).toLocaleDateString()}
          </div>
        )}
        
        {!isAvailable && (
          <div className={styles.status}>Expired</div>
        )}
      </div>
    </div>
  );
};

export default BenefitCardFront;
```

Create `application/user-app/src/features/dashboard/loyalty-cards/benefit-card/BenefitCardItem.module.css`:

```css
.scaleUp {
  transform: scale(1.02);
  transition: transform 0.2s ease-in-out;
}

.expired {
  opacity: 0.6;
  filter: grayscale(50%);
}

.scaleUpAndBackToNormalAnimation {
  animation: scaleUpAndBackToNormal 0.6s ease-in-out;
}

@keyframes scaleUpAndBackToNormal {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```

Create `application/user-app/src/features/dashboard/loyalty-cards/benefit-card/front/BenefitCardFront.module.css`:

```css
.benefitCardFront {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.merchantName {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.benefitIcon {
  font-size: 24px;
}

.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.itemName {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 12px;
}

.expiration {
  font-size: 12px;
  text-align: center;
  opacity: 0.8;
}

.expiration.expired {
  color: #ef4444;
  font-weight: 600;
}

.status {
  font-size: 14px;
  text-align: center;
  font-weight: 600;
  color: #ef4444;
  margin-top: 8px;
}
```

### Step 10: Integration Updates
Update `application/user-app/src/store/store.ts`:

```typescript
// Add import
import benefitCardsReducer from '../features/benefitCards/benefitCardsSlice';

// Add to reducer
export const store = configureStore({
  reducer: {
    auth: authReducer,
    authModal: authModalReducer,
    punchCards: punchCardsReducer,
    bundles: bundlesReducer,
    benefitCards: benefitCardsReducer, // Add this line
    animations: animationReducer,
    signOut: signOutReducer,
    completionOverlay: completionOverlayReducer,
    alert: alertReducer,
    loyaltyPrograms: loyaltyProgramsReducer,
  },
  // ... rest of configuration
});
```

Update `application/user-app/src/features/dashboard/loyalty-cards/LoyaltyCards.tsx`:

```typescript
// Add imports
import BenefitCardItem from './benefit-card/BenefitCardItem';
import type { BenefitCardDto } from 'e-punch-common-core';
import {
  selectBenefitCards,
  selectBenefitCardsError,
  selectBenefitCardsInitialized,
  selectScrollTargetBenefitCardId,
  clearScrollTarget as clearBenefitCardScrollTarget
} from '../../benefitCards/benefitCardsSlice';

// Update component logic
const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
const punchCards = useSelector((state: RootState) => selectPunchCards(state));
const bundles = useSelector((state: RootState) => selectBundles(state));
const benefitCards = useSelector((state: RootState) => selectBenefitCards(state));
const scrollTargetCardId = useSelector((state: RootState) => selectScrollTargetCardId(state));
const scrollTargetBundleId = useSelector((state: RootState) => selectScrollTargetBundleId(state));
const scrollTargetBenefitCardId = useSelector((state: RootState) => selectScrollTargetBenefitCardId(state));
const punchCardsError = useSelector((state: RootState) => selectPunchCardsError(state));
const bundlesError = useSelector((state: RootState) => selectBundlesError(state));
const benefitCardsError = useSelector((state: RootState) => selectBenefitCardsError(state));
const isPunchCardsInitialized = useSelector((state: RootState) => selectPunchCardsInitialized(state));
const isBundlesInitialized = useSelector((state: RootState) => selectBundlesInitialized(state));
const isBenefitCardsInitialized = useSelector((state: RootState) => selectBenefitCardsInitialized(state));

// Update combined state
const isLoading = !isPunchCardsInitialized || (isAuthenticated && !isBundlesInitialized) || (isAuthenticated && !isBenefitCardsInitialized);
const hasError = punchCardsError || bundlesError || benefitCardsError;

// Update allLoyaltyCards
const allLoyaltyCards = useMemo(() => {
  const combined = [
    ...(punchCards?.map((card: PunchCardDto) => ({ type: 'punch_card' as const, ...card })) || []),
    ...(bundles?.map((bundle: BundleDto) => ({ type: 'bundle' as const, ...bundle })) || []),
    ...(benefitCards?.map((benefitCard: BenefitCardDto) => ({ type: 'benefit_card' as const, ...benefitCard })) || [])
  ];
  return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}, [punchCards, bundles, benefitCards]);

// Update scroll effect
useEffect(() => {
  const targetId = scrollTargetCardId || scrollTargetBundleId || scrollTargetBenefitCardId;
  if (targetId && cardRefs.current[targetId]) {
    const cardElement = cardRefs.current[targetId];
    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      const isPartiallyVisible = rect.left < window.innerWidth && rect.right > 0;

      if (!isPartiallyVisible) {
        cardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
    if (scrollTargetCardId) dispatch(clearScrollTarget());
    if (scrollTargetBundleId) dispatch(clearBundleScrollTarget());
    if (scrollTargetBenefitCardId) dispatch(clearBenefitCardScrollTarget());
  }
}, [scrollTargetCardId, scrollTargetBundleId, scrollTargetBenefitCardId, dispatch]);

// Update render logic in AnimatePresence
{item.type === 'punch_card' ? (
  <PunchCardItem
    ref={(el) => {
      cardRefs.current[item.id] = el;
    }}
    {...item}
  />
) : item.type === 'bundle' ? (
  <BundleCardItem
    ref={(el) => {
      cardRefs.current[item.id] = el;
    }}
    {...item}
  />
) : (
  <BenefitCardItem
    ref={(el) => {
      cardRefs.current[item.id] = el;
    }}
    {...item}
  />
)}
```

### Step 11: Merchant Scanner Integration
Create `application/merchant-app/src/features/scanner/components/BenefitCardsTab.tsx`:

```typescript
import React, { useState } from 'react'
import { BenefitCardCreateDto } from 'e-punch-common-core'
import { apiClient } from 'e-punch-common-ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Loader2, Gift } from 'lucide-react'
import { useAppSelector } from '../../../store/hooks'
import { toast } from 'sonner'

interface BenefitCardsTabProps {
  userId: string
  onSuccess: (message: string) => void
}

export const BenefitCardsTab: React.FC<BenefitCardsTabProps> = ({
  userId,
  onSuccess
}) => {
  const merchantId = useAppSelector(state => state.merchant.merchant?.id)
  const [itemName, setItemName] = useState<string>('')
  const [expiresAt, setExpiresAt] = useState<string>('')
  const [isGivingBenefitCard, setIsGivingBenefitCard] = useState(false)
  const [showBenefitCardConfirmation, setShowBenefitCardConfirmation] = useState(false)

  const handleGiveBenefitCard = async () => {
    if (!merchantId || !userId || !itemName.trim()) return
    
    setShowBenefitCardConfirmation(false)
    setIsGivingBenefitCard(true)

    try {
      const benefitCardData: BenefitCardCreateDto = {
        userId,
        merchantId,
        itemName: itemName.trim(),
        expiresAt: expiresAt || undefined
      }
      
      const result = await apiClient.createBenefitCard(benefitCardData)
      const message = `🎁 Benefit card given! ${result.itemName}`
      
      toast.success("Success", {
        description: message,
        duration: 3000,
      })
      onSuccess(message)
      
      // Reset form
      setItemName('')
      setExpiresAt('')
    } catch (error: any) {
      console.error('Give benefit card operation error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Give benefit card operation failed.'
      
      toast.error("Error", {
        description: errorMessage,
        duration: 4000,
      })
    } finally {
      setIsGivingBenefitCard(false)
    }
  }

  const isFormValid = itemName.trim().length > 0

  return (
    <div className="h-full flex flex-col">
      {/* Form */}
      <div className="flex-1 space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="itemName" className="text-sm font-medium">
            Benefit Description *
          </Label>
          <Input
            id="itemName"
            type="text"
            placeholder="e.g., Free Coffee, 10% Discount, Priority Access"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiresAt" className="text-sm font-medium">
            Expiration Date (Optional)
          </Label>
          <Input
            id="expiresAt"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex-shrink-0">
        <AlertDialog open={showBenefitCardConfirmation} onOpenChange={setShowBenefitCardConfirmation}>
          <AlertDialogTrigger asChild>
            <Button 
              className="w-full h-12 text-base"
              disabled={!isFormValid || isGivingBenefitCard}
            >
              {isGivingBenefitCard ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Giving...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Give Benefit Card
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Benefit Card</AlertDialogTitle>
              <AlertDialogDescription>
                Give benefit card: "{itemName}"
                {expiresAt && ` (expires on ${new Date(expiresAt).toLocaleDateString()})`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleGiveBenefitCard}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
```

Update `application/merchant-app/src/features/scanner/components/CustomerScanResult.tsx`:

```typescript
// Add imports
import { Gift } from 'lucide-react'
import { BenefitCardsTab } from './BenefitCardsTab'

// Update state
const [activeTab, setActiveTab] = useState<'punch-cards' | 'bundles' | 'benefit-cards'>('punch-cards')

// Update tab logic - add benefit-cards as an option
const shouldShowTabs = !isLoading && !bundleProgramsLoading && 
  (loyaltyPrograms.length > 0 || activeBundlePrograms.length > 0)

// Add benefit cards tab to TabsList
<TabsList className="grid w-full grid-cols-3 mb-4">
  <TabsTrigger value="punch-cards" className="flex items-center space-x-2">
    <CreditCard className="w-4 h-4" />
    <span>Punch Cards</span>
  </TabsTrigger>
  <TabsTrigger value="bundles" className="flex items-center space-x-2">
    <Package className="w-4 h-4" />
    <span>Bundles</span>
  </TabsTrigger>
  <TabsTrigger value="benefit-cards" className="flex items-center space-x-2">
    <Gift className="w-4 h-4" />
    <span>Benefits</span>
  </TabsTrigger>
</TabsList>

// Add TabsContent for benefit-cards
<TabsContent value="benefit-cards" className="flex-1">
  <BenefitCardsTab
    userId={userId}
    onSuccess={onSuccess}
  />
</TabsContent>

// Update handleTabChange to include benefit-cards
const handleTabChange = (value: string) => {
  const newTab = value as 'punch-cards' | 'bundles' | 'benefit-cards'
  setActiveTab(newTab)
  
  // Clear selections when switching tabs
  if (newTab === 'punch-cards') {
    setSelectedBundleProgramId('')
    setSelectedBundlePresetIndex(0)
  } else if (newTab === 'bundles') {
    setSelectedLoyaltyProgramId('')
  } else if (newTab === 'benefit-cards') {
    setSelectedLoyaltyProgramId('')
    setSelectedBundleProgramId('')
    setSelectedBundlePresetIndex(0)
  }
}
```

### Step 12: Benefit Card Scanning Result
Create `application/merchant-app/src/features/scanner/components/BenefitCardScanResult.tsx`:

```typescript
import React, { useEffect, useState } from 'react'
import { apiClient } from 'e-punch-common-ui'
import { BenefitCardDto } from 'e-punch-common-core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Gift, ArrowLeft, AlertCircle } from 'lucide-react'
import { QRScanResult } from './hooks/useScanner'
import { cn } from '@/lib/cn'

interface BenefitCardScanResultProps {
  data: QRScanResult
  onReset: () => void
  className?: string
}

export const BenefitCardScanResult: React.FC<BenefitCardScanResultProps> = ({
  data,
  onReset,
  className
}) => {
  const [benefitCard, setBenefitCard] = useState<BenefitCardDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBenefitCardData = async () => {
      if (data.parsedData.type !== 'benefit_card_id') return

      setIsLoading(true)
      setError(null)

      try {
        const benefitCardData = await apiClient.getBenefitCardById(data.parsedData.benefit_card_id)
        setBenefitCard(benefitCardData)
      } catch (error: any) {
        console.error('Failed to fetch benefit card data:', error)
        setError(error.response?.data?.message || error.message || 'Failed to load benefit card')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBenefitCardData()
  }, [data.parsedData])

  const getBenefitCardId = () => {
    if (data.parsedData.type === 'benefit_card_id') {
      return data.parsedData.benefit_card_id.substring(0, 8) + '...'
    }
    return 'Unknown'
  }

  const isExpired = benefitCard?.expiresAt && new Date(benefitCard.expiresAt) < new Date()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading benefit card...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("p-4", className)}>
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg text-destructive flex items-center justify-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Error</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardHeader>
          <CardContent>
            <Button onClick={onReset} className="w-full h-12">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!benefitCard) {
    return (
      <div className={cn("p-4", className)}>
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">Benefit Card Not Found</CardTitle>
            <p className="text-sm text-muted-foreground">Scanned benefit card not found</p>
          </CardHeader>
          <CardContent>
            <Button onClick={onReset} className="w-full h-12">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusBadge = () => {
    if (isExpired) return <Badge variant="destructive" className="text-sm px-3 py-1">Expired</Badge>
    return <Badge variant="default" className="text-sm px-3 py-1">Active</Badge>
  }

  return (
    <div className={cn("p-2 sm:p-4 max-h-[90vh] flex flex-col w-full", className)}>
      <Card className="flex-1 flex flex-col w-full">
        <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
          <div className="flex items-center justify-center space-x-3 mb-2 sm:mb-3">
            <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            {getStatusBadge()}
          </div>
          <CardTitle className="text-xl sm:text-2xl text-center">Benefit Card</CardTitle>
          <p className="text-xs sm:text-sm text-center text-muted-foreground">ID: {getBenefitCardId()}</p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6 px-4 sm:px-6">
          <div className="flex-1 space-y-4 sm:space-y-6">
            <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <h4 className="font-medium text-base sm:text-lg">{benefitCard.merchant.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-base sm:text-lg">🎁</span>
                  <p className="text-sm sm:text-base font-medium">
                    {benefitCard.itemName}
                  </p>
                </div>
              </div>
            </div>

            {isExpired && (
              <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center space-x-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium">
                    Expired on {new Date(benefitCard.expiresAt!).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {benefitCard.expiresAt && !isExpired && (
              <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs sm:text-sm text-amber-700">
                  Expires on {new Date(benefitCard.expiresAt).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-700 text-center">
                This is a read-only view. Benefit cards are currently display-only.
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-3 sm:pt-4 mt-auto flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={onReset}
              className="w-full max-w-xs h-12 sm:h-14 text-sm sm:text-base flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Step 13: WebSocket Event Handling
Update `application/user-app/src/hooks/useWebSocketEventHandler.ts`:

```typescript
// Add imports
import { addBenefitCard } from '../features/benefitCards/benefitCardsSlice';

// Add event handling in useEffect
if (appEvent.type === 'BENEFIT_CARD_CREATED') {
  const { benefitCard } = appEvent;
  
  dispatch(addBenefitCard(benefitCard));
  // The AnimatePresence in LoyaltyCards will automatically handle the slide-in animation
}
```

### Step 14: Final Integration
Update `application/backend/src/app.module.ts`:

```typescript
// Add import
import { BenefitCardModule } from './features/benefit-card/benefit-card.module';

// Add to imports array
imports: [
  AppConfigModule,
  DatabaseModule,
  CoreModule,
  AuthModule,
  AdminModule,
  AnalyticsModule,
  BundleProgramModule,
  BundleModule,
  BenefitCardModule, // Add this line
  PunchCardsModule,
  UserModule,
  DevModule,
  LoyaltyModule,
  MerchantModule,
  PunchCardStyleModule,
  IconsModule,
  WebSocketModule,
],
```

Update API client in `application/common-ui/src/apiClient.ts`:

```typescript
// Add benefit card methods
async getUserBenefitCards(userId: string): Promise<BenefitCardDto[]> {
  const response = await this.api.get(`/users/${userId}/benefit-cards`);
  return response.data;
},

async getBenefitCardById(benefitCardId: string): Promise<BenefitCardDto> {
  const response = await this.api.get(`/benefit-cards/${benefitCardId}`);
  return response.data;
},

async createBenefitCard(data: BenefitCardCreateDto): Promise<BenefitCardDto> {
  const response = await this.api.post('/benefit-cards', data);
  return response.data;
},
```

This comprehensive implementation follows the established patterns in your codebase and provides a solid foundation for the benefit cards feature that can be extended in the future.