import { NextResponse } from 'next/server';
import db from '@/lib/db'; // make sure this path is correct for your project

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ message: 'Missing postId' }, { status: 400 });
    }

    const [rows] = await db.query(
      'SELECT COUNT(*) AS count FROM `likes` WHERE post_id = ?',
      [postId]
    );

    const count = rows[0].count || 0;

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error('Error fetching like count:', error);
    return NextResponse.json({ message: 'Error fetching count.' }, { status: 500 });
  }
}
