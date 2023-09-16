//useAPI.ts(仮)
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
      console.log(encodeURIComponent(params.url))
      const response = await fetch(`${endpoint}?url=${encodeURIComponent(params.url)}`);
  
      if (response.status === 200) {
        const data = await response.json();
        const content: string[] = data['content'];  // 配列として受け取る
  
        return content;
      } else {
        return null;  // エラーが発生した場合はnullを返す
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  export const getOcrResult = async (imageFile: File): Promise<string | null> => {
    const imageBase64 = await convertToBase64(imageFile);
    const endpoint = "https://jpn-ocr-api-7eeyyyomqq-dt.a.run.app/get_ocr";
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_base64: imageBase64 })
      });
  
      // レスポンスボディを文字列として取得し、コンソールに出力
      const responseBody = await response.text();
      console.log("Server Response:", responseBody);
  
      // ステータスコードが200かどうかを確認
      if (response.status === 200) {
        // 応答をJSONに変換（すでに文字列を読み取った後なので、ここで再度fetchする必要がある）
        const data = JSON.parse(responseBody);
        return data['text'];
      } else {
        console.error("Server responded with status: ", response.status);
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