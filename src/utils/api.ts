import axios from "axios";
import config from "../../config.json";
import { quote } from "./bin";
import { joke } from "./bin";
export const getProjects = async () => {
   const { data } = await axios.get(
      `https://api.github.com/users/${config.social.github}/repos`
   );
   return data;
};

export const getReadme = async () => {
   const { data } = await axios.get(config.readmeUrl);
   return data;
};

export const getWeather = async (city: string) => {
   try {
      const { data } = await axios.get(`https://wttr.in/${city}?ATm`);
      return data;
   } catch (error) {
      return error;
   }
};

export const getQuote = async () => {
   const { data } = await axios.get("https://api.quotable.io/random");
   return {
      quote: `“${data.content}” — ${data.author}`,
   };
};

export const getApod = async () => {
   const { data } = await axios.get(
      "https://api.nasa.gov/planetary/apod?api_key=crrgNbzlAvtSwUVOh3KPIyHvHmgG0tV9VKp8YrBF"
   );
   return data;
};

export const getJoke = async () => {
   const { data } = await axios.get(
      "https://geek-jokes.sameerkumar.website/api?format=json"
   );
   return {
      Joke: `“${data.joke}”`,
   };
};
