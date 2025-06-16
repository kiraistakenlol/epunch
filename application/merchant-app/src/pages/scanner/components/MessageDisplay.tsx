import React from 'react';
import { EpunchBox, EpunchTypography } from '../../../components/foundational';

interface MessageDisplayProps {
    message: string;
    type: 'error' | 'success';
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {

    return (
        <EpunchBox
            color="#fff"
            p={2}
            borderRadius="8px"
            mt={2}
            textAlign="center"
        >
            <EpunchTypography>{message}</EpunchTypography>
        </EpunchBox>
    );
}; 