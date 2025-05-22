import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { follower, following } = body;

    // Validate input
    if (!follower || !following) {
      return NextResponse.json(
        { message: 'Follower and following IDs are required' },
        { status: 400 }
      );
    }

    if (follower === following) {
      return NextResponse.json(
        { message: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    // Check if the follow relationship already exists
    const [existing] = await db.query(
      'SELECT * FROM follow WHERE follower = ? AND folowing = ?',
      [follower, following]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { message: 'Already following this user' },
        { status: 409 }
      );
    }

    // Insert the follow relationship
    await db.query(
      'INSERT INTO follow (follower, folowing) VALUES (?, ?)',
      [follower, following]
    );

    return NextResponse.json(
      { message: 'Successfully followed user' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating follow relationship:', error);
    return NextResponse.json(
      { message: 'Error following user' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { follower, following } = body;

    // Validate input
    if (!follower || !following) {
      return NextResponse.json(
        { message: 'Follower and following IDs are required' },
        { status: 400 }
      );
    }

    // Check if the follow relationship exists
    const [existing] = await db.query(
      'SELECT * FROM follow WHERE follower = ? AND folowing = ?',
      [follower, following]
    );
    if (existing.length === 0) {
      return NextResponse.json(
        { message: 'Not following this user' },
        { status: 404 }
      );
    }

    // Delete the follow relationship
    await db.query(
      'DELETE FROM follow WHERE follower = ? AND folowing = ?',
      [follower, following]
    );

    return NextResponse.json(
      { message: 'Successfully unfollowed user' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting follow relationship:', error);
    return NextResponse.json(
      { message: 'Error unfollowing user' },
      { status: 500 }
    );
  }
}