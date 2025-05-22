import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email'); // ✅ fixed

    const [rows] = await db.query('SELECT user_id FROM `user` WHERE email = ?', [email]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows, { status: 200 }); // send back userId only
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return NextResponse.json({ message: 'Error fetching data.' }, { status: 500 });
  }
}


