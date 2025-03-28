import React from 'react';
import classNames from 'classnames';

/**
 * @typedef {object} NavLink
 * @property {string} id
 * @property {string?} name
 * @property {string} href
 * @property {string} iconClass
 * @property {boolean?} active
 */

/**
 *
 * @param {object} props
 * @param {NavLink[]} props.links
 * @param {string[]} props.className
 * @returns
 */
export function NavBar({
  links = [],
  className
}) {
  return (
    <div className={classNames('nav-bar center', className)}>
      {
        links.map((link, i) => {
          return (
            <React.Fragment key={`navlink-${link.id}`}>
              <a
                id={link.id}
                className={classNames('nav-link', { active: link.active })}
                href={link.href}
              >
                <i className={link.icon}></i> {link.name || ''}
              </a>
              { (i < (links.length - 1)) ? '/' : '' }
            </React.Fragment>
          );
        })
      }
    </div>
  );
}

export default NavBar;
