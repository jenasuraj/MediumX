import { NextResponse } from 'next/server';
import db from '@/lib/db';



export async function POST(req) {
    try {
      const body = await req.json();
      const { userId, postId } = body;

      console.log("Received user data from like:", userId, postId);
  
      // Check if the like already exists
      const [existing] = await db.query(
        'SELECT * FROM `likes` WHERE user_id = ? AND post_id = ?',
        [userId, postId]
      );
  console.log("destination",existing)

      if (existing.length > 0) {
        // If exists, remove the like (toggle off)
        await db.query(
          'DELETE FROM `likes` WHERE user_id = ? AND post_id = ?',
          [userId, postId]
        );
        return NextResponse.json(
          { message: 'Like removed successfully' },
          { status: 200 }
        );
      } else {
        // If not exists, add the like (toggle on)
        await db.query(
          'INSERT INTO `likes` (user_id, post_id) VALUES (?, ?)',
          [userId, postId]
        );
        return NextResponse.json(
          { message: 'Like added successfully' },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error("Error while toggling like:", error);
      return NextResponse.json(
        { message: 'Error processing like.' },
        { status: 500 }
      );
    }
  }
  




  
  
  export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId');
      const postId = searchParams.get('postId');
  
      if (!userId || !postId) {
        return NextResponse.json({ message: 'Missing userId or postId' }, { status: 400 });
      }
  
      const [rows] = await db.query(
        'SELECT * FROM `likes` WHERE user_id = ? AND post_id = ?',
        [userId, postId]
      );
  
      if (rows.length === 0) {
        return NextResponse.json({ message: 'No match found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Match found', data: rows }, { status: 200 });
    } catch (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json({ message: 'Error fetching data.' }, { status: 500 });
    }
  }
  
