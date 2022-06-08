// List of commands that do not require API calls

import * as bin from "./index";
import config from "../../../config.json";
import { Router } from "next/router";

// Help
export const help = async (args: string[]): Promise<string> => {
   const commands = Object.keys(bin).sort().join(", ");
   var c = "";
   for (let i = 1; i <= Object.keys(bin).sort().length; i++) {
      if (i % 7 === 0) {
         c += Object.keys(bin).sort()[i - 1] + "\n";
      } else {
         c += Object.keys(bin).sort()[i - 1] + " ";
      }
   }
   return `Welcome! Here are all the available commands:
\n${c}\n
[tab]: trigger completion.
[ctrl+l]/clear: clear terminal.\n
Type 'sumfetch' to display summary.
`;
};

// Redirection
export const repo = async (args: string[]): Promise<string> => {
   window.open(`${config.repo}`);
   return "Opening Github repository...";
};

// About
export const about = async (args: string[]): Promise<string> => {
   return `Hi, I am ${config.name}. 
Welcome to my website!
More about me:
'sumfetch' - short summary.
'readme' - my github readme.`;
};

// Contact
export const email = async (args: string[]): Promise<string> => {
   window.open(`mailto:${config.email}`);
   return `Opening mailto:${config.email}...`;
};

export const github = async (args: string[]): Promise<string> => {
   window.open(`https://github.com/${config.social.github}/`);

   return "Opening github...";
};

export const instagram = async (args: string[]): Promise<string> => {
   window.open(`https://instagram.com/${config.social.instagram}/`);

   return "Opening instagram...";
};

// Search

// Typical linux commands
export const echo = async (args: string[]): Promise<string> => {
   return args.join(" ");
};

export const whoami = async (args: string[]): Promise<string> => {
   return `${config.ps1_username}`;
};

export const ls = async (args: string[]): Promise<string> => {
   return `a
bunch
of
fake
directories`;
};

export const resume = async (): Promise<string> => {
   window.open(config.resume);

   return "Opening resume...";
};

// Banner
export const banner = (args?: string[]): string => {
   return ` 
	${config.bannerASCII}
Type 'help' to see the list of available commands.
Type 'sumfetch' to display summary.
Type 'repo' or click <u><a class="text-light-blue dark:text-dark-blue underline" href="${config.repo}" target="_blank">here</a></u> for the Github repository.
`;
};
