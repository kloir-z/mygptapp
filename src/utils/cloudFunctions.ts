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
      console.log(encodeURIComponent(params.url))
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
              "type": "TEXT_DETECTION"
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
        const text = data.responses[0]?.fullTextAnnotation?.text || null;
        return text;
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
  
