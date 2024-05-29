import fs from "fs";
import path from "path";
import { LanguageRegistration } from "shiki";
import { fileURLToPath } from "url";

// __dirname polyfill
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const grammarPath = path.join(__dirname, "../grammars/templ.tmLanguage.json");
const templGrammar = JSON.parse(fs.readFileSync(grammarPath, "utf-8"));

const templLang: LanguageRegistration = {
  name: "templ",
  scopeName: "source.templ",
  ...templGrammar,
};

export { templGrammar, templLang };
