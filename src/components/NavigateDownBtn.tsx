export default function NavigateDownBtn() {
   const title = document.getElementById("title")!; 
   return (
      <div class="absolute left-50% bottom-2% fill-slate-300 transform-center">
         <button
            onClick={() => {
               window.scroll({
                  top: window.innerHeight,
                  behavior: "smooth",
               });
            }}
         >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
               <path d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4l-6 6Z" />
            </svg>
         </button>
      </div>
   );
}
