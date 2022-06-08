/* eslint-disable @next/next/no-img-element */
// // List of commands that require API calls

import { url } from "inspector";
import { URL } from "url";
import { getProjects } from "../api";
import { getQuote } from "../api";
import { getJoke } from "../api";
import { getReadme } from "../api";
import { getWeather } from "../api";
import { getApod } from "../api";

export const projects = async (args: string[]): Promise<string> => {
   const projects = await getProjects();
   return projects
      .map(
         (repo) =>
            `${repo.name} - <a class="text-light-blue dark:text-dark-blue underline" href="${repo.html_url}" target="_blank">${repo.html_url}</a>`
      )
      .join("\n");
};

export const quote = async (args: string[]): Promise<string> => {
   const data = await getQuote();
   return data.quote;
};

export const joke = async (args: string[]): Promise<string> => {
   const data = await getJoke();
   return data.Joke;
};

export const readme = async (args: string[]): Promise<string> => {
   const readme = await getReadme();
   return `Opening GitHub README...\n
  ${readme}`;
};

export const weather = async (args: string[]): Promise<string> => {
   const city = args.join("+");
   if (!city) {
      return "Usage: weather [city]. Example: weather casablanca";
   }
   const weather = await getWeather(city);
   return weather;
};

export const apod = async (args: string[]): Promise<string> => {
   const apod = await getApod();
   return `date: ${apod.date}\n Topic: ${apod.title}\n Explaination: ${apod.explanation}\n <img src="${apod.url}" alt="new"/> \n `;
};