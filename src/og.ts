import { stringifyQuery } from "ufo";

export const getOgURL = (title: string, tags: string[] = []) => {
   const url = "https://og.rohangodha.com/api/og/bTI5cmhib2QybnF1MWo1OjlicWFhNW1pZQ==";

   const query = {
      pageTitle: title,
      tags: tags.join(" "),
   };

   return `${url}?${stringifyQuery(query)}`;
};
