//cloudFunctions.ts
export const getYoutubeTranscript = async (youtubeUrl: string): Promise<string | null> => {
    const endpoint = "https://asia-northeast2-my-pj-20230703.cloudfunctions.net/get_ytb_trans";
    const params = { url: youtubeUrl };
  
    try {
      const response = await fetch(`${endpoint}?url=${params.url}`);
  
      if (response.status === 200) {
        const data = await response.json();
        return data['transcript'];
      } else {
        return `Error: ${response.status}, ${response.statusText}`;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const getMarkdownContent = async (targetUrl: string): Promise<string[] | null> => {
    const endpoint = "https://asia-northeast2-my-pj-20230703.cloudfunctions.net/get_txt_from_url";
    const params = { url: targetUrl };
  
    try {
      const response = await fetch(`${endpoint}?url=${encodeURIComponent(params.url)}`);
  
      if (response.status === 200) {
        const data = await response.json();
        const content: string[] = data['content'];
  
        return content;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  export const getOcrResult = async (imageFile: File, apiKey: string): Promise<string | null> => {
    const imageBase64 = await convertToBase64(imageFile);
    const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  
    const payload = {
      "requests": [
        {
          "image": {
            "content": imageBase64
          },
          "features": [
            {
              "type": "DOCUMENT_TEXT_DETECTION"
            }
          ]
        }
      ]
    };
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (response.status === 200) {
        const data = await response.json();
        const fullTextAnnotation = data.responses[0]?.fullTextAnnotation || null;
        if (fullTextAnnotation) {
          const markdownString = toMarkdown(fullTextAnnotation); // ここでマークダウン変換
          return markdownString;  // マークダウン形式のテキストを返す
        }
        return null;
      } else {
        console.error("Server responded with status:", response.status);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result!.toString().split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const toMarkdown = (fullTextAnnotation: any) => {
    let blockStrings: string[] = [];
  
    const isLikelyHeading = (text: string, x: number, blockXs: number[]) => {
      return !text.endsWith('。') &&
             !text.endsWith('、') &&
             text.length < 20 &&
             blockXs.some(blockX => Math.abs(blockX - x) <= 5);
    };
  
    const formatText = (text: string) => {
      let formattedText = "";
      let tempText = "";
      text.split("。").forEach((sentence: string, index: number, array) => {
        if (sentence) {
          if (tempText.length + sentence.length > 100) {
            formattedText += tempText + "\n";
            tempText = sentence;
          } else {
            tempText += sentence;
          }
          if (index < array.length - 1) {
            tempText += "。"; // Add back the period except for the last sentence
          }
        }
      });
      return formattedText + tempText;
    };
  
    const pages = fullTextAnnotation.pages;
    pages.forEach((page: any) => {
      const blockXs: number[] = [];
      const blocks = page.blocks;
      blocks.forEach((block: any) => {
        let blockText = "";
        const paragraphs = block.paragraphs;
        paragraphs.forEach((paragraph: any) => {
          let paraText = "";
          paragraph.words.forEach((word: any) => {
            word.symbols.forEach((symbol: any) => {
              paraText += symbol.text;
            });
          });
          blockText += paraText; // Accumulate each paragraph text into block text
        });
  
        const vertices = block.boundingBox?.vertices;
        if (vertices && vertices.length === 4) {
          blockXs.push(vertices[0].x);
        }
  
        if (isLikelyHeading(blockText, vertices[0].x, blockXs)) {
          blockStrings.push(`## ${blockText}`);  // Add heading
        } else {
          blockStrings.push(formatText(blockText));  // Add formatted text
        }
      });
    });
  
    // Join block strings without adding a newline after the last block
    return blockStrings.join('\n');
  };
  