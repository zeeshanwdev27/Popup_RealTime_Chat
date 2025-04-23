import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPopup from './components/ChatPopup/ChatPopup';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatPopup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
