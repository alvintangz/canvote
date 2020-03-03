import ReactDom from 'react-dom';
import React from 'react';
import Header from './components/shared/header';
import Footer from './components/shared/footer';

if (document.getElementById('header')) ReactDom.render(<Header />, document.getElementById('header'));
if (document.getElementById('footer')) ReactDom.render(<Footer />, document.getElementById('footer'));
