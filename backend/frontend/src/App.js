import logo from './logo.svg';
import './App.css';

function App() {
  return (
     <>
      <Router>
        <div className="container">
        <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer/>
    </>
  );
}

export default App;
