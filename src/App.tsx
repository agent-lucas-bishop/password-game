import { useState, useEffect, useRef, useCallback } from 'react';
import { rules, getTodaysMoonEmoji } from './rules';
import './App.css';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function App() {
  const [password, setPassword] = useState('');
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Determine which rules are visible
  const ruleResults = rules.map(rule => ({
    ...rule,
    passed: rule.validate(password),
  }));

  // Find highest consecutive passed rule
  let maxUnlocked = 0;
  for (let i = 0; i < ruleResults.length; i++) {
    if (ruleResults[i].passed) {
      maxUnlocked = i + 1;
    } else {
      break;
    }
  }

  const visibleRules = ruleResults.slice(0, maxUnlocked + 1);
  const allPassed = maxUnlocked === rules.length;
  const chaosLevel = maxUnlocked / rules.length; // 0 to 1

  // Timer
  useEffect(() => {
    if (started && !completed) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [started, completed]);

  // Check completion
  useEffect(() => {
    if (allPassed && started && !completed) {
      setCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [allPassed, started, completed]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!started) setStarted(true);
    setPassword(e.target.value);
  }, [started]);

  const handleShare = () => {
    const text = `🔐 I survived all ${rules.length} rules in The Password Game in ${formatTime(elapsed)}!\n\nCan you beat my time? 🤯`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  const handleRestart = () => {
    setPassword('');
    setStarted(false);
    setElapsed(0);
    setCompleted(false);
    setShowHint(null);
  };

  // Chaos styles based on progress
  const bgHue = chaosLevel * 300;
  const bgSaturation = chaosLevel * 30;
  const tilt = Math.sin(chaosLevel * Math.PI * 4) * chaosLevel * 2;
  const fontScale = 1 + chaosLevel * 0.05;

  const containerStyle: React.CSSProperties = {
    transform: `rotate(${tilt}deg) scale(${fontScale})`,
    transition: 'all 0.5s ease',
  };

  const bgStyle: React.CSSProperties = {
    background: chaosLevel < 0.3
      ? '#ffffff'
      : `hsl(${bgHue}, ${bgSaturation}%, ${98 - chaosLevel * 20}%)`,
    minHeight: '100vh',
    transition: 'background 1s ease',
  };

  if (completed) {
    return (
      <div className="completion-screen">
        <div className="completion-content">
          <h1 className="glitch" data-text="ACCOUNT CREATED">ACCOUNT CREATED</h1>
          <p className="completion-sub">...was it worth it?</p>
          <div className="completion-stats">
            <div className="stat">
              <span className="stat-value">{rules.length}</span>
              <span className="stat-label">Rules Survived</span>
            </div>
            <div className="stat">
              <span className="stat-value">{formatTime(elapsed)}</span>
              <span className="stat-label">Time Wasted</span>
            </div>
            <div className="stat">
              <span className="stat-value">{password.length}</span>
              <span className="stat-label">Characters of Madness</span>
            </div>
          </div>
          <div className="completion-password">
            <p className="password-label">Your "password":</p>
            <p className="password-display">{password}</p>
          </div>
          <div className="completion-actions">
            <button onClick={handleShare} className="btn-share">
              📤 Share My Suffering
            </button>
            <button onClick={handleRestart} className="btn-restart">
              🔄 Torture Me Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={bgStyle}>
      <div className="app" style={containerStyle}>
        <header className={`header ${chaosLevel > 0.5 ? 'header-chaos' : ''}`}>
          <h1 className={chaosLevel > 0.7 ? 'title-glitch' : ''}>
            {chaosLevel > 0.8 ? '̷C̶r̷e̷a̶t̷e̶ ̷A̶n̵ ̷A̶c̶c̵o̵u̸n̷t̸' : 'Create An Account'}
          </h1>
          <p className="subtitle">
            {chaosLevel > 0.6 
              ? 'Please choose a "secure" password 🫠'
              : 'Please choose a secure password'}
          </p>
        </header>

        <div className="form-container">
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
              {started && (
                <span className={`timer ${chaosLevel > 0.5 ? 'timer-chaos' : ''}`}>
                  ⏱ {formatTime(elapsed)}
                </span>
              )}
            </label>
            <textarea
              ref={inputRef}
              id="password"
              className={`password-input ${chaosLevel > 0.5 ? 'input-chaos' : ''}`}
              value={password}
              onChange={handleChange}
              placeholder={chaosLevel > 0.3 ? "good luck..." : "Enter your password"}
              rows={Math.max(2, Math.ceil(password.length / 40))}
              autoFocus
            />
            <div className="input-meta">
              <span>{password.length} characters</span>
              <span>Rule {Math.min(maxUnlocked + 1, rules.length)} of {rules.length}</span>
            </div>
          </div>

          <div className="rules-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(maxUnlocked / rules.length) * 100}%` }}
              />
            </div>
            
            {visibleRules.map((rule, idx) => (
              <div
                key={rule.id}
                className={`rule ${rule.passed ? 'rule-passed' : 'rule-failed'} ${
                  idx === visibleRules.length - 1 && !rule.passed ? 'rule-current' : ''
                } ${chaosLevel > 0.5 && idx > 8 ? 'rule-chaos' : ''}`}
                style={chaosLevel > 0.6 ? {
                  transform: `rotate(${Math.sin(idx * 1.5) * chaosLevel * 3}deg)`,
                  fontFamily: idx > 12 ? ['Comic Sans MS', 'Papyrus', 'Impact', 'cursive'][idx % 4] : undefined,
                } : undefined}
              >
                <span className="rule-icon">{rule.passed ? '✅' : '❌'}</span>
                <span className="rule-text">
                  <span className="rule-number">#{rule.id}</span>
                  {rule.description}
                </span>
                {rule.hint && !rule.passed && (
                  <button 
                    className="hint-btn"
                    onClick={() => setShowHint(showHint === rule.id ? null : rule.id)}
                  >
                    💡
                  </button>
                )}
                {showHint === rule.id && rule.hint && (
                  <div className="hint-text">{rule.hint}</div>
                )}
              </div>
            ))}
          </div>

          {chaosLevel > 0.4 && (
            <p className="chaos-message">
              {chaosLevel > 0.8 ? "WHY ARE YOU STILL HERE" :
               chaosLevel > 0.6 ? "This is fine. Everything is fine. 🔥" :
               "This is getting complicated, isn't it?"}
            </p>
          )}
        </div>

        <footer className="footer">
          <p>Inspired by <a href="https://neal.fun/password-game/" target="_blank" rel="noopener">neal.fun</a> • Today's moon: {getTodaysMoonEmoji()}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
