import logo from './assets/smile.png';
import './App.css';
import Pomodoro from './components/Pomodoro';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header pageTitle="Timeado" logoSrc={logo} />
      <Pomodoro />
    </div>
  );
}

export default App;
