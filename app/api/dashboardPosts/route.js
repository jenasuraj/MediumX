import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Ensure db is correctly configured



export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      //console.log("the user id that is going to be requested is ",id)
    
      const [rows] = await db.query('SELECT * FROM `post` WHERE user_id = ?', [id]);
  

      if (rows.length === 0) {
        return NextResponse.json({ message: 'User_id not found' }, { status: 404 });
      }


  
      return NextResponse.json(rows, { status: 200 });
    } catch (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json({ message: 'Error fetching data.' }, { status: 500 });
    }
  }

