import './App.scss'
import Lainaukset from './components/Lainaukset.tsx'
import Kirjautuminen from './components/Kirjautuminen/Kirjautuminen.tsx'
import QRLainaus from './components/QRLainaus.tsx'
import Items from './components/Lisäys.tsx'
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/:bookId" element={<QR />} />
                <Route path="/" element={<Lainaukset />} />
                <Route path="/login" element={<Kirjautuminen/>} />
                <Route path="/admin" element={<Items/>} />
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
