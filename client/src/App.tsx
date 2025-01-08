import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import VideoCallPage from "./VideoCallPage";
import HomePage from "./HomePage";
import ChatBotPage from "./ChatBotPage";
import { useSearchParams } from "react-router-dom";
import { AWS_SETTINGS } from "./constant";

type Status = "left" | "joined" | "connected";
interface IParticipant {
  id: string;
  status: Status;
}

function App() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const WEBSOCKET_URL = AWS_SETTINGS.WEBSOCKET_URL;
  const [participantList, setParticipantList] = useState<Array<IParticipant>>(
    []
  );
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`${WEBSOCKET_URL}?id=${id}`);
    ws.current.onopen = () => console.log("ws opened");

    ws.current.onclose = () => console.log("ws closed");

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, [id]);

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if ('participant_list' in message) setParticipantList(JSON.parse(message.participant_list));
      // else if ('last_accessed' in message) 
    };
  }, []);

  const renderApp = () => {
    const currentParticipant = participantList.filter((data) => data.id === id);
    const activeParticipants = participantList.filter((data) => data.status != 'left' && data.id !== id).length > 0;

    if (currentParticipant.at(0).status == "left" || !id) return <HomePage />;

    if (
      currentParticipant.at(0).status == "connected" ||
      currentParticipant.at(0).status == "joined"
    )
      if (activeParticipants) return <VideoCallPage />;
      else return <ChatBotPage />;
  };

  return <>{renderApp()}</>;
}

export default App;
