import React from "react";
import type { History } from "./interface";

export const useHistory = (defaultValue: History[]) => {
   const [history, setHistory] = React.useState(defaultValue);
   const [command, setCommand] = React.useState("");
   const [lastCommandIndex, setLastCommandIndex] = React.useState(0);

   return {
      history,
      command,
      lastCommandIndex,
      setHistory: (value: string) =>
         setHistory([
            ...history,
            {
               id: history.length,
               date: new Date(),
               command,
               output: value,
            },
         ]),
      setCommand,
      setLastCommandIndex,
      clearHistory: () => setHistory([]),
   };
};
