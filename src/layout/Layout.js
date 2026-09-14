import React from 'react';

import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';

export const Layout = ({ children }) => (
  <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    <main id="main">{children}</main>
    <Footer />
  </>
);
