//Amazon Polly client
import { PollyClient, SynthesizeSpeechCommand, SynthesizeSpeechCommandInput, SynthesizeSpeechCommandOutput } from "@aws-sdk/client-polly";

export async function getPolly(
  text,
  accessKey,
  secretKey,
  regionName
): Promise<SynthesizeSpeechCommandOutput> {
  const client = new PollyClient({
    region: regionName,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
  });

  const input = {
    Engine: 'neural',
    OutputFormat: "mp3",
    SampleRate: "16000",
    Text: text,
    TextType: "text",
    LanguageCode: "en-US",
    VoiceId: "Danielle",
  } as SynthesizeSpeechCommandInput;

  const command = new SynthesizeSpeechCommand(input);
  const response = await client.send(command);
  return response;
}
