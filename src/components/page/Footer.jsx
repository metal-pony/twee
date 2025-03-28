import React from 'react';
import classNames from 'classnames';

/**
 *
 * @param {object} props
 * @param {string} props.className
 * @returns
 */
export function Footer({ className, text = '© 2025 jeffgibson.dev' }) {
  return (
    <div id='page-footer' className={classNames('page-footer', className)}>
      {text}
    </div>
  );
}

export default Footer;
