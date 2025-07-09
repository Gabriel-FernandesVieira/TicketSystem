import React from 'react';
import './AnimatedOctopus.css';

const AnimatedOctopus: React.FC = () => {
  return (
    <div className="tech-octopus-container">
      {/* Circuit Background - exactly like the image */}
      <div className="circuit-background">
        <svg width="300" height="200" viewBox="0 0 300 200" className="circuit-svg">
          {/* Main horizontal lines */}
          <line x1="0" y1="60" x2="300" y2="60" className="circuit-line" />
          <line x1="0" y1="100" x2="300" y2="100" className="circuit-line" />
          <line x1="0" y1="140" x2="300" y2="140" className="circuit-line" />
          
          {/* Vertical connection lines */}
          <line x1="50" y1="40" x2="50" y2="80" className="circuit-line" />
          <line x1="80" y1="80" x2="80" y2="120" className="circuit-line" />
          <line x1="110" y1="40" x2="110" y2="80" className="circuit-line" />
          <line x1="140" y1="80" x2="140" y2="120" className="circuit-line" />
          <line x1="170" y1="40" x2="170" y2="80" className="circuit-line" />
          <line x1="200" y1="80" x2="200" y2="120" className="circuit-line" />
          <line x1="230" y1="40" x2="230" y2="80" className="circuit-line" />
          <line x1="260" y1="80" x2="260" y2="120" className="circuit-line" />
          
          {/* Circuit nodes */}
          <circle cx="50" cy="60" r="3" className="circuit-node" />
          <circle cx="80" cy="100" r="3" className="circuit-node" />
          <circle cx="110" cy="60" r="3" className="circuit-node" />
          <circle cx="140" cy="100" r="3" className="circuit-node" />
          <circle cx="170" cy="60" r="3" className="circuit-node" />
          <circle cx="200" cy="100" r="3" className="circuit-node" />
          <circle cx="230" cy="60" r="3" className="circuit-node" />
          <circle cx="260" cy="100" r="3" className="circuit-node" />
          
          {/* Additional nodes on lines */}
          <circle cx="30" cy="60" r="2" className="circuit-node-small" />
          <circle cx="65" cy="100" r="2" className="circuit-node-small" />
          <circle cx="95" cy="140" r="2" className="circuit-node-small" />
          <circle cx="125" cy="60" r="2" className="circuit-node-small" />
          <circle cx="155" cy="100" r="2" className="circuit-node-small" />
          <circle cx="185" cy="140" r="2" className="circuit-node-small" />
          <circle cx="215" cy="60" r="2" className="circuit-node-small" />
          <circle cx="245" cy="100" r="2" className="circuit-node-small" />
          <circle cx="275" cy="140" r="2" className="circuit-node-small" />
        </svg>
      </div>

      {/* Main Octopus - exactly like the image */}
      <div className="octopus-main">
        {/* Head with glossy blue finish */}
        <div className="octopus-head">
          <div className="head-highlight"></div>
          
          {/* Eyes - white angular eyes like in the image */}
          <div className="octopus-eye left"></div>
          <div className="octopus-eye right"></div>
        </div>

        {/* 8 Tentacles positioned exactly like the image */}
        <div className="tentacle tentacle-1">
          <div className="tentacle-curve"></div>
        </div>
        
        <div className="tentacle tentacle-2">
          <div className="tentacle-curve"></div>
        </div>
        
        <div className="tentacle tentacle-3">
          <div className="tentacle-curve"></div>
        </div>
        
        <div className="tentacle tentacle-4">
          <div className="tentacle-curve"></div>
        </div>
        
        <div className="tentacle tentacle-5">
          <div className="tentacle-curve"></div>
        </div>
        
        <div className="tentacle tentacle-6">
          <div className="tentacle-curve"></div>
        </div>
        
        <div className="tentacle tentacle-7">
          <div className="tentacle-curve"></div>
        </div>
        
        <div className="tentacle tentacle-8">
          <div className="tentacle-curve"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedOctopus;