// kuromojiUtils.ts
import kuromoji, { Tokenizer, IpadicFeatures } from 'kuromoji';

type WakachiProps = {
  text: string,
  maxLength: number
};

let tokenizerInstance: Tokenizer<IpadicFeatures> | null = null;

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

      tokens.forEach((token: IpadicFeatures) => {
        let word = token.surface_form;
        
        const pos = token.pos;
        // console.log(`Word: ${word}, POS: ${pos}`);

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
          if (tempGroup.length + word.length > maxLength && !(pos === "助詞" || pos === "助動詞" || pos === "接頭詞" || pos === "記号")) {
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
      console.log(groupedWakachi)

      resolve(groupedWakachi);
    });
  });
};
