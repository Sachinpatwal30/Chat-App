
import {Routes,Route} from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import Homepage from "./pages/Homepage";
import "./app.css"

function App() {
  return (
    <div className="App">

      <Routes >
        <Route  path="/" element={<Homepage />} />
        <Route path="/chats" element={<ChatPage/>} />
      </Routes>
  
    </div>
  );
}

export default App;
