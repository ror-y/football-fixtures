import React, { useState, useEffect } from "react";
import { render, Text, Box, useInput } from "ink";
// import mockData from "./mock-data";
import axios from "axios";
import { fixuresOptions } from "./request-options";
import Form from "./components/Form";
import Teams from "./components/Teams";

// Disable if you want to test without making API requests.
const isUsingApiData = true;

import LiveScoreMatchesApi, { ILiveScoreMatchData } from "./apis/livescore";
import { MatchMethodsImpl } from "./apis/types";

const App = () => {
  const [error, setError] = useState(false);
  const [activeView, setActiveView] = useState<"teams" | "form">("form");
  const [matchId, setActiveMatchId] = useState<string>("");

  const [api, setApi] = useState<MatchMethodsImpl>();

  // 'Go back' handler if on teams view.
  useInput((_, key) => {
    if (key.delete || key.escape) {
      setActiveView("form");
    }
  });

  useEffect(() => {
    if (isUsingApiData) {
      (async () => {
        const { data }: ILiveScoreMatchData = await axios.request(
          fixuresOptions
        );

        if (data.error) throw new Error(data.error.code);

        const api = new LiveScoreMatchesApi(data);

        if (!api.getMatches()) {
          setError(true);
          return;
        }

        setApi(api);
      })();
    } else {
      // setMatches(mockData);
    }
  }, []);

  if (!api) return null;

  if (error) return <Text>"No PL Games "</Text>;

  const matches = api.getMatches();
  if (!matches) return null;

  return (
    <Box flexDirection="column">
      <Box marginBottom={2}>
        <Text>⚽️ Today's PL Games ⚽️</Text>
      </Box>
      {activeView === "form" && matches.length > 0 && (
        <Form
          api={api}
          handleSelect={({ value }) => {
            setActiveMatchId(value);
            setActiveView("teams");
          }}
          matches={matches}
        />
      )}
      {activeView === "teams" && <Teams matchId={matchId} />}
    </Box>
  );
};

render(<App />);
