import React from 'react';
import { Laptop, Tablet, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { allProblems } from '../data/sheets';

interface MobileNoticeProps {
  onBypass: () => void;
}

export const MobileNotice: React.FC<MobileNoticeProps> = ({ onBypass }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#07090e',
        color: '#f8fafc',
        padding: '16px',
        boxSizing: 'border-box',
        zIndex: 9999,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '320px',
          margin: '0 auto',
          backgroundColor: '#0b0f19',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '20px 16px',
          boxSizing: 'border-box',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Brand Icon Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src="/favicon.svg" alt="DSA Sheets Tracker Logo" style={{ width: '48px', height: '48px' }} />
          </div>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: '17px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: '0 0 8px 0',
          }}
        >
          Desktop & Tablet Recommended
        </h1>

        {/* Device Badges */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '12px',
            fontSize: '11px',
            color: '#a5b4fc',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(30, 27, 75, 0.6)',
              border: '1px solid rgba(67, 56, 202, 0.4)',
            }}
          >
            <Laptop style={{ width: '13px', height: '13px' }} /> Laptop / PC
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(30, 27, 75, 0.6)',
              border: '1px solid rgba(67, 56, 202, 0.4)',
            }}
          >
            <Tablet style={{ width: '13px', height: '13px' }} /> Tablet
          </span>
        </div>

        {/* Main Explanation */}
        <p
          style={{
            fontSize: '12px',
            lineHeight: 1.5,
            color: '#cbd5e1',
            margin: '0 0 16px 0',
          }}
        >
          DSA Sheets Tracker is engineered for focused technical interview practice with multi-sheet comparison, complexity notes, and spaced repetition.
        </p>

        {/* Instructions Card */}
        <div
          style={{
            backgroundColor: '#07090e',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '12px',
            textAlign: 'left',
            marginBottom: '16px',
            fontSize: '11px',
            color: '#cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <ShieldCheck style={{ width: '15px', height: '15px', color: '#34d399', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#ffffff' }}>Best use case:</strong> Open on your computer, laptop, or tablet.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Sparkles style={{ width: '15px', height: '15px', color: '#fbbf24', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#ffffff' }}>Quick tip on phone:</strong> Request <span style={{ color: '#a5b4fc', fontWeight: 500 }}>&quot;Desktop site&quot;</span> in browser settings.
            </div>
          </div>
        </div>

        {/* Action Button to bypass */}
        <button
          onClick={onBypass}
          style={{
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '9px 12px',
            borderRadius: '10px',
            backgroundColor: '#1e293b',
            color: '#f1f5f9',
            fontSize: '11px',
            fontWeight: 600,
            border: '1px solid #334155',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          <span>Continue in compact mobile view</span>
          <ArrowRight style={{ width: '13px', height: '13px' }} />
        </button>
      </div>

      <div style={{ marginTop: '16px', fontSize: '11px', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
        DSA Sheets Tracker • {allProblems.length.toLocaleString()} Canonical Problems
      </div>
    </div>
  );
};
