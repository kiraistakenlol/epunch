import { dashboardPreviewService, DashboardPreviewParams } from './dashboardPreviewService';
import { PunchCardDto } from 'e-punch-common-core';

// Example 1: Basic dashboard with merchantSlug
export const basicDashboardPreview = (): string => {
  const params: DashboardPreviewParams = {
    merchantSlug: 'test-merchant',
    loyaltyPrograms: []
  };
  
  return dashboardPreviewService.getPreviewUrl(params);
};

// Example 2: Dashboard with custom cards
export const customCardsDashboardPreview = (): string => {
  const mockCards: PunchCardDto[] = [
    {
      id: 'card-1',
      loyaltyProgramId: 'loyalty-1',
      shopName: 'Coffee House',
      shopAddress: '123 Main St',
      currentPunches: 7,
      totalPunches: 10,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      styles: {
        primaryColor: '#8B4513',
        secondaryColor: '#F4E4BC',
        logoUrl: null,
        backgroundImageUrl: null,
        punchIcons: null
      }
    },
    {
      id: 'card-2',
      loyaltyProgramId: 'loyalty-2',
      shopName: 'Pizza Place',
      shopAddress: '456 Oak Ave',
      currentPunches: 10,
      totalPunches: 10,
      status: 'REWARD_READY',
      createdAt: new Date().toISOString(),
      styles: {
        primaryColor: '#FF6B6B',
        secondaryColor: '#FFE5E5',
        logoUrl: null,
        backgroundImageUrl: null,
        punchIcons: null
      }
    }
  ];

  const params: DashboardPreviewParams = {
    cards: mockCards,
    loyaltyPrograms: []
  };
  
  return dashboardPreviewService.getPreviewUrl(params);
};

// Example 3: Dashboard with selected card
export const selectedCardDashboardPreview = (): string => {
  const mockCards: PunchCardDto[] = [
    {
      id: 'card-1',
      loyaltyProgramId: 'loyalty-1',
      shopName: 'Coffee House',
      shopAddress: '123 Main St',
      currentPunches: 7,
      totalPunches: 10,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      styles: {
        primaryColor: '#8B4513',
        secondaryColor: '#F4E4BC',
        logoUrl: null,
        backgroundImageUrl: null,
        punchIcons: null
      }
    },
    {
      id: 'card-2',
      loyaltyProgramId: 'loyalty-2',
      shopName: 'Pizza Place',
      shopAddress: '456 Oak Ave',
      currentPunches: 10,
      totalPunches: 10,
      status: 'REWARD_READY',
      createdAt: new Date().toISOString(),
      styles: {
        primaryColor: '#FF6B6B',
        secondaryColor: '#FFE5E5',
        logoUrl: null,
        backgroundImageUrl: null,
        punchIcons: null
      }
    }
  ];

  const params: DashboardPreviewParams = {
    cards: mockCards,
    selectedCardId: 'card-2', // Card is selected (reward ready)
    loyaltyPrograms: []
  };
  
  return dashboardPreviewService.getPreviewUrl(params);
};

// Example 4: Dashboard with completion overlay
export const completionOverlayDashboardPreview = (): string => {
  const mockCards: PunchCardDto[] = [
    {
      id: 'card-1',
      loyaltyProgramId: 'loyalty-1',
      shopName: 'Coffee House',
      shopAddress: '123 Main St',
      currentPunches: 10,
      totalPunches: 10,
      status: 'REWARD_READY',
      createdAt: new Date().toISOString(),
      styles: {
        primaryColor: '#8B4513',
        secondaryColor: '#F4E4BC',
        logoUrl: null,
        backgroundImageUrl: null,
        punchIcons: null
      }
    }
  ];

  const params: DashboardPreviewParams = {
    cards: mockCards,
    completionOverlayCardId: 'card-1', // Show completion overlay for this card
    loyaltyPrograms: []
  };
  
  return dashboardPreviewService.getPreviewUrl(params);
};

// Example 5: Unauthenticated state
export const unauthenticatedDashboardPreview = (): string => {
  const params: DashboardPreviewParams = {
    merchantSlug: 'test-merchant',
    loyaltyPrograms: []
  };
  
  return dashboardPreviewService.getPreviewUrl(params);
};

// Utility function to test all examples
export const getAllPreviewUrls = () => {
  return {
    basic: basicDashboardPreview(),
    customCards: customCardsDashboardPreview(),
    selectedCard: selectedCardDashboardPreview(),
    completionOverlay: completionOverlayDashboardPreview(),
    unauthenticated: unauthenticatedDashboardPreview()
  };
}; 