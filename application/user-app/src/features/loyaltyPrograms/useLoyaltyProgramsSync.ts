import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { selectPunchCards } from '../punchCards/punchCardsSlice';
import { selectLoyaltyPrograms, fetchLoyaltyPrograms } from './loyaltyProgramsSlice';

export const useLoyaltyProgramsSync = () => {
  const dispatch = useDispatch<AppDispatch>();
  const punchCards = useSelector((state: RootState) => selectPunchCards(state));
  const loyaltyPrograms = useSelector((state: RootState) => selectLoyaltyPrograms(state));

  useEffect(() => {
    if (!punchCards || punchCards.length === 0) {
      return;
    }

    // Get unique loyalty program IDs from punch cards
    const requiredLoyaltyProgramIds = [...new Set(
      punchCards.map(card => card.loyaltyProgramId)
    )];

    // Find missing loyalty programs (not yet loaded)
    const missingLoyaltyProgramIds = requiredLoyaltyProgramIds.filter(
      id => !loyaltyPrograms[id]
    );

    // Fetch missing loyalty programs
    if (missingLoyaltyProgramIds.length > 0) {
      console.log('Fetching missing loyalty programs:', missingLoyaltyProgramIds);
      dispatch(fetchLoyaltyPrograms(missingLoyaltyProgramIds));
    }
  }, [punchCards, loyaltyPrograms, dispatch]);
}; 