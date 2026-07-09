import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    
    const filename = `timeline_${id}.jpg`;

    // Check if the file exists in storage
    const { data: list, error } = await supabaseAdmin.storage.from('memories').list('', {
      searchString: filename
    });
    
    if (error) throw error;
    
    if (list && list.some(file => file.name === filename)) {
      const { data } = supabaseAdmin.storage.from('memories').getPublicUrl(filename);
      return NextResponse.json({ url: `${data.publicUrl}?t=${Date.now()}` });
    } else {
      return NextResponse.json({ url: null });
    }
  } catch (error) {
    console.error('Error fetching timeline photo:', error);
    return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const id = formData.get('id') as string | null;
    
    if (!file || !id) {
      return NextResponse.json({ error: 'Missing file or id' }, { status: 400 });
    }

    const filename = `timeline_${id}.jpg`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload and overwrite if it already exists
    const { error: storageError } = await supabaseAdmin
      .storage
      .from('memories')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (storageError) throw storageError;

    const { data: { publicUrl } } = supabaseAdmin.storage.from('memories').getPublicUrl(filename);

    return NextResponse.json({ success: true, url: `${publicUrl}?t=${Date.now()}` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    
    const filename = `timeline_${id}.jpg`;

    const { error: storageError } = await supabaseAdmin
      .storage
      .from('memories')
      .remove([filename]);

    if (storageError) throw storageError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
