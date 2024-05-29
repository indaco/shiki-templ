import fs from "fs";
import path from "path";
import { LanguageRegistration } from "shiki";
import { fileURLToPath } from "url";

// __dirname polyfill
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// URL of the TextMate grammar file
const grammarUrl =
  "https://raw.githubusercontent.com/templ-go/templ-vscode/main/syntaxes/templ.tmLanguage.json";

// Path to the local TextMate grammar file
const localGrammarPath = path.join(
  __dirname,
  "..",
  "grammars",
  "templ.tmLanguage.json",
);

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
    const localGrammar = readLocalGrammar(localGrammarPath);
    return localGrammar;
  }
}

const templGrammarPromise = getGrammar();

const templLangPromise: Promise<LanguageRegistration> =
  templGrammarPromise.then((grammar) => ({
    name: "templ",
    scopeName: "source.templ",
    ...grammar,
  }));

export { templGrammarPromise as templGrammar, templLangPromise as templLang };
