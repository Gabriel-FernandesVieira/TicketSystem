import React from 'react';

const AnimatedOctopus: React.FC = () => {
  return (
    <div className="relative">
      <div className="octopus">
        <div className="eye left"></div>
        <div className="eye right"></div>
        <div className="tentacle"></div>
        <div className="tentacle"></div>
        <div className="tentacle"></div>
        <div className="tentacle"></div>
        <div className="tentacle"></div>
        <div className="tentacle"></div>
        <div className="tentacle"></div>
        <div className="tentacle"></div>
      </div>
      
      <style jsx>{`
        .octopus {
          position: relative;
          width: 100px;
          height: 100px;
          background: #3c83ff;
          border-radius: 50%;
          z-index: 1;
          animation: float 4s ease-in-out infinite;
        }
 
        .eye {
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 35px;
        }
 
        .eye.left { left: 25px; }
        .eye.right { right: 25px; }
 
        .tentacle {
          position: absolute;
          width: 14px;
          height: 40px;
          background: #3c83ff;
          border-radius: 50%;
          animation: wave 2s ease-in-out infinite;
          transform-origin: top center;
        }
 
        .tentacle:nth-child(3) { left: -10px; top: 90px; animation-delay: 0s; }
        .tentacle:nth-child(4) { left: 5px; top: 95px; animation-delay: 0.2s; }
        .tentacle:nth-child(5) { left: 20px; top: 98px; animation-delay: 0.4s; }
        .tentacle:nth-child(6) { left: 35px; top: 100px; animation-delay: 0.6s; }
        .tentacle:nth-child(7) { left: 50px; top: 100px; animation-delay: 0.8s; }
        .tentacle:nth-child(8) { left: 65px; top: 98px; animation-delay: 1s; }
        .tentacle:nth-child(9) { left: 80px; top: 95px; animation-delay: 1.2s; }
        .tentacle:nth-child(10){ left: 95px; top: 90px; animation-delay: 1.4s; }
 
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(20deg); }
        }
 
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedOctopus;