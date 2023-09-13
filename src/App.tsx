import './App.scss'
import Lainaukset from './components/Lainaukset.tsx'
import Kirjautuminen from './components/Kirjautuminen/Kirjautuminen.tsx'
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/:bookId" element={<LainauksetContainer />} />
                <Route path="/" element={<LainauksetContainer />} />
                {/* laittakaa tää oikeeseen paikkaan */}
                <Route path="/login" element={<Kirjautuminen/>} />
            </Routes>
        </Router>   

    );    
}

export default App;

// Create a container component to pass the bookId as a prop to Lainaukset
const LainauksetContainer = () => {
    const { bookId } = useParams<{ bookId: string }>();

    return <Lainaukset bookId={bookId} />;
}
