/**
 * @type {import('prettier').Options}
 */
module.exports = {
   plugins: [require.resolve("prettier-plugin-astro")],
   overrides: [
      {
         files: "*.astro",
         options: {
            parser: "astro",
         },
      },
   ],
   useTabs: false,
   arrowParens: "always",
   bracketSpacing: true,
   tabWidth: 3,
   singleQuote: false,
   printWidth: 100,
};
