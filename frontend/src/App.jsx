import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPopup from './components/ChatPopup/ChatPopup';

import PublicRoute from './components/PublicRoute.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

import SignUp from './sign-up/SignUp.jsx';
import SignIn from './sign-in/SignIn.jsx';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<PublicRoute><ChatPopup /></PublicRoute>} />
        <Route path="/sign-in" element={<PublicRoute><SignIn /></PublicRoute>} />
        <Route path="/sign-up" element={<PublicRoute><SignUp /></PublicRoute>} />

        {/* Private route */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      </Routes>
    </Router>
  );
}

export default App;
