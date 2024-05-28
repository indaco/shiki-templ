const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../grammars/templ.tmLanguage.json");
const templGrammar = JSON.parse(fs.readFileSync(grammarPath, "utf-8"));

const templLang = {
  name: "templ",
  scopeName: "source.templ",
  grammar: templGrammar,
};

module.exports = { templGrammar, templLang };
