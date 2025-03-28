import React from 'react';
import classNames from 'classnames';
import NavBar from './NavBar';
import GoatsBanner from './GoatsBanner';
import Footer from './Footer';

/**
 *
 * @param {object} props
 * @param {boolean} props.includeNav
 * @param {boolean} props.includeGoats
 * @param {boolean} props.includeFooter
 * @param {import('./NavBar').NavLink[]} props.navLinks
 * @param {string[]} props.className
 * @param {} props.children
 * @returns
 */
export function Page({
  includeNav = true,
  includeGoats = true,
  includeFooter = true,
  navLinks = [],
  className,
  children
}) {
  return (
    <div className={classNames('page', className)}>
      { includeGoats && (<GoatsBanner />) }
      { includeNav && (<NavBar className='pt--' links={navLinks} />) }
      { children }
      { includeFooter && (<Footer className='sticky dark-grey' />) }
    </div>
  );
}

export default Page;
