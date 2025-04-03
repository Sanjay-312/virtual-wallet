import { useState } from 'react'
import React from "react";
import Dashboard from "./pages/Dashboard"
import './App.css'
import './index.css'


function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Dashboard />
    </div>
  );

}

export default App
