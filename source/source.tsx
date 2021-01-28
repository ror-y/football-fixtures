import React, { useState, useEffect } from "react";
import { render, Text, Box, useInput } from "ink";
import mockData from "./mock-data";
import axios from "axios";

const requestOptions = require("./request-options");
const utils = require("./utils");

const { fixuresOptions, matchOptions } = requestOptions;
const { getTime, getShirtColours, getBlobs } = utils;

import SelectInput from "ink-select-input";

// Disable if you want to test without making API requests.
const isUsingApiData = true;

const Form = ({ matches, handleSelect }) => {
  return (
    <SelectInput
      items={matches.map((match) => {
        const home = match.T1[0];
        const away = match.T2[0];

        const time = getTime(match.Esd);

        const [homePrimaryColour] = getShirtColours(home);
        const [awayPrimaryColour] = getShirtColours(away);

        const [homeBlob] = getBlobs(homePrimaryColour);
        const [awayBlob] = getBlobs(awayPrimaryColour);

        return {
          label: `${time} ${homeBlob}${" "}${home.Nm} vs ${
            away.Nm
          } ${awayBlob}`,
          value: match.Eid,
        };
      })}
      onSelect={handleSelect}
    />
  );
};

const TeamList = ({ formation, names }) => {
  return (
    <Box flexDirection="column" marginRight={5}>
      {formation && <Text>({formation}):</Text>}
      {names.map((name, idx) => (
        <Text key={idx}>{name}</Text>
      ))}
    </Box>
  );
};

const Teams = ({ matchId }) => {
  const [homeNames, setHomeNames] = useState();
  const [awayNames, setAwayNames] = useState();

  const [homeFormation, setHomeFormation] = useState();
  const [awayFormation, setAwayFormation] = useState();

  const getNames = (obj) => {
    return obj.Ps.map((player) =>
      player.Pon === "SUBSTITUTE_PLAYER" || player.Pon === "COACH"
        ? ""
        : player.Snm
    );
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios.request(matchOptions(matchId));
      if (data.error) throw new Error(data.error);

      setHomeNames(getNames(data.Lu[0]));
      setAwayNames(getNames(data.Lu[1]));

      const hFormation = data.Lu[0].Fo;
      const aFormation = data.Lu[1].Fo;

      if (hFormation) {
        setHomeFormation(hFormation.join("-"));
      }

      if (aFormation) {
        setAwayFormation(aFormation.join("-"));
      }
    })();
  }, []);

  return !homeNames || !awayNames ? null : (
    <Box flexDirection="column">
      <Box>
        <TeamList formation={homeFormation} names={homeNames} />
        <TeamList formation={awayFormation} names={awayNames} />
      </Box>
      <Box marginTop={2}>
        <Text>Press Backspace or ESC to go back</Text>
      </Box>
    </Box>
  );
};

const App = () => {
  const [error, setError] = useState(false);
  const [matches, setMatches] = useState();
  const [activeView, setActiveView] = useState("form"); // "teams" | "form"
  const [matchId, setActiveMatchId] = useState();

  // 'Go back' handler if on teams view.
  useInput((_, key) => {
    if (key.delete || key.escape) {
      setActiveView("form");
    }
  });

  useEffect(() => {
    if (isUsingApiData) {
      (async () => {
        const { data } = await axios.request(fixuresOptions);

        if (data.error) throw new Error(data.error);

        const premierLeagueObject = data.Stages.find(
          (stage) => stage.Scd === "premier-league" && stage.Ccd === "england"
        );

        if (!premierLeagueObject) {
          setError(true);
          return;
        }

        const matches = premierLeagueObject.Events;

        setMatches(matches);
      })();
    } else {
      // setMatches(mockData);
    }
  }, []);

  if (error) return <Text>"No PL Games "</Text>

  if (!matches) return null;

  return (
    <Box flexDirection="column">
      <Box marginBottom={2}>
        <Text>⚽️ Today's PL Games ⚽️</Text>
      </Box>
      {activeView === "form" && (
        <Form
          matches={matches}
          handleSelect={({ label, value }) => {
            setActiveMatchId(value);
            setActiveView("teams");
          }}
        />
      )}
      {activeView === "teams" && <Teams matchId={matchId} />}
    </Box>
  );
};

// tslint:disable-next-line
render(<App />);
