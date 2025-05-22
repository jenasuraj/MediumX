import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { u_id, content, heading, bio, date, genre } = body;
    await db.query(
      'INSERT INTO `post` (user_id, content, heading, about, date, genre) VALUES (?,?,?,?,?,?)',
      [u_id, content, heading, bio, date, JSON.stringify(genre)]
    );
    return NextResponse.json(
      { message: 'User data uploaded successfully from post' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error while uploading user data:', error);
    return NextResponse.json({ message: 'Error saving data.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM `post`');

    if (rows.length === 0) {
      return NextResponse.json({ message: 'No posts found' }, { status: 404 });
    }

    // Convert Buffer data to a string
    const updatedPosts = rows.map((post) => {
      return {
        ...post,
        content: post.content.toString('utf-8'), // Convert buffer to string
      };
    });

    return NextResponse.json(updatedPosts, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Error fetching data.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    // Get the post ID from query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
    }

    // Check if the post exists
    const [posts] = await db.query('SELECT id FROM `post` WHERE id = ?', [id]);
    if (posts.length === 0) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Delete the post
    await db.query('DELETE FROM `post` WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ message: 'Error deleting post.' }, { status: 500 });
  }
}