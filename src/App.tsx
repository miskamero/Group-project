import './App.scss'
import Lainaukset from './components/Lainaukset.tsx'
import Kirjautuminen from './components/Kirjautuminen/Kirjautuminen.tsx'
import QRLainaus from './components/QRLainaus.tsx'
import Items from './components/Lisäys.tsx'
import Rekisteröinti from './components/Kirjautuminen/Rekisteröinti.tsx'
import QRscanner from './components/QRscanner.tsx'
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';


const App = () => {
    
    return (
        <Router>
            <Routes>
                <Route path="/:bookId" element={<QR />} />
                <Route path="/" element={<Lainaukset />} />
                <Route path="/login" element={<Kirjautuminen/>} />
                <Route path="/signup" element={<Rekisteröinti/>} />
                <Route path="/admin" element={<Items />} />
                <Route path="/qr" element={<QRscanner />} />
            </Routes>
        </Router>   

    );    
}

export default App;

// Create a container component to pass the bookId as a prop to Lainaukset
const QR = () => {
    const { bookId } = useParams<{ bookId: string }>();

    return <QRLainaus bookId={bookId ?? ''} />;
}
