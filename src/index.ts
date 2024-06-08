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

    import("path").then((pathModule) => {
      path = pathModule.default;
      __dirname = path.dirname(fileURLToPath(import.meta.url));

      import("fs").then((fsModule) => {
        fs = fsModule.default;
      });
    });
  });
}

// URL of the TextMate grammar file
const grammarUrl =
  "https://raw.githubusercontent.com/templ-go/templ-vscode/main/syntaxes/templ.tmLanguage.json";

// Function to fetch the grammar file from the URL
async function fetchGrammar(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      "[shiki-templ] Network response was not ok " + response.statusText,
    );
  }
  return response.json();
}

// Function to read the grammar file from the local filesystem asynchronously
async function readLocalGrammar(filePath: string): Promise<any> {
  if (!isNode) {
    throw new Error(
      "[shiki-templ] readLocalGrammar can only be used in Node.js environment",
    );
  }
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error(
      `[shiki-templ] Error reading or parsing the file: ${error.message}`,
    );
  }
}

// Main function to get the grammar file with fallback
async function getGrammar(): Promise<any> {
  try {
    const grammar = await fetchGrammar(grammarUrl);
    console.log("[shiki-templ] Fetched the online templ grammar!");
    return grammar;
  } catch (error) {
    console.info(
      "[shiki-templ] Network error, loading the local fallback templ grammar!",
    );

    if (!path || !__dirname || !fs) {
      throw new Error(
        "[shiki-templ] Necessary Node.js modules are not loaded yet.",
      );
    }

    const localGrammarPath = path.join(
      __dirname,
      "..",
      "grammars",
      "templ.tmLanguage.json",
    );
    const localGrammar = await readLocalGrammar(localGrammarPath);
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
