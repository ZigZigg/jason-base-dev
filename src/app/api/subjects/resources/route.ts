import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ApiClient from '@/lib/api';
import { getSubjectData } from '@/lib/modules/subjects/data';

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
    const subjectList = await getSubjectData();
    const subject = subjectList.find(subject => {
      return subject.name === subjectName
    })

    // Build the URL for the external API
    const grades = ['PreK', 'K', '1', '2'];
    const urlWithAll = `/v2/search_resource_collections?${grades.map(g => `&grades[]=${g}`).join('')}`;
    const urlWithSubjects = `/v2/search_resource_collections?${subject?.filters.map(filter => `subjects[]=${encodeURIComponent(filter)}`).join('&')}${grades.map(g => `&grades[]=${g}`).join('')}`;
    let url = subjectName === 'All' ? urlWithAll : urlWithSubjects;
    
    url += `&page=${page}&per_page=${perPage}`
    if(sortBy){
      url += `&sort_by=${encodeURIComponent(sortBy)}`;
    }// Make the request to the external API
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