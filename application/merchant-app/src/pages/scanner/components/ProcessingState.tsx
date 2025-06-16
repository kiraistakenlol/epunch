import React from 'react';
import { EpunchBox, EpunchTypography, EpunchProgress } from '../../../components/foundational';

export const ProcessingState: React.FC = () => {
    return (
        <EpunchBox textAlign="center" py={4}>
            <EpunchProgress />
            <EpunchTypography color="light">
                Processing...
            </EpunchTypography>
        </EpunchBox>
    );
}; 