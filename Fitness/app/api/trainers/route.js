// app/api/trainers/route.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/trainers: Retrieve all trainers
export async function GET(req) {
  const client = await clientPromise; 
  const db = client.db('fitnessroom'); 
  
  const trainers = await db.collection('trainers').find({}).toArray(); 
  return new Response(JSON.stringify(trainers), { status: 200 });
}

// GET /api/trainers/:id: Retrieve trainer details by ID
export async function GET_BY_ID(req, { params }) {
  const client = await clientPromise; 
  const db = client.db('fitnessroom'); 
  const { id } = params;

  const trainer = await db.collection('trainers').findOne({ _id: new ObjectId(id) });

  if (!trainer) {
    return new Response(JSON.stringify({ message: "Trainer not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(trainer), { status: 200 });
}

// POST /api/trainers: Add a new trainer
export async function POST(req) {
  const data = await req.json(); 
  const client = await clientPromise; 
  const db = client.db('fitnessroom'); 
  
  const result = await db.collection('trainers').insertOne(data);
  
  return new Response(JSON.stringify(result.ops[0]), { status: 201 });
}

// PUT /api/trainers/:id: Update trainer information by ID
export async function PUT(req, { params }) {
  const data = await req.json(); 
  const client = await clientPromise; 
  const db = client.db('fitnessroom'); 
  const { id } = params;

  const result = await db.collection('trainers').updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );

  if (result.modifiedCount === 0) {
    return new Response(JSON.stringify({ message: "Trainer not found or no changes made" }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: "Trainer updated successfully" }), { status: 200 });
}

// DELETE /api/trainers/:id: Delete trainer by ID
export async function DELETE(req, { params }) {
  const client = await clientPromise; 
  const db = client.db('fitnessroom'); 
  const { id } = params;

  const result = await db.collection('trainers').deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return new Response(JSON.stringify({ message: "Trainer not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: "Trainer deleted successfully" }), { status: 200 });
}
