module.exports = [
  {
    htmlFile: 'index.html',
    scripts: [
      'shared',
      'index',
    ],
  },
  {
    htmlFile: 'credits.html',
    scripts: [
      'shared',
      'babe',
    ],
  },
  {
    htmlFile: 'auth/login.html',
    scripts: [
      'shared',
      'api',
      'login',
    ],
  },
  {
    htmlFile: 'home.html',
    scripts: [
      'shared',
      'home',
    ],
  },
];
