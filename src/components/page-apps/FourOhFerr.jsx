import React from 'react';
import Page from '../page/Page';

export function FourOhFerr({}) {
  return (
    <Page>
      <h3 className='pt--- light-grey letter-space-3'>
        <i className='fa-solid fa-file-circle-question fa-fade slow-8'></i>&nbsp;404. Page not found.
      </h3>
      <pre className='py grey letter-space-1'>// TODO Create this page</pre>
      <a className='hoverable' href='/'>
        <button className='mt---- p- gold button hoverable border-gold'>
          <i className='fa-solid fa-backward'></i>&nbsp;Go Back
        </button>
      </a>
    </Page>
  );
}

export default FourOhFerr;
