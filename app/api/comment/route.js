import { NextResponse } from 'next/server';
import db from '@/lib/db';



export async function POST(req) {
    try {
      const body = await req.json();
      const { userId, postId,comment } = body;

      console.log("Received user data from comment:", userId, postId,comment);
  
        // If not exists, add the like (toggle on)
        await db.query(
          'INSERT INTO `comment` (user_id, post_id,comments) VALUES (?, ?,?)',
          [userId, postId,comment]
        );
        return NextResponse.json(
          { message: 'Like added successfully' },
          { status: 200 }
        );
    }
     catch (error) {
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
  
      console.log("Fetching comments for user:", userId, "and post:", postId);
  
      const [comments] = await db.query(
        'SELECT * FROM `comment` WHERE   post_id = ?',
        [postId]
      );
  
console.log("comments are",comments)

      return NextResponse.json(comments, { status: 200 });
    } catch (error) {
      console.error("Error fetching comments:", error);
      return NextResponse.json(
        { message: 'Error fetching comments.' },
        { status: 500 }
      );
    }
  }

