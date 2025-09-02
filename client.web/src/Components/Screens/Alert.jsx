import React, { memo } from 'react';
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiInfo,
  FiX
} from 'react-icons/fi';
import '../Styles/Alert.css';

const Alert = memo(({ status = 'info', message = 'Something happened', onClose }) => {
  const iconMap = {
    success: <FiCheckCircle className="success-svg" />,
    alert: <FiAlertTriangle className="alert-svg" />,
    error: <FiXCircle className="error-svg" />,
    info: <FiInfo className="info-svg" />,
  };

  return (
    <div className={`popup ${status}-popup alert-fixed`}>
      <div className={`popup-icon ${status}-icon`}>
        {iconMap[status]}
      </div>

      <div className={`${status}-message`}>
        {message}
      </div>

      <div className="popup-icon close-icon" onClick={onClose}>
        <FiX className="close-svg" />
      </div>
    </div>
  );
});

export default Alert;
