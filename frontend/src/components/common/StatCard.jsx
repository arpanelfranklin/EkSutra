import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, trend, trendType = 'positive', accentColor, bgColor }) => {
  return (
    <div 
      className="stat-card"
      style={{
        '--stat-accent': accentColor || 'var(--primary-500)',
        '--stat-bg': bgColor || 'var(--primary-50)'
      }}
    >
      <div className="stat-icon-wrapper">
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        {trend && (
          <div className={`stat-trend ${trendType}`}>
            {trendType === 'positive' && <ArrowUpRight size={14} />}
            {trendType === 'negative' && <ArrowDownRight size={14} />}
            {trendType === 'neutral' && <Minus size={14} />}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};
