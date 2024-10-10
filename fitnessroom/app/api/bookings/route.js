import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb'; // Adjust the path if necessary

// Handle POST request for booking creation
export async function POST(request) {
  try {
    const { trainer, time } = await request.json();

    // Validate the incoming data
    if (!trainer || !time) {
      return NextResponse.json({ message: 'Trainer and time are required.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('fitnessroom');

    // Check if the time slot is already booked
    const existingBooking = await db.collection('bookings').findOne({ trainer, time });
    if (existingBooking) {
      return NextResponse.json({ message: 'This time slot is already booked.' }, { status: 400 });
    }

    // Create a new booking
    const result = await db.collection('bookings').insertOne({
      trainer,
      time,
      createdAt: new Date(),
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating booking', error }, { status: 500 });
  }
}

// Handle DELETE request for booking cancellation
export async function DELETE(request) {
  try {
    const { trainer, time } = await request.json();

    // Validate the incoming data
    if (!trainer || !time) {
      return NextResponse.json({ message: 'Trainer and time are required.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('fitnessroom');

    // Remove the booking
    const result = await db.collection('bookings').deleteOne({ trainer, time });
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking canceled successfully.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error canceling booking', error }, { status: 500 });
  }
}

// Optionally, handle GET request for fetching all bookings
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('fitnessroom');

    // Fetch all bookings
    const bookings = await db.collection('bookings').find({}).toArray();

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching bookings', error }, { status: 500 });
  }
}
