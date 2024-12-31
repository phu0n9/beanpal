import React, { useState, useRef } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
// import { Amplify } from "aws-amplify";
// import awsmobile from "../src/aws-export";
// import "@aws-amplify/ui-react/styles.css";

import { alpha, styled } from "@mui/material/styles";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { Transcribe, getChatGPT, getPolly } from "./service";
import AudioPlayer from "./components/AudioFile";
import { SynthesizeSpeechCommandOutput } from "@aws-sdk/client-polly";
import { AWS_SETTINGS } from "./constant";

// Amplify.configure(awsmobile);

function ChatBotPage() {
  const ACCESS_KEY_ID = AWS_SETTINGS.ACCESS_KEY;
  const SECRET_ACCESS_KEY = AWS_SETTINGS.SECRET_KEY;
  // const REGION_NAME = awsmobile.aws_project_region;
  const REGION_NAME = AWS_SETTINGS.REGION_NAME;
  const [rows, setRows] = useState([]);
  const [audioFile, setAudioFile] = useState<SynthesizeSpeechCommandOutput>();
  const ODD_OPACITY = 0.2;
  const childRef = useRef(null);

  //get textual input and convert the text to speech by using Amazon Polly service
  const invokePolly = (text) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await getPolly(
            text,
            ACCESS_KEY_ID,
            SECRET_ACCESS_KEY,
            REGION_NAME
          );
          const results = setAudioFile(response);
          return resolve(results);
        } catch (err) {
          return reject(err);
        }
      })();
    });
  };

  //DataGrid wrapper in order to show alternative style for even records
  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: theme.palette.grey[200],
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
        "@media (hover: none)": {
          backgroundColor: "transparent",
        },
      },
      "&.Mui-selected": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity
        ),
        "&:hover, &.Mui-hovered": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY +
              theme.palette.action.selectedOpacity +
              theme.palette.action.hoverOpacity
          ),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: alpha(
              theme.palette.primary.main,
              ODD_OPACITY + theme.palette.action.selectedOpacity
            ),
          },
        },
      },
    },
  }));

  const columns = [
    {
      field: "col1",
      headerName: "",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Typography sx={{ color: "blue" }}>{params.value} </Typography>
      ),
    },
    { field: "col2", headerName: "History", width: 600, sortable: false },
  ];

  const handleAddRow = async (text, speaker) => {
    setRows((prevRows) => [
      ...prevRows,
      { id: prevRows.length + 1, col1: speaker, col2: text },
    ]);

    if (speaker === "Bot") {
      await invokePolly(text);
    } else {
      //To support continuous conversation, we store the history locally in a Javascript variable.
      const response = await getChatGPT(text);
      await handleAddRow(response, "Bot");
    }
  };

  return (
    <main>
      <AppBar>
        <Toolbar>
          <Transcribe
            accessKeyId={ACCESS_KEY_ID}
            secretAccessKey={SECRET_ACCESS_KEY}
            region={REGION_NAME}
            handleAddRow={handleAddRow}
            ref={childRef}
          />
          <AudioPlayer audioFile={audioFile} />
        </Toolbar>
      </AppBar>

      <div style={{ height: 400, width: "100%", marginTop: "50px" }}>
        <StripedDataGrid
          disableColumnMenu={true}
          rows={rows}
          columns={columns}
          getRowHeight={() => "auto"}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
        />
      </div>
    </main>
  );
}

export default ChatBotPage;
