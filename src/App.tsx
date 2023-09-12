import QRCode from 'qrcode.react';
import './App.scss'
import Lainaukset from './components/Lainaukset.tsx'
import QRLainaus from './components/QRLainaus.tsx'
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/:bookId" element={<QR />} />
                <Route path="/" element={<Lainaukset />} />
            </Routes>
        </Router>
    );
}

export default App;

// Create a container component to pass the bookId as a prop to Lainaukset
const QR = () => {
    const { bookId } = useParams<{ bookId: string }>();

    return <QRLainaus bookId={bookId} />;
}
