export async function getRepoReadme(repo: string): Promise<string> {
   const url = `https://api.github.com/repos/${repo}/readme`;

   const response = await fetch(url, {
      headers: {
         Accept: "application/vnd.github.raw",
      },
   });

   if (!response.ok) {
      throw new Error(`Failed to fetch README: ${response.statusText}`);
   }

   const readme = await response.text();
   return readme;
}
