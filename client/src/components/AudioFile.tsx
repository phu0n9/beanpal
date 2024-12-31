//custom AudioPlayer component to support Polly
import { SynthesizeSpeechCommandOutput } from "@aws-sdk/client-polly";
import React, { useRef, useEffect } from "react";

export const  AudioPlayer = ({audioFile}: {audioFile: SynthesizeSpeechCommandOutput})=>{

  const audioRef = useRef(null);
  
  useEffect(() => {
    (async () => {
      try {
     if (audioFile)
       {
        const audioArrayBuffer =  await audioFile.AudioStream.transformToByteArray();
        const audioURL = URL.createObjectURL(new Blob([audioArrayBuffer],{type: "audio/mpeg"}));
        const audio=audioRef.current;
        audio.src = audioURL;
        audio.play();
        return ()=>{
            URL.revokeObjectURL(audioURL);
        }

       }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [audioFile]);


return (
    <div>
        <audio ref={audioRef} autoPlay controls ></audio>
    </div>
)

}
export default AudioPlayer