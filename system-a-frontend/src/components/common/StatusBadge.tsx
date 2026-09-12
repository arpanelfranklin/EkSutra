import React from 'react';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const norm = (status || '').toUpperCase();

  if (norm === 'ELIGIBILITY_VERIFIED' || norm === 'APPROVED' || norm === 'VERIFIED') {
    return (
      <span className="status-badge verified">
        <CheckCircle2 size={13} />
        {norm === 'ELIGIBILITY_VERIFIED' ? 'Eligibility Verified' : norm}
      </span>
    );
  }

  if (norm === 'RECEIVED' || norm === 'SUBMITTED' || norm === 'LOCAL_ONLY') {
    return (
      <span className="status-badge received">
        <Clock size={13} />
        Received (Local)
      </span>
    );
  }

  if (norm === 'ON_HOLD' || norm === 'PENDING') {
    return (
      <span className="status-badge on-hold">
        <Clock size={13} />
        {norm.replace('_', ' ')}
      </span>
    );
  }

  if (norm === 'NOT_ELIGIBLE' || norm === 'REJECTED' || norm === 'FAILED') {
    return (
      <span className="status-badge" style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 16, fontSize: '0.78rem', fontWeight: 700 }}>
        <AlertTriangle size={13} />
        {norm === 'NOT_ELIGIBLE' ? 'Not Eligible' : norm.replace('_', ' ')}
      </span>
    );
  }

  return (
    <span className="status-badge received">
      {status || 'Unknown'}
    </span>
  );
};
