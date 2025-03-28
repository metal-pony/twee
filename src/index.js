import React from 'react';
import { createRoot } from 'react-dom/client';

import Home from './components/page-apps/Home.jsx';
import Game from './components/page-apps/Game.jsx';
import FourOhFerr from './components/page-apps/FourOhFerr.jsx';

import './styles/index.scss';

const dataComponentAttr = 'data-component';
Array.from(document.getElementsByTagName('div'))
.filter(div => div.hasAttribute(dataComponentAttr))
.forEach(div => {
  const component = div.getAttribute(dataComponentAttr);
  console.log(`Found div with [${dataComponentAttr}="${component}"]`);

  switch(component) {
    case 'app-home':
      console.log('Rendering <Home />');
      createRoot(div).render(<Home />);
      break;
    case 'app-game':
      console.log('Rendering <Game />');
      createRoot(div).render(<Game />);
      break;
    case 'page-404':
      console.log('Rendering <FourOhFerr />');
      createRoot(div).render(<FourOhFerr />);
      break;
    default:
      console.warn(`No such component ${component}`);
      return;
  }
});
