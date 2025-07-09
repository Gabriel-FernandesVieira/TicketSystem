import React from 'react';

const AnimatedOctopus: React.FC = () => {
  return (
    <div className="relative w-16 h-16 mx-auto">
      <svg
        width="64"
        height="64"
        viewBox="0 0 100 100"
        className="animate-bounce-in"
      >
        {/* Octopus Body */}
        <ellipse
          cx="50"
          cy="35"
          rx="20"
          ry="15"
          fill="#3b82f6"
          className="drop-shadow-lg"
        />
        
        {/* Eyes */}
        <circle cx="45" cy="30" r="3" fill="white" />
        <circle cx="55" cy="30" r="3" fill="white" />
        <circle cx="45" cy="30" r="1.5" fill="#1e40af" />
        <circle cx="55" cy="30" r="1.5" fill="#1e40af" />
        
        {/* Eye highlights */}
        <circle cx="46" cy="29" r="0.5" fill="white" />
        <circle cx="56" cy="29" r="0.5" fill="white" />
        
        {/* Tentacle 1 - Front Left */}
        <path
          d="M35 45 Q30 55 25 65 Q20 70 25 75 Q30 70 35 65"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
          className="animate-pulse"
          style={{
            animation: 'tentacle1 3s ease-in-out infinite',
            transformOrigin: '35px 45px'
          }}
        />
        
        {/* Tentacle 2 - Front Right */}
        <path
          d="M65 45 Q70 55 75 65 Q80 70 75 75 Q70 70 65 65"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
          style={{
            animation: 'tentacle2 3.5s ease-in-out infinite',
            transformOrigin: '65px 45px'
          }}
        />
        
        {/* Tentacle 3 - Left */}
        <path
          d="M30 40 Q20 50 15 60 Q10 65 15 70 Q20 65 25 60"
          fill="none"
          stroke="#2563eb"
          strokeWidth="3.5"
          strokeLinecap="round"
          style={{
            animation: 'tentacle3 2.8s ease-in-out infinite',
            transformOrigin: '30px 40px'
          }}
        />
        
        {/* Tentacle 4 - Right */}
        <path
          d="M70 40 Q80 50 85 60 Q90 65 85 70 Q80 65 75 60"
          fill="none"
          stroke="#2563eb"
          strokeWidth="3.5"
          strokeLinecap="round"
          style={{
            animation: 'tentacle4 3.2s ease-in-out infinite',
            transformOrigin: '70px 40px'
          }}
        />
        
        {/* Tentacle 5 - Back Left */}
        <path
          d="M40 48 Q35 58 30 68 Q25 73 30 78 Q35 73 40 68"
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            animation: 'tentacle5 2.5s ease-in-out infinite',
            transformOrigin: '40px 48px'
          }}
        />
        
        {/* Tentacle 6 - Back Right */}
        <path
          d="M60 48 Q65 58 70 68 Q75 73 70 78 Q65 73 60 68"
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            animation: 'tentacle6 2.7s ease-in-out infinite',
            transformOrigin: '60px 48px'
          }}
        />
        
        {/* Tentacle 7 - Center Left */}
        <path
          d="M45 50 Q40 60 35 70 Q30 75 35 80 Q40 75 45 70"
          fill="none"
          stroke="#1e40af"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            animation: 'tentacle7 3.8s ease-in-out infinite',
            transformOrigin: '45px 50px'
          }}
        />
        
        {/* Tentacle 8 - Center Right */}
        <path
          d="M55 50 Q60 60 65 70 Q70 75 65 80 Q60 75 55 70"
          fill="none"
          stroke="#1e40af"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            animation: 'tentacle8 3.1s ease-in-out infinite',
            transformOrigin: '55px 50px'
          }}
        />
        
        {/* Suction cups on tentacles */}
        <circle cx="28" cy="62" r="1.5" fill="#60a5fa" opacity="0.7">
          <animate attributeName="r" values="1.5;2;1.5" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="72" cy="62" r="1.5" fill="#60a5fa" opacity="0.7">
          <animate attributeName="r" values="1.5;2;1.5" dur="2.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="18" cy="65" r="1" fill="#60a5fa" opacity="0.6">
          <animate attributeName="r" values="1;1.5;1" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="82" cy="65" r="1" fill="#60a5fa" opacity="0.6">
          <animate attributeName="r" values="1;1.5;1" dur="2.1s" repeatCount="indefinite" />
        </circle>
      </svg>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes tentacle1 {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-5deg) scale(1.05); }
          50% { transform: rotate(3deg) scale(0.95); }
          75% { transform: rotate(-2deg) scale(1.02); }
        }
        
        @keyframes tentacle2 {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(5deg) scale(1.05); }
          50% { transform: rotate(-3deg) scale(0.95); }
          75% { transform: rotate(2deg) scale(1.02); }
        }
        
        @keyframes tentacle3 {
          0%, 100% { transform: rotate(0deg) scale(1); }
          30% { transform: rotate(-8deg) scale(1.1); }
          60% { transform: rotate(4deg) scale(0.9); }
        }
        
        @keyframes tentacle4 {
          0%, 100% { transform: rotate(0deg) scale(1); }
          30% { transform: rotate(8deg) scale(1.1); }
          60% { transform: rotate(-4deg) scale(0.9); }
        }
        
        @keyframes tentacle5 {
          0%, 100% { transform: rotate(0deg) scale(1); }
          40% { transform: rotate(-6deg) scale(1.08); }
          80% { transform: rotate(3deg) scale(0.92); }
        }
        
        @keyframes tentacle6 {
          0%, 100% { transform: rotate(0deg) scale(1); }
          40% { transform: rotate(6deg) scale(1.08); }
          80% { transform: rotate(-3deg) scale(0.92); }
        }
        
        @keyframes tentacle7 {
          0%, 100% { transform: rotate(0deg) scale(1); }
          35% { transform: rotate(-4deg) scale(1.06); }
          70% { transform: rotate(2deg) scale(0.94); }
        }
        
        @keyframes tentacle8 {
          0%, 100% { transform: rotate(0deg) scale(1); }
          35% { transform: rotate(4deg) scale(1.06); }
          70% { transform: rotate(-2deg) scale(0.94); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedOctopus;