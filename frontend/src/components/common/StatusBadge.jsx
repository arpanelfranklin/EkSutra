import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;
  const s = status.toUpperCase();

  if (s === 'APPROVED' || s === 'ELIGIBILITY_VERIFIED' || s === 'ELIGIBLE') {
    return (
      <span className="badge badge-verified">
        <span className="badge-dot"></span>
        {s === 'ELIGIBILITY_VERIFIED' ? 'Verified' : s}
      </span>
    );
  }

  if (s === 'ON_HOLD' || s === 'PENDING') {
    return (
      <span className="badge badge-on_hold">
        <span className="badge-dot"></span>
        {s === 'ON_HOLD' ? 'On Hold' : 'Pending'}
      </span>
    );
  }

  if (s === 'REJECTED' || s === 'INELIGIBLE') {
    return (
      <span className="badge badge-rejected">
        <span className="badge-dot"></span>
        {s === 'REJECTED' ? 'Rejected' : 'Ineligible'}
      </span>
    );
  }

  return (
    <span className="badge" style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
      {status}
    </span>
  );
};
