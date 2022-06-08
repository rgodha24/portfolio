import config from "../../../config.json";

const test = async (args: string[]): Promise<string> => {
   if (config.ascii === "cveinnt") {
      return null;
   } else {
      return `
          Rohan eats Dog Hamburger       
`;
   }
};

export default test;
