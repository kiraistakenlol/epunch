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
    console.log('useLoyaltyProgramsSync effect triggered');
    console.log('punchCards:', punchCards);
    console.log('loyaltyPrograms state:', loyaltyPrograms);
    
    if (!punchCards || punchCards.length === 0) {
      console.log('No punch cards, returning early');
      return;
    }

    const requiredLoyaltyProgramIds = [...new Set(
      punchCards.map(card => card.loyaltyProgramId)
    )];
    console.log('Required loyalty program IDs:', requiredLoyaltyProgramIds);

    const missingLoyaltyProgramIds = requiredLoyaltyProgramIds.filter(
      id => !loyaltyPrograms[id]
    );
    console.log('Missing loyalty program IDs:', missingLoyaltyProgramIds);

    if (missingLoyaltyProgramIds.length > 0) {
      console.log('Fetching missing loyalty programs:', missingLoyaltyProgramIds);
      dispatch(fetchLoyaltyPrograms(missingLoyaltyProgramIds));
    } else {
      console.log('All loyalty programs already loaded');
    }
  }, [punchCards, loyaltyPrograms, dispatch]);
}; 