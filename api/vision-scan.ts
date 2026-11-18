import { GoogleGenAI, Type } from '@google/genai';

interface ScanRequestBody {
  imageBase64?: string;
  mimeType?: string;
}

interface HttpRequest {
  method?: string;
  body?: ScanRequestBody | string;
}

interface HttpResponse {
  status: (code: number) => HttpResponse;
  json: (payload: unknown) => void;
}

export default async function handler(req: HttpRequest, res: HttpResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY in your environment variables.',
    });
    return;
  }

  let body: ScanRequestBody = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
  } catch {
    res.status(400).json({ error: 'Invalid JSON request body.' });
    return;
  }

  const { imageBase64, mimeType } = body;
  if (!imageBase64 || !mimeType) {
    res.status(400).json({ error: 'Missing imageBase64 or mimeType in request body.' });
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: {
        parts: [
          {
            text: `Analyze this balloon art image. Identify individual flowers in the bouquet.
For each flower, extract:
- petal_hex: Primary color of the balloon petals (Hex code).
- stamen_hex: Color of the center/stamen (Hex code).
- stem_hex: Color of the stem (Hex code).
- material: Texture type (choose one: 'Matte', 'Chrome', 'Pastel').
- mood: Choose the closest mood from [RED, ORANGE, YELLOW, GREEN, BLUE, INDIGO, VIOLET, WHITE, BLACK, BROWN].
- name: A creative name for this flower.

Limit to exactly 5 flowers if possible, or fewer if the image has less.
Return as a JSON array.`,
          },
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              petal_hex: { type: Type.STRING },
              stamen_hex: { type: Type.STRING },
              stem_hex: { type: Type.STRING },
              material: { type: Type.STRING },
              mood: { type: Type.STRING },
              name: { type: Type.STRING },
            },
            required: ['petal_hex', 'stamen_hex', 'stem_hex', 'material', 'mood', 'name'],
          },
        },
      },
    });

    const jsonText = (response.text ?? '[]').trim();
    const flowers = JSON.parse(jsonText);
    res.status(200).json({ flowers });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to analyze image with Gemini API.';
    console.error('Vision scan error:', error);
    res.status(500).json({ error: message });
  }
}
