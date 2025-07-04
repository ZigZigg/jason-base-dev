import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = process.env.API_ENDPOINT || 'https://res.test-api.jason.org';
    const apiKey = process.env.JASON_PARTNER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`${baseUrl}/v2/grades`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      cache: 'no-store' // Disable caching for now
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `API responded with status: ${response.status}`,
          req_url: `${baseUrl}/v2/grades`,
          req_headers: {
            'x-api-key': apiKey
          },
          resp_headers: response.headers,
          resp_body: await response.text()
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grades', original_error: error },
      { status: 500 }
    );
  }
}
