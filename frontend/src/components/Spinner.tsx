import React from 'react';
import { IconLoader2 } from '@tabler/icons-react';

interface SpinnerProps {
  spinning: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ spinning }) => {
  return (
    <div className={`spinner-container ${spinning ? 'spin' : ''}`}>
      <IconLoader2 
        size={24}
        className="spinner-icon"
        aria-hidden="true"
      />
    </div>
  );
};

export default Spinner;