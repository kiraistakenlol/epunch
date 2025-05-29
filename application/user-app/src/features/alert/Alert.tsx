import React from 'react';
import { useSelector } from 'react-redux';
import { selectAlert } from './alertSlice';
import { RootState } from '../../store/store';
import styles from './Alert.module.css';

const Alert: React.FC = () => {
  const alert = useSelector((state: RootState) => selectAlert(state));

  if (!alert.visible || !alert.content) return null;

  return (
    <div className={styles.alert}>
      {alert.content}
    </div>
  );
};

export default Alert; 