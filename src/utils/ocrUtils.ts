export const mergeImages = async (imageFiles: File[]): Promise<Blob | null> => {
    const imageElements: HTMLImageElement[] = [];
    const gap = 50;
  
    for (const file of imageFiles) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      await new Promise<HTMLImageElement>((resolve) => {
        img.onload = () => resolve(img);
      });
      imageElements.push(img);
      URL.revokeObjectURL(url);
    }
  
    let totalWidth = 0;
    let maxHeight = 0;
    for (const img of imageElements) {
      totalWidth += img.width;
      maxHeight = Math.max(maxHeight, img.height);
    }
    
    totalWidth += gap * (imageElements.length - 1);
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    canvas.width = totalWidth;
    canvas.height = maxHeight;
  
    let xOffset = 0;
    for (const img of imageElements) {
      ctx.drawImage(img, xOffset, 0);
      xOffset += img.width + gap;
    }
  
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob));
    });
  };
  
  export const blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return new File([theBlob], fileName, { type: theBlob.type });
  };
  