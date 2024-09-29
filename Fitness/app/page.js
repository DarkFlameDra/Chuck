"use client";
import './globals.css'; 
import { useEffect, useState } from 'react';

// Define the main component for the homepage
export default function Home() {
  const [trainers, setTrainers] = useState([]); // State to store trainers
  const [courses, setCourses] = useState([]); // State to store courses
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [filteredTrainers, setFilteredTrainers] = useState([]); // State for filtered trainers
  const [filteredCourses, setFilteredCourses] = useState([]); // State for filtered courses

  // Fetch trainers and courses from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const trainersResponse = await fetch('/Fitness/api/trainers');
        const coursesResponse = await fetch('/Fitness/api/courses');

        if (!trainersResponse.ok || !coursesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const trainersData = await trainersResponse.json();
        const coursesData = await coursesResponse.json();

        setTrainers(trainersData);
        setCourses(coursesData);
        setFilteredTrainers(trainersData);
        setFilteredCourses(coursesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter trainers and courses based on the search term
  useEffect(() => {
    setFilteredTrainers(
      trainers.filter(trainer => 
        trainer.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredCourses(
      courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, trainers, courses]);

  // Create a map of course IDs to course titles for easy lookup
  const courseMap = courses.reduce((acc, course) => {
    acc[course._id] = course.title; // Map course ID to course title
    return acc;
  }, {});

  return (
    <div>
      <h1>Fitness Trainers and Courses</h1>
      
      {/* Search input for filtering */}
      <input
        type="text"
        placeholder="Search for trainers or courses..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <h2>Trainers</h2>
      <ul>
        {filteredTrainers.map(trainer => (
          <li key={trainer._id}>
            <h3>
              <a href={`/Fitness/appointment?trainer=${encodeURIComponent(trainer.name)}`}>
                {trainer.name}
              </a>
            </h3>
            <p>Expertise: {trainer.expertise.map(id => courseMap[id]).join(', ')}</p>
          </li>
        ))}
      </ul>

      <h2>Courses</h2>
      <ul>
        {filteredCourses.map(course => {
          // Find trainers who teach this course
          const teachingTrainers = trainers.filter(trainer =>
            trainer.expertise.includes(course._id)
          );

          return (
            <li key={course._id}>
              <h3>{course.title}</h3>
              <p>Description: {course.description}</p>
              <p>Trainers: {teachingTrainers.length > 0 ? teachingTrainers.map(trainer => (
                <a key={trainer._id} href={`/Fitness/appointment?trainer=${encodeURIComponent(trainer.name)}`}>
                  {trainer.name}
                </a>
              )).reduce((prev, curr) => [prev, ', ', curr]) : 'No trainers available'}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
