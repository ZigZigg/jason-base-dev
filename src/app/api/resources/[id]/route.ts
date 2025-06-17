import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import ApiClient from '@/app/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiClient = new ApiClient(session.accessToken);
    const resourceUrl = `/v2/resources/${id}`;
    const resourceResponse = await apiClient.get(resourceUrl, {
      next: { revalidate: 1800 },
    });

    return NextResponse.json(resourceResponse);
  } catch (error) {
    console.error(`Error fetching resource:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
} 