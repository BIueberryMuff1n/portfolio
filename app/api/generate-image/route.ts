import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 503 });
  }

  try {
    const response = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait',
      },
      body: JSON.stringify({
        input: {
          prompt,
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'webp',
          output_quality: 80,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Replicate error:', err);
      return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
    }

    let result = await response.json();

    // Poll for completion if not immediately done (Prefer: wait may time out)
    const deadline = Date.now() + 55_000;
    while (result.status !== 'succeeded' && result.status !== 'failed' && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 1000));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
      });
      result = await pollRes.json();
    }

    if (result.status === 'succeeded' && result.output?.[0]) {
      return NextResponse.json({ imageUrl: result.output[0] });
    }

    return NextResponse.json({ error: 'Generation failed or timed out' }, { status: 500 });
  } catch (err) {
    console.error('generate-image route error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
