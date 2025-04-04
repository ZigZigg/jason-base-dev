import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import ApiClient from '@/app/lib/api';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const apiClient = new ApiClient(session?.accessToken);
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const subjectName = searchParams.get('subject_name');
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '12';
    const sortBy = searchParams.get('sort_by') || 'created_at:desc';
    
    // Validate required parameters
    if (!subjectName) {
      return NextResponse.json(
        { error: 'Subject name is required' },
        { status: 400 }
      );
    }
    
    // Build the URL for the external API
    const url = `/v2/search_resource_collections?subjects[]=${encodeURIComponent(subjectName)}&page=${page}&per_page=${perPage}&sort_by=${encodeURIComponent(sortBy)}`;
    
    // Make the request to the external API
    const response = await apiClient.get(url);
    
    // Return the response
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching subject resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subject resources' },
      { status: 500 }
    );
  }
} 