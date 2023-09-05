import './App.scss'
import ReactDOM from 'react-dom';
import {QRCodeSVG} from 'qrcode.react';

const App = () => { 
  return (
    <>
    <div>
    <header>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Log In</a></li>
        </ul>
      </nav>
    </header>
        <p>
          This is a starter template for React, TypeScript, and Webpack. It
          includes:
        </p>
        <ul>
          <li>React</li>
          <li>TypeScript</li>
          <li>Webpack</li>
          <li>SCSS</li>
          <li>ESLint</li>
          <li>Prettier</li>
          <li>Stylelint</li>
          <li>PostCSS</li>
          <li>Autoprefixer</li>
          <li>React Refresh</li>
          <li>React Router</li>
          <li>React Helmet</li>
          <li>React Icons</li>
        </ul>
        <p>
          <a href="https://github.com/miskamero/Group-project" target="_blank" rel="noopener noreferrer" >
            GitHub Project Site
            </a>
        </p>
        <QRCodeSVG value="https://reactjs.org/" />
      </div>
    </>
  )
}

export default App;
