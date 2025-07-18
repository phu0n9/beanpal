//Amazon Transcribe client. Capture the microphone stream and stream it to Amazon Cloud
import {
    TranscribeStreamingClient,
    StartStreamTranscriptionCommand,
  } from "@aws-sdk/client-transcribe-streaming";
  import MicrophoneStream from "microphone-stream";
  import Button from "@mui/material/Button";
  import SettingsVoiceIcon from "@mui/icons-material/SettingsVoice";
  import { Stack } from "@mui/material";
  import React, { useState, forwardRef } from "react";
  import MicIcon from "@mui/icons-material/Mic";
  import { Buffer } from "buffer";
  import Process from "process";
  import { createTheme, ThemeProvider } from "@mui/material/styles";
  
  const theme = createTheme({
    palette: {
      primary: {
        main: "#E3D026",
        light: "#E3D026",
        dark: "#E3D0265",
        contrastText: "#242105",
      },
    },
  });
  
type ITranscribeProps = {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
} & ITranscribeActions

interface ITranscribeActions {
    handleAddRow: (text: string, speaker: string) => void;
}

  const Transcribe = forwardRef(function Transcribe(props: ITranscribeProps) {
    //we need this to support Michrophone stream
    window.process = Process;
    window.Buffer = Buffer;
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [micColor, setMicColor] = useState<any>("primary");
    const [micVisibility, setMicVisibility] = useState("hidden");
    const [isRecording, setIsRecording] = useState(false);
    const LANGUAGE = "en-US";
  
    let microphoneStream = undefined;
  
    const SAMPLE_RATE = 44100;
    let transcribeClient = undefined;
  
    const createMicrophoneStream = async () => {
      microphoneStream = new MicrophoneStream();
      microphoneStream.setStream(
        await window.navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        })
      );
    };
  
    const createTranscribeClient = () => {
      transcribeClient = new TranscribeStreamingClient({
        region: props.region,
        credentials: {
          accessKeyId: props.accessKeyId,
          secretAccessKey: props.secretAccessKey,
        },
      });
    };
  
    const encodePCMChunk = (chunk) => {
      const input = MicrophoneStream.toRaw(chunk);
      let offset = 0;
      const buffer = new ArrayBuffer(input.length * 2);
      const view = new DataView(buffer);
      for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      }
      return Buffer.from(buffer);
    };
  
    const getAudioStream = async function* () {
      for await (const chunk of microphoneStream) {
        if (chunk.length <= SAMPLE_RATE) {
          yield {
            AudioEvent: {
              AudioChunk: encodePCMChunk(chunk),
            },
          };
        }
      }
    };
  
    const startStreaming = async (callback) => {
      const command = new StartStreamTranscriptionCommand({
        LanguageCode: LANGUAGE,
        MediaEncoding: "pcm",
        MediaSampleRateHertz: SAMPLE_RATE,
        AudioStream: getAudioStream(),
      });
  
      const data = await transcribeClient.send(command);
  
      for await (const event of data.TranscriptResultStream) {
        const results = event.TranscriptEvent.Transcript.Results;
        if (results.length && !results[0]?.IsPartial) {
          const newTranscript = results[0].Alternatives[0].Transcript;
          stopRecording();
  
          callback(newTranscript + " ");
        }
      }
    };
  
    const startRecording = async (callback) => {
      setMicVisibility("visible");
      setIsRecording(!isRecording);
      if (microphoneStream || transcribeClient) {
        stopRecording();
      }
      createTranscribeClient();
      createMicrophoneStream();
      await startStreaming(callback);
    };
  
    const stopRecording = function () {
      setMicVisibility("hidden");
      setIsRecording(!isRecording);
      if (microphoneStream) {
        microphoneStream.stop();
        microphoneStream.destroy();
        microphoneStream = undefined;
      }
    };
  
    return (
      <div>
        <ThemeProvider theme={theme}>
          <Stack spacing={2} direction="row" sx={{ m: 2 }}>
            <Button
              variant="contained"
              color={micColor}
              disabled={!props.accessKeyId && !props.secretAccessKey}
              startIcon={<SettingsVoiceIcon />}
              onMouseDown={async (e) => {
                setMicColor("ochre");
                e.preventDefault();
  
                await startRecording(async (callbackText) => {
                  await props.handleAddRow(callbackText, "User");
                });
              }}
              onMouseUp={async (e) => {
                setMicColor("primary");
                e.preventDefault();
                stopRecording();
              }}
            >
              Talk
            </Button>
            <MicIcon
              style={{ fontSize: 20, color: "red" }}
              sx={{ visibility: micVisibility }}
            />
          </Stack>
        </ThemeProvider>
      </div>
    );
  });
  
  export { Transcribe };
  