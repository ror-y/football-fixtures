"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const ink_1 = require("ink");
const axios_1 = __importDefault(require("axios"));
const requestOptions = require("./request-options");
const utils = require("./utils");
const { fixuresOptions, matchOptions } = requestOptions;
const { getTime, getShirtColours, getBlobs } = utils;
const ink_select_input_1 = __importDefault(require("ink-select-input"));
// Disable if you want to test without making API requests.
const isUsingApiData = true;
const Form = ({ matches, handleSelect }) => {
    return (react_1.default.createElement(ink_select_input_1.default, { items: matches.map((match) => {
            const home = match.T1[0];
            const away = match.T2[0];
            const time = getTime(match.Esd);
            const [homePrimaryColour] = getShirtColours(home);
            const [awayPrimaryColour] = getShirtColours(away);
            const [homeBlob] = getBlobs(homePrimaryColour);
            const [awayBlob] = getBlobs(awayPrimaryColour);
            return {
                label: `${time} ${homeBlob}${" "}${home.Nm} vs ${away.Nm} ${awayBlob}`,
                value: match.Eid,
            };
        }), onSelect: handleSelect }));
};
const TeamList = ({ formation, names }) => {
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginRight: 5 },
        formation && react_1.default.createElement(ink_1.Text, null,
            "(",
            formation,
            "):"),
        names.map((name, idx) => (react_1.default.createElement(ink_1.Text, { key: idx }, name)))));
};
const Teams = ({ matchId }) => {
    const [homeNames, setHomeNames] = react_1.useState();
    const [awayNames, setAwayNames] = react_1.useState();
    const [homeFormation, setHomeFormation] = react_1.useState();
    const [awayFormation, setAwayFormation] = react_1.useState();
    const getNames = (obj) => {
        return obj.Ps.map((player) => player.Pon === "SUBSTITUTE_PLAYER" || player.Pon === "COACH"
            ? ""
            : player.Snm);
    };
    react_1.useEffect(() => {
        (async () => {
            const { data } = await axios_1.default.request(matchOptions(matchId));
            if (data.error)
                throw new Error(data.error);
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
    return !homeNames || !awayNames ? null : (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(TeamList, { formation: homeFormation, names: homeNames }),
            react_1.default.createElement(TeamList, { formation: awayFormation, names: awayNames })),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Text, null, "Press Backspace or ESC to go back"))));
};
const App = () => {
    const [error, setError] = react_1.useState(false);
    const [matches, setMatches] = react_1.useState();
    const [activeView, setActiveView] = react_1.useState("form"); // "teams" | "form"
    const [matchId, setActiveMatchId] = react_1.useState();
    // 'Go back' handler if on teams view.
    ink_1.useInput((_, key) => {
        if (key.delete || key.escape) {
            setActiveView("form");
        }
    });
    react_1.useEffect(() => {
        if (isUsingApiData) {
            (async () => {
                const { data } = await axios_1.default.request(fixuresOptions);
                if (data.error)
                    throw new Error(data.error);
                const premierLeagueObject = data.Stages.find((stage) => stage.Scd === "premier-league" && stage.Ccd === "england");
                if (!premierLeagueObject) {
                    setError(true);
                    return;
                }
                const matches = premierLeagueObject.Events;
                setMatches(matches);
            })();
        }
        else {
            // setMatches(mockData);
        }
    }, []);
    if (error)
        return react_1.default.createElement(ink_1.Text, null, "\"No PL Games \"");
    if (!matches)
        return null;
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { marginBottom: 2 },
            react_1.default.createElement(ink_1.Text, null, "\u26BD\uFE0F Today's PL Games1 \u26BD\uFE0F")),
        activeView === "form" && (react_1.default.createElement(Form, { matches: matches, handleSelect: ({ label, value }) => {
                setActiveMatchId(value);
                setActiveView("teams");
            } })),
        activeView === "teams" && react_1.default.createElement(Teams, { matchId: matchId })));
};
// tslint:disable-next-line
ink_1.render(react_1.default.createElement(App, null));
