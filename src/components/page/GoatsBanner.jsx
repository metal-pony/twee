import React from 'react';

const eartags = [
  'MAXIMALLY CAFFEINATED',
  'FRESHLY SQUEEZED',
  'SALE! SALE! SALE!',
  'FRESHLY PICKED',
  'OOOH SHINY',
  'YAAAAASSS',
];

const subtexts = [
  'Fabricator of software, and software-like substances',
];

const randomEartag = () => eartags[Math.floor(Math.random() * eartags.length)];
const randomSubtext = () => subtexts[Math.floor(Math.random() * subtexts.length)];

export function GoatsBanner({}) {
  return (
    <div id='goats-banner' className='w-full'>
      <div className='center'>
        <a href='/'>
          <p className='pt btn-shine slow-16 text-center'>
            <span className='flex-vertical'>
              <span id='goats-banner-eartag' className='goats-eartag'>{ randomEartag() }</span>
              <span id='goats-banner-name' className='goats'>
                <span className='first'>JEFF</span>
                GIBS0N
                <span className='ext'>.dev</span>
              </span>
            </span>
            <span id='goats-banner-subtext' className='right goats-subtext'>{ randomSubtext() }</span>
          </p>
        </a>
      </div>
    </div>
  );
}

export default GoatsBanner;
