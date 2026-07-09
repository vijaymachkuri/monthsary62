import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const FILENAME = 'settings.json';

const defaultSettings = {
  letterBody: `Happy {MONTH_COUNT} Monthsary! Looking back at the past {MONTHS} months, I am filled with so much gratitude and love for everything we have shared together.\n\nYou are my safe place, my greatest adventure, and my favorite part of every single day. I promise to always choose you, to hold your hand through the highs and lows, and to keep making you smile no matter what.\n\nThank you for being you, and thank you for being mine. I love you more than words can ever say.`
};

export async function GET() {
  try {
    const { data: list, error: listError } = await supabaseAdmin.storage.from('memories').list('', {
      searchString: FILENAME
    });

    if (listError) throw listError;

    if (list && list.some(file => file.name === FILENAME)) {
      const { data, error } = await supabaseAdmin.storage.from('memories').download(FILENAME);
      if (error) throw error;
      
      const text = await data.text();
      return NextResponse.json({ settings: JSON.parse(text) });
    } else {
      // Return default if doesn't exist
      return NextResponse.json({ settings: defaultSettings });
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { settings } = body;
    
    if (!settings) {
      return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 });
    }

    const buffer = Buffer.from(JSON.stringify(settings, null, 2), 'utf-8');

    const { error: storageError } = await supabaseAdmin
      .storage
      .from('memories')
      .upload(FILENAME, buffer, {
        contentType: 'application/json',
        upsert: true
      });

    if (storageError) throw storageError;

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
