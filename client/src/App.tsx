import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import VideoCallPage from "./VideoCallPage";
import HomePage from "./HomePage";
import ChatBotPage from "./ChatBotPage";

function App() {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const navigate = useNavigate();
  // const id = searchParams.get("id");
  // const WEBSOCKET_URL =
  //   "wss://0919wq6ihk.execute-api.eu-west-1.amazonaws.com/production";
  // const [webSocket, setWebSocket] = useState(null);
  // const ws = new WebSocket(`${WEBSOCKET_URL}?id=${id}`);

  // useEffect(() => {
  //   if (id) {
  //     setWebSocket(ws);

  //     ws.onopen = () => {
  //       console.log("WebSocket connected");
  //     };

  //     ws.onmessage = (event) => {
  //       console.log(event.data);
  //     };

  //     ws.onclose = () => {
  //       console.log("WebSocket closed");
  //     };
  //   } else {
  //     navigate("/");
  //   }
  //   return () => {
  //     ws.close();
  //   };
  // }, []);

  return (
    <Router>
      <Routes>
        <Route path="/video" element={<VideoCallPage />} />
        <Route path="/bot" element={<ChatBotPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
