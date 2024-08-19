import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const runtime = 'edge'; // Add this line to use Edge Runtime

export async function POST(request: Request) {
  const body = await request.json();
  const { action, threadId, message } = body;

  try {
    let response;

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ thread_id: threadId, message }),
    };

    switch (action) {
      case 'create_thread':
        response = await fetch(`${API_URL}/api/v1/portfolio-assistant/create_thread`, fetchOptions);
        break;

      case 'send_message':
        if (!threadId || !message) {
          return NextResponse.json({ error: 'Missing threadId or message' }, { status: 400 });
        }
        response = await fetch(`${API_URL}/api/v1/portfolio-assistant/send_message`, fetchOptions);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'An error occurred' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in portfolio assistant API:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}