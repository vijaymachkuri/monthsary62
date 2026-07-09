import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const FILENAME = 'timeline.json';

const defaultTimeline = [
  { id: 'beginning', date: 'May 9, 2021', title: 'The Beginning', description: 'The day our beautiful journey started.', icon: 'Heart', photoUrl: null },
  { id: 'newyears', date: 'December 31, 2023', title: 'New Years Eve', description: 'Ringing in another year of love and happiness.', icon: 'Star', photoUrl: null },
  { id: 'gem_birthday', date: 'June 4, 2026', title: "Gem's Birthday", description: 'Celebrating my favorite person in the world.', icon: 'Camera', photoUrl: null }
];

export async function GET() {
  try {
    const { data: list, error: listError } = await supabaseAdmin.storage.from('memories').list('', {
      search: FILENAME
    });

    if (listError) throw listError;

    if (list && list.some(file => file.name === FILENAME)) {
      const { data, error } = await supabaseAdmin.storage.from('memories').download(FILENAME);
      if (error) throw error;
      
      const text = await data.text();
      return NextResponse.json({ timeline: JSON.parse(text) });
    } else {
      // Return default if doesn't exist
      return NextResponse.json({ timeline: defaultTimeline });
    }
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { timeline } = body;
    
    if (!timeline || !Array.isArray(timeline)) {
      return NextResponse.json({ error: 'Invalid timeline data' }, { status: 400 });
    }

    const buffer = Buffer.from(JSON.stringify(timeline, null, 2), 'utf-8');

    const { error: storageError } = await supabaseAdmin
      .storage
      .from('memories')
      .upload(FILENAME, buffer, {
        contentType: 'application/json',
        upsert: true
      });

    if (storageError) throw storageError;

    return NextResponse.json({ success: true, timeline });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update timeline' }, { status: 500 });
  }
}
