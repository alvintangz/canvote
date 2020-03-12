import React, {Component} from 'react';

const Header = () => (
<header>
<div className="container">
  <div className="row">
    <div className="brand col-xs-5 col-md-4">
      CanVote
    </div>
    <div className="col-lg-8 text-right">
      <button onClick={() => window.location.href="/auth/login.html"} className="btn btn-primary">Log in</button>
      
    </div>
  </div>
</div>
</header>
 );

export default Header;
