import type { LanguageInput } from "shiki";

const grammarUrl =
  "https://raw.githubusercontent.com/templ-go/templ-vscode/main/syntaxes/templ.tmLanguage.json";

// Function to fetch the grammar file from the URL
async function fetchTemplGrammar(url = grammarUrl): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `[shiki-templ] Network response was not ok: ${response.statusText}`,
    );
  }
  return response.json();
}

// Main function to get the grammar file
async function getTemplGrammar(): Promise<any> {
  try {
    const grammar = await fetchTemplGrammar();
    console.log("[shiki-templ] Fetched the online templ grammar!");
    return grammar;
  } catch (error) {
    console.info(
      "[shiki-templ] Network error, loading the local fallback templ grammar!",
    );
    return null;
  }
}

// Function to construct LanguageInput
async function getTemplLang(): Promise<LanguageInput> {
  const grammar = await getTemplGrammar();
  return {
    name: "templ",
    scopeName: "source.templ",
    ...grammar,
  };
}

export { getTemplGrammar as templGrammar, getTemplLang as templLang };
