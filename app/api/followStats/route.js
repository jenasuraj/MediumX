import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const u_id = searchParams.get('u_id');

    if (!u_id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if the user exists
    const [users] = await db.query('SELECT user_id FROM user WHERE user_id = ?', [u_id]);
    if (users.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch follower count
    const [followerCount] = await db.query(
      'SELECT COUNT(*) AS count FROM follow WHERE folowing = ?',
      [u_id]
    );

    // Fetch following count
    const [followingCount] = await db.query(
      'SELECT COUNT(*) AS count FROM follow WHERE follower = ?',
      [u_id]
    );

    // Fetch followers list
    const [followers] = await db.query(
      'SELECT follower FROM follow WHERE folowing = ?',
      [u_id]
    );

    // Fetch following list
    const [following] = await db.query(
      'SELECT folowing FROM follow WHERE follower = ?',
      [u_id]
    );

    return NextResponse.json(
      {
        followerCount: followerCount[0].count,
        followingCount: followingCount[0].count,
        followers: followers.map((f) => f.follower),
        following: following.map((f) => f.following),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching follow stats:', error);
    return NextResponse.json(
      { message: 'Error fetching follow stats' },
      { status: 500 }
    );
  }
}