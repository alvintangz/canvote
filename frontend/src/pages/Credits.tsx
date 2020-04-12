import React from 'react';

function Credits() {
    return (
        <div>
            <h1> Credits </h1>
            <p> Although this project using many <code>npm</code> packages, the primary focus here are third party packages which the application would not be possible without. </p>

            <h3> Frontend </h3>
            <ul>
                <li><a href="https://wet-boew.github.io/wet-boew/index-en.html">Web Experience Toolkit (WET), a Government of Canada Framework</a></li>
                <li> <a href="https://gionkunz.github.io/chartist-js/">Chartist for Graphs</a> </li>
                <li> <a href="https://docs.mapbox.com/">Mapbox for Maps</a> </li>
                <li> <a href="https://www.apollographql.com/docs/react/">Apollo GraphQL Client</a> </li>
                <li> Icons </li>
                <ul>
                <li> <a href="https://fontawesome.com/icons?d=gallery">Font Awesome Icons</a> </li>
                <li> <a href="https://favicon.io/emoji-favicons/maple-leaf/">Favicons, for the Maple Leaf icon in our logo</a> </li>
                <li> <a href="https://getbootstrap.com/docs/3.3/components/">Glyphicons</a> </li> 
                </ul>
            </ul>

            <hr/>
            <h3> Backend (Authentication Service) </h3>
            <ul>
                <li> <a href="https://github.com/tiangolo/fastapi">FastAPI</a> </li>
                <li> <a href="https://www.mailgun.com/">MailGun for Emailing</a> </li>
            </ul>

            <hr/>
            <h3> Backend (Voting Service) </h3>
            <ul>
                <li> <a href="https://www.apollographql.com/docs/apollo-server/">Apollo GraphQL Server</a> </li>
            </ul>

        </div>
    );
}

export default Credits;
