import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Ensure db is correctly configured



export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const email = searchParams.get('email');
      const [rows] = await db.query('SELECT user_id FROM `user` WHERE email = ?', [email]);
  
      if (rows.length === 0) {
        return NextResponse.json({ message: 'User_id not found' }, { status: 404 });
      }
  
      return NextResponse.json(rows, { status: 200 });
    } catch (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json({ message: 'Error fetching data.' }, { status: 500 });
    }
  }



  
export async function POST(req) {
    try {
      const body = await req.json(); 
      const { u_id,bio , pronouns } = body;
      //console.log("Received user data:", u_id,bio , pronouns );
      await db.query('INSERT INTO `profile` (user_id, bio, pronouns) VALUES (?, ?, ?)', [u_id,bio,pronouns]);
      return NextResponse.json({ message: 'User data uploaded successfully' }, { status: 200 });
    } catch (error) {
      console.error("Error while uploading user data:", error);
      return NextResponse.json({ message: 'Error saving data.' }, { status: 500 });
    }
  }
  
  
  export async function PUT(req) {
    try {
        const body = await req.json();
        const { u_id, bio, pronouns } = body;
       // console.log("Updating user data:", u_id, bio, pronouns);

        const [result] = await db.query(
            'UPDATE `profile` SET bio = ?, pronouns = ? WHERE user_id = ?',
            [bio, pronouns, u_id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'No record updated. User not found or no changes made.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error while updating user data:", error);
        return NextResponse.json({ message: 'Error updating data.' }, { status: 500 });
    }
}
  
  