import React from 'react';
import './AnimatedOctopus.css';

const AnimatedOctopus: React.FC = () => {
  return (
    <div className="tech-octopus-container">
      {/* Circuit Background */}
      <div className="circuit-bg">
        <svg width="200" height="200" viewBox="0 0 200 200" className="circuit-svg">
          {/* Horizontal lines */}
          <line x1="0" y1="50" x2="200" y2="50" className="circuit-line" />
          <line x1="0" y1="100" x2="200" y2="100" className="circuit-line" />
          <line x1="0" y1="150" x2="200" y2="150" className="circuit-line" />
          
          {/* Vertical lines */}
          <line x1="50" y1="0" x2="50" y2="200" className="circuit-line" />
          <line x1="100" y1="0" x2="100" y2="200" className="circuit-line" />
          <line x1="150" y1="0" x2="150" y2="200" className="circuit-line" />
          
          {/* Circuit nodes */}
          <circle cx="50" cy="50" r="3" className="circuit-node" />
          <circle cx="150" cy="50" r="3" className="circuit-node" />
          <circle cx="50" cy="150" r="3" className="circuit-node" />
          <circle cx="150" cy="150" r="3" className="circuit-node" />
          <circle cx="100" cy="100" r="4" className="circuit-node-main" />
          
          {/* Additional connecting lines */}
          <line x1="25" y1="25" x2="75" y2="75" className="circuit-line" />
          <line x1="125" y1="25" x2="175" y2="75" className="circuit-line" />
          <line x1="25" y1="175" x2="75" y2="125" className="circuit-line" />
          <line x1="125" y1="175" x2="175" y2="125" className="circuit-line" />
        </svg>
      </div>

      {/* Main Octopus */}
      <div className="tech-octopus">
        {/* Head with gradient and shine */}
        <div className="octopus-head">
          <div className="head-shine"></div>
          
          {/* Eyes */}
          <div className="octopus-eye left">
            <div className="eye-pupil"></div>
            <div className="eye-shine"></div>
          </div>
          <div className="octopus-eye right">
            <div className="eye-pupil"></div>
            <div className="eye-shine"></div>
          </div>
        </div>

        {/* Tentacles */}
        <div className="tentacle tentacle-1">
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
        </div>
        
        <div className="tentacle tentacle-2">
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
        </div>
        
        <div className="tentacle tentacle-3">
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
        </div>
        
        <div className="tentacle tentacle-4">
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
        </div>
        
        <div className="tentacle tentacle-5">
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
        </div>
        
        <div className="tentacle tentacle-6">
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
        </div>
        
        <div className="tentacle tentacle-7">
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
        </div>
        
        <div className="tentacle tentacle-8">
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
          <div className="tentacle-segment"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedOctopus;