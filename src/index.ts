import type { LanguageInput } from "shiki";

// Check if running in Node.js environment
const isNode = typeof window === "undefined";

let __dirname: string;
let fileURLToPath: (url: string | URL) => string;
let fs: typeof import("fs");
let path: typeof import("path");

if (isNode) {
  import("url").then((urlModule) => {
    fileURLToPath = urlModule.fileURLToPath;
  });

  import("path").then((pathModule) => {
    path = pathModule.default;
    __dirname = path.dirname(fileURLToPath(import.meta.url));
  });

  import("fs").then((fsModule) => {
    fs = fsModule.default;
  });
}

// URL of the TextMate grammar file
const grammarUrl =
  "https://raw.githubusercontent.com/templ-go/templ-vscode/main/syntaxes/templ.tmLanguage.json";

// Function to fetch the grammar file from the URL
async function fetchGrammar(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }
  return response.json();
}

// Function to read the grammar file from the local filesystem
function readLocalGrammar(filePath: string): any {
  if (!isNode) {
    throw new Error("readLocalGrammar can only be used in Node.js environment");
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Main function to get the grammar file with fallback
async function getGrammar(): Promise<any> {
  try {
    const grammar = await fetchGrammar(grammarUrl);
    console.log("Fetched the online templ grammar!");
    return grammar;
  } catch (error) {
    console.info("Network error, loading the local fallback templ grammar!");
    const localGrammarPath = path.join(
      __dirname,
      "..",
      "grammars",
      "templ.tmLanguage.json",
    );
    const localGrammar = readLocalGrammar(localGrammarPath);
    return localGrammar;
  }
}

const templGrammarPromise = getGrammar();

const templLangPromise: Promise<LanguageInput> = templGrammarPromise.then(
  (grammar) => ({
    name: "templ",
    scopeName: "source.templ",
    ...grammar,
  }),
);

export { templGrammarPromise as templGrammar, templLangPromise as templLang };
