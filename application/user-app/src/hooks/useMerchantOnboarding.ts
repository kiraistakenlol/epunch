import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { apiClient } from 'e-punch-common-ui';
import { addPunchCard } from '../features/punchCards/punchCardsSlice';
import { selectUserId } from '../features/auth/authSlice';
import { useAppSelector } from '../store/hooks';
import type { AppDispatch } from '../store/store';

export const useMerchantOnboarding = () => {
  const dispatch: AppDispatch = useDispatch();
  const userId = useAppSelector(selectUserId);
  const [searchParams] = useSearchParams();
  const merchantSlug = searchParams.get('merchantSlug');

  useEffect(() => {
    const handleMerchantOnboarding = async () => {
      if (!merchantSlug || !userId) return;
      
      const url = new URL(window.location.href);
      url.searchParams.delete('merchantSlug');
      window.history.replaceState({}, '', url.toString());
      
      try {
        const merchants = await apiClient.getAllMerchants(merchantSlug);
        if (merchants.length === 0) {
          console.warn(`Merchant with slug ${merchantSlug} not found`);
          return;
        }
        
        const merchant = merchants[0];
        const loyaltyPrograms = await apiClient.getMerchantLoyaltyPrograms(merchant.id);
        
        for (const program of loyaltyPrograms) {
          try {
            const newPunchCard = await apiClient.createPunchCard(userId, { 
              userId, 
              loyaltyProgramId: program.id 
            });
            dispatch(addPunchCard(newPunchCard));
          } catch (error) {
            console.log(`Punch card for ${program.name} already exists or creation failed`, error);
          }
        }
        
      } catch (error) {
        console.error('Error during merchant onboarding:', error);
      }
    };

    handleMerchantOnboarding();
  }, [merchantSlug, userId, dispatch]);

  return { merchantSlug };
}; 