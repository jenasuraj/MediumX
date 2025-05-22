import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Ensure db is correctly configured

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const user_id = searchParams.get('user_id'); // Get user_id from query params

    if (user_id) {
      // Check if user_id already exists
      const [rows] = await db.query('SELECT user_id FROM `user` WHERE user_id = ?', [user_id]);

      if (rows.length > 0) {
        return NextResponse.json({ exists: true }, { status: 200 });
      } else {
        return NextResponse.json({ exists: false }, { status: 200 });
      }
    }
    
    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const [rows] = await db.query('SELECT email FROM `user` WHERE email = ?', [email]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Error fetching data.' }, { status: 500 });
  }
}







export async function POST(req) {
  try {
    const body = await req.json(); // Extract JSON body
    const { name, email, user_id } = body;
    console.log("Received user data:", user_id, name, email);
    await db.query('INSERT INTO `user` (name, email, user_id) VALUES (?, ?, ?)', [name, email, user_id]);
    return NextResponse.json({ message: 'User data uploaded successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error while uploading user data:", error);
    return NextResponse.json({ message: 'Error saving data.' }, { status: 500 });
  }
}
