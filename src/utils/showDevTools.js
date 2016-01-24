import React from 'react';
import { render } from 'react-dom';
import DevTools from '../view/devTools';

export default function showDevTools(store) {
  const popup = window.open(null, 'Redux DevTools',
    'menubar=no,location=no,resizable=yes,' +
    'scrollbars=no,status=no,width=450,height=5000');

  if (!popup) {
    console.error( // eslint-disable-line no-console
      'Couldn\'t open Redux DevTools due to a popup blocker. ' +
      'Please disable the popup blocker for the current page.'
    );
    return;
  }

  // Reload in case it already exists
  popup.location.reload();

  setTimeout(() => {
    popup.document.write('<div id="react-devtools-root"></div>');
    render(
      <DevTools store={store} />,
      popup.document.getElementById('react-devtools-root')
    );
  }, 10);
}
