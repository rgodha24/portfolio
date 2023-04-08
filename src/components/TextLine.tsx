import { Component, For, createSignal, from, onMount } from "solid-js";

const TextLine: Component<{ letters: () => number }> = ({ letters }) => {
   const line = from((set) => {
      const t = setInterval(() => set(generateLine()), 200);
      return () => clearInterval(t);
   });

   function generateLine() {
      let line = "";
      for (let i = 0; i < letters(); i++) {
         line += randomLetter();
      }
      return line;
   }

   return <>{line()}</>;
};

export default TextLine;

function randomLetter() {
   return String.fromCharCode(97 + Math.floor(Math.random() * 26));
}
