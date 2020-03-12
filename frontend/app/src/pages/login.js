import SignIn from '../components/signin'
import ReactDom from 'react-dom';

if (document.getElementById('header')) ReactDom.render(<SignIn />, document.getElementById('header'));
