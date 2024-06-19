import reactLogo from "./assets/react.svg";
import "./App.css";
import TypingSpeedTester from "./components/TypingSpeedTester/TypingSpeedTester";

function App() {
  return (
    <>
      <div className="d-flex align-items-center justify-content-center gap-5">
        <h1>Typing Speed Tester in React</h1>
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <TypingSpeedTester />
    </>
  );
}

export default App;
