import { stringifyQuery } from "ufo";

export const getOgURL = (title: string, tags: string[] = []) => {
   const url = "https://og.rohangodha.com/api/og/bTI5cmhib2QybnF1MWo1OnN1bDZsNjg3bQ==";

   const query = {
      pageTitle: title,
      tags: tags.join(" "),
   };

   return `${url}?${stringifyQuery(query)}`;
};
