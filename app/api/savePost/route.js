import db from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
      const body = await req.json(); 
      const { userId,postId,content} = body;

      console.log("Received user data from post:", userId,postId,content);

      const [existing] = await db.query(
        'SELECT * FROM `savepost` WHERE user_id = ? AND post_id = ?',
        [userId, postId]
      );

      if(existing.length>0)
      { console.log("already post exist let me delete it...")
        await db.query('DELETE FROM `savepost` WHERE user_id = ? AND post_id = ?', [userId, postId]);
        return NextResponse.json({message:"savepost deleted"}, { status:200 })
      }
      else{
        await db.query('INSERT INTO `savepost` (user_id, post_id,content) VALUES (?,?,?)', [userId,postId,content]);
        return NextResponse.json({ message: 'User data saved' }, { status: 200 });
      }
    } catch (error) {
      console.error("Error while uploading user data:", error);
      return NextResponse.json({ message: 'Error saving data.' }, { status: 500 });
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
        'SELECT * FROM `savepost` WHERE user_id = ? AND post_id = ?',
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
  


