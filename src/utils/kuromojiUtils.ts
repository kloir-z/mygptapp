// kuromojiUtils.ts
import kuromoji, { Tokenizer, IpadicFeatures } from 'kuromoji';

type WakachiProps = {
  text: string,
  maxLength: number
};

let tokenizerInstance: Tokenizer<IpadicFeatures> | null = null;

// 括弧のマッピング
const openingBrackets = new Set(["(", "（", "[", "［", "{", "｛", "<", "＜", "【", "「", "『", "〈", "《", "〔"]);
const closingBrackets = new Set([")", "）", "]", "］", "}", "｝", ">", "＞", "】", "」", "』", "〉", "》", "〕"]);

export const getWakachi = async ({ text, maxLength }: WakachiProps): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: "/kuromojidict" }).build((err: any, tokenizer: Tokenizer<IpadicFeatures>) => {
      if (err) {
        reject(err);
        return;
      }

      const tokens = tokenizer.tokenize(text);

      let groupedWakachi: string[] = [];
      let tempGroup = "";
      let isInParenthesis = false;
      let currentParenthesisLength = 0;
      const maxParenthesisLength = 6;

      tokens.forEach((token: IpadicFeatures) => {
        let word = token.surface_form;

        if (openingBrackets.has(word)) {
          isInParenthesis = true;
          currentParenthesisLength = 0;
        }

        const pos = token.pos;
        const isSpecialChar = word.includes("\n") || word.includes("。") || word.includes("、");

        if (isSpecialChar) {
          word = word.trim().replace(/^#+/g, '').replace(/^ *-+/g, '');
          tempGroup += word;
          if (tempGroup !== "") {
            groupedWakachi.push(tempGroup);
          }
          tempGroup = "";
        } else {
          word = word.trim().replace(/^#+/g, '').replace(/^ *-+/g, '');

          if (isInParenthesis) {
            tempGroup += word;
            currentParenthesisLength += word.length;

            if (closingBrackets.has(word)) {
              isInParenthesis = false;
              if (tempGroup) {
                groupedWakachi.push(tempGroup);
              }
              tempGroup = "";
              currentParenthesisLength = 0;
            } else if (currentParenthesisLength > maxParenthesisLength) {
              if (tempGroup) {
                groupedWakachi.push(tempGroup);
              }
              tempGroup = "";
              currentParenthesisLength = 0;
            }
          } else if (tempGroup.length + word.length > maxLength && !(pos === "助詞" || pos === "助動詞" || pos === "接頭詞" || pos === "記号")) {
            if (tempGroup) {
              groupedWakachi.push(tempGroup);
            }
            tempGroup = word;
          } else {
            tempGroup += word;
          }
        }
      });

      if (tempGroup) {
        groupedWakachi.push(tempGroup);
      }

      resolve(groupedWakachi);
    });
  });
};
