import type { LanguageInput } from "shiki";

declare module "shiki-templ" {
  export const templGrammar: {
    [key: string]: any;
  };

  export const templLang: LanguageInput;
}
