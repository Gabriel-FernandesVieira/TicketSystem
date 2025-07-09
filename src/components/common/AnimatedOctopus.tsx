import React from 'react';
import './AnimatedOctopus.css';

const AnimatedOctopus: React.FC = () => {
  return (
    <div className="relative">
      <div className="octopus">
        <div className="octopus-eye left"></div>
        <div className="octopus-eye right"></div>
        <div className="octopus-tentacle"></div>
        <div className="octopus-tentacle"></div>
        <div className="octopus-tentacle"></div>
        <div className="octopus-tentacle"></div>
        <div className="octopus-tentacle"></div>
        <div className="octopus-tentacle"></div>
        <div className="octopus-tentacle"></div>
        <div className="octopus-tentacle"></div>
      </div>
    </div>
  );
};

export default AnimatedOctopus;