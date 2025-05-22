import db from "@/lib/db";
import { NextResponse } from "next/server";



    
  export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId');
   
  
      const [rows] = await db.query(
        'SELECT * FROM `savepost` WHERE user_id = ?',
        [userId]
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
  

