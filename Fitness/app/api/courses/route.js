// app/api/courses/route.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/courses: Retrieve all courses
export async function GET(req) {
  const client = await clientPromise; 
  const db = client.db('fitnessroom'); 
  
  const courses = await db.collection('courses').find({}).toArray(); 
  return new Response(JSON.stringify(courses), { status: 200 });
}

// GET /api/courses/:id: Retrieve course details by ID
export async function GET_BY_ID(req, { params }) {
  const client = await clientPromise; 
  const db = client.db('fitnessroom'); 
  const { id } = params;

  const course = await db.collection('courses').findOne({ _id: new ObjectId(id) });

  if (!course) {
    return new Response(JSON.stringify({ message: "Course not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(course), { status: 200 });
}

// POST /api/courses: Add a new course
export async function POST(req) {
  const data = await req.json();  // Parse the incoming JSON data
  const client = await clientPromise; 
  const db = client.db('fitnessroom'); 
  
  const result = await db.collection('courses').insertOne(data);  // Insert the course into the database
  
  // Return the newly inserted course with its ID
  return new Response(JSON.stringify({ ...data, _id: result.insertedId }), { status: 201 });
}

// PUT /api/courses/:id: Update course information by ID
export async function PUT(req, { params }) {
  const data = await req.json(); 
  const client = await clientPromise; 
  const db = client.db('fitnessroom'); 
  const { id } = params;

  const result = await db.collection('courses').updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );

  if (result.modifiedCount === 0) {
    return new Response(JSON.stringify({ message: "Course not found or no changes made" }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: "Course updated successfully" }), { status: 200 });
}

// DELETE /api/courses/:id: Delete course by ID
export async function DELETE(req, { params }) {
  const client = await clientPromise; 
  const db = client.db('fitnessroom'); 
  const { id } = params;

  const result = await db.collection('courses').deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return new Response(JSON.stringify({ message: "Course not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: "Course deleted successfully" }), { status: 200 });
}
