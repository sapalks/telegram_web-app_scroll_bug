import logo from "./logo.svg";
import "./App.css";
import { useCallback } from "react";
import Audio from "./Audio/Audio";
import React from "react";

function App() {
  const arr = new Array(200).fill(<div>1</div>);
  const onClick = useCallback(() => {
    const app = document.getElementsByClassName("App")[0];
    if (app.classList.contains("bad-scroll")) {
      app.classList.remove("bad-scroll");
    } else {
      app.classList.add("bad-scroll");
    }
  }, []);
  return (
    <div className="App">
      <Audio />
      <header className="App-header">
        <button onClick={onClick}>Change scroll mode</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {arr}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
