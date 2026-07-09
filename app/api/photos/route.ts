import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Create a Supabase admin client with the service_role key to bypass RLS policies
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('photos')
      .select('url')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Extract just the URLs into an array to match the frontend expectation
    const photos = data ? data.map(row => row.url) : [];
    
    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error fetching photos from Supabase:', error);
    return NextResponse.json({ error: 'Failed to read photos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Upload to Supabase Storage
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const { data: storageData, error: storageError } = await supabaseAdmin
      .storage
      .from('memories')
      .upload(filename, buffer, {
        contentType: file.type,
      });

    if (storageError) {
      console.error('Supabase Storage Error:', storageError);
      throw storageError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('memories')
      .getPublicUrl(filename);

    // 2. Save the URL to the Supabase Database table
    const { error: dbError } = await supabaseAdmin
      .from('photos')
      .insert([
        { url: publicUrl }
      ]);

    if (dbError) {
      console.error('Supabase DB Error:', dbError);
      throw dbError;
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // 1. Delete from Supabase Database
    const { error: dbError } = await supabaseAdmin
      .from('photos')
      .delete()
      .eq('url', url);

    if (dbError) {
      console.error('Supabase DB Delete Error:', dbError);
      throw dbError;
    }

    // 2. Delete from Supabase Storage
    const parts = url.split('/');
    const filename = parts[parts.length - 1];

    if (filename) {
      const { error: storageError } = await supabaseAdmin
        .storage
        .from('memories')
        .remove([filename]);

      if (storageError) {
        console.error('Supabase Storage Delete Error:', storageError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
