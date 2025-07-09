import React from 'react';
import { User, X } from 'lucide-react';
import './AuthPrompt.css';

interface AuthPromptProps {
  isVisible: boolean;
  onDismiss: () => void;
  onSignIn: () => void;
}

const AuthPrompt: React.FC<AuthPromptProps> = ({ isVisible, onDismiss, onSignIn }) => {
  if (!isVisible) return null;

  return (
    <div className="auth-prompt">
      <div className="auth-prompt-content">
        <User size={16} strokeWidth={2} />
        <span className="auth-prompt-text">Sign in to sync across devices</span>
        <button className="auth-prompt-action" onClick={onSignIn}>
          Sign In
        </button>
        <button className="auth-prompt-dismiss" onClick={onDismiss}>
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default AuthPrompt; 