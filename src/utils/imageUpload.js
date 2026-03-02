import axios from 'axios';

export const imageUpload = async ( images ) => {
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();
    formData.append("file", item);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PRESET_TRIP);
    formData.append( "cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME );
    
    const response = await axios.post(process.env.NEXT_PUBLIC_CLOUD_API, formData);

    const data = await response.data;

    const generateAlt = (data) => {
      const result1 = data.split('life-trip/')
      const result = result1.join(" ")

      const res2 = result.split('_')
      const res3 = res2.join(" ")
      return res3
    }

    const alt = await generateAlt(data.public_id)
    imgArr.push({ 
      public_id: data.public_id, 
      url: data.secure_url, 
      alt: alt,
      width: data.width,
      height: data.height,
      format: data.format,
      size: data.bytes
    });
  }

  return imgArr;
}

export const sigleImage = async ( images ) => {
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();
    formData.append("file", item);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PRESET_BLOG);
    formData.append( "cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME );
    
    const response = await axios.post(process.env.NEXT_PUBLIC_CLOUD_API, formData);

    const data = await response.data;

    const generateAlt = (data) => {
      const result1 = data.split('life-blog/')
      const result = result1.join("")

      const res2 = result.split('_')
      const res3 = res2.join(" ")
      return res3
    }

    const alt = await generateAlt(data.public_id)

    imgArr.push({ public_id: data.public_id, url: data.secure_url, alt: alt });
  }

  return imgArr;
};