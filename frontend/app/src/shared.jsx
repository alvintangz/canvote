import ReactDom from 'react-dom';
import React from 'react';
import Header from './components/shared/header';
import Footer from './components/shared/footer';
import apiBase from './api/base.ts';
import meApi from './api/me.ts';

let currentUser = null;

apiBase.onError((error) => {
  if (error.statusCode === 401) currentUser = null;
});

setInterval(() => {
  meApi.retrieve().then((user) => {
    currentUser = user;
    console.log(currentUser);
  });
}, 2000);


if (document.getElementById('header')) ReactDom.render(<Header />, document.getElementById('header'));
if (document.getElementById('footer')) ReactDom.render(<Footer />, document.getElementById('footer'));
