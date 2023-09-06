// import fs from "fs"; 

export const textToImage = async (name: string, description: string, mood: string) => {
  const path =
    "https://api.stability.ai/v1/generation/stable-diffusion-512-v2-1/text-to-image";

  const headers = {
    "content-type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SD_KEY}`,
    "Access-Control-Allow-Origin": "http://localhost:3000/",
  };

  // demo prompt: Tanjiro, donned in his iconic Demon Slayer attire, dashes through a moonlit forest. His Nichirin Blade is drawn, glinting brilliantly in the soft moonlight. The forest comes alive in the ethereal glow of the moon, casting enchanting shadows amidst the trees. Tanjiro's expression conveys both determination and urgency as he journeys deeper into the mysterious, moonlit woods, ready to confront the lurking darkness.
  // prompt format: Generate an image of [Character], [one or two sentences describing the character's activity]. The character should be [constant description, e.g., in a casual outfit] and situated in a [constant background description, e.g., urban street] with [constant background elements, e.g., buildings, trees]. Ensure that the image captures the essence of [constant mood or emotion, e.g., excitement] and maintains a [constant artistic style, e.g., vibrant colors].
  // using above text and function parameter create prompt for text to image

  const prompt = `Generate an image of ${name}, ${description} The character should be in his/her regular outfit. Ensure that the image captures the essence of ${mood} and maintains a vibrant colors.`;

  console.log('prompt', prompt);

  const body = {
    steps: 30,
    width: 512,
    height: 512,
    seed: 0,
    cfg_scale: 5,
    samples: 1,
    text_prompts: [
      {
        text: prompt,
        weight: 1,
      },
      {
        text: "out of frame, lowres, text, error, cropped, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, username, watermark, signature,",
        weight: -1,
      },
    ],
  };

  const response = await fetch(path, {
    headers,
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`);
  }

  const responseJSON = await response.json();

  let res = {
    url: "",
    base64: ""
  };
  responseJSON.artifacts.forEach((image: any, index: number) => {
    // fs.writeFileSync(
    //   `../out/txt2img_${image.seed}.png`,
    //   Buffer.from(image.base64, "base64")
    // );

    // res.url = `../out/txt2img_${image.seed}.png`;
    res.base64 = image.base64;

    console.log(res);
  });

  return res;
};
