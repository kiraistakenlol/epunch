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

    const requiredLoyaltyProgramIds = [...new Set(
      punchCards.map(card => card.loyaltyProgramId)
    )];

    const missingLoyaltyProgramIds = requiredLoyaltyProgramIds.filter(
      id => !loyaltyPrograms[id]
    );

    if (missingLoyaltyProgramIds.length > 0) {
      dispatch(fetchLoyaltyPrograms(missingLoyaltyProgramIds));
    }
  }, [punchCards, loyaltyPrograms, dispatch]);
}; 