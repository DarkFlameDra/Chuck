import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'react-calendar/dist/Calendar.css';
import './styles/styles.css';

const availableTimeSlots = [
  "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", 
  "16:00", "17:00", "18:00", 
  "19:00", "20:00", "21:00"
];

export default function BookingCalendar() {
  const router = useRouter();
  const [trainer, setTrainer] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [bookedTimeSlots, setBookedTimeSlots] = useState({}); // Stores booked slots

  // Fetch the trainer name from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const trainerName = urlParams.get('trainer');
    if (trainerName) {
      setTrainer(trainerName);
    }
  }, []);

  // Fetch booked time slots from the database
  useEffect(() => {
    const fetchBookings = async () => {
      const response = await fetch('/Fitness/api/bookings');
      if (response.ok) {
        const data = await response.json();
        const slots = {};
        data.forEach(booking => {
          slots[booking.time] = true; // Mark the time slot as booked
        });
        setBookedTimeSlots(slots);
      }
    };
    fetchBookings();
  }, []);

  const handleTimeSelect = (time) => {
    if (bookedTimeSlots[time]) {
      // If the time is booked, show the cancel confirmation dialog
      setSelectedTime(time);
      setShowCancelConfirmation(true);
    } else {
      // If the time is available, show the booking confirmation dialog
      setSelectedTime(time);
      setShowConfirmation(true);
    }
  };

  const confirmBooking = async () => {
    if (!trainer || !selectedTime) {
      alert('Trainer or time slot is missing.');
      return;
    }

    const response = await fetch('/Fitness/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trainer, time: selectedTime }),
    });

    if (response.ok) {
      setBookedTimeSlots(prev => ({ ...prev, [selectedTime]: true }));
      alert(`Booking confirmed for ${selectedTime} today with ${trainer}!`);
      setShowConfirmation(false);
      setSelectedTime(null);
    } else {
      const errorData = await response.json();
      alert(`Booking failed: ${errorData.message}`);
    }
  };

  const confirmCancelBooking = async () => {
    if (!trainer || !selectedTime) {
      alert('Trainer or time slot is missing.');
      return;
    }

    const response = await fetch('/Fitness/api/bookings', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trainer, time: selectedTime }),
    });

    if (response.ok) {
      setBookedTimeSlots(prev => ({ ...prev, [selectedTime]: false }));
      alert(`Booking canceled for ${selectedTime} today with ${trainer}.`);
      setShowCancelConfirmation(false);
      setSelectedTime(null);
    } else {
      const errorData = await response.json();
      alert(`Cancellation failed: ${errorData.message}`);
    }
  };

  const cancelBooking = () => {
    setShowConfirmation(false);
    setShowCancelConfirmation(false);
    setSelectedTime(null);
  };

  return (
    <div>
      <h1>Booking for Today with {trainer || "Loading..."}</h1>
      <h2>Available Time Slots for Today:</h2>
      <div className="time-slots">
        {availableTimeSlots.map(time => (
          <button
            key={time}
            className={`time-slot ${bookedTimeSlots[time] ? 'booked' : selectedTime === time ? 'selected' : ''}`}
            style={{ 
              backgroundColor: bookedTimeSlots[time] ? 'green' : 'blue', // Booked slots are green, available slots are blue
              color: 'white' // Ensuring the text is white for readability
            }}
            onClick={() => handleTimeSelect(time)}
          >
            {time}
          </button>
        ))}
      </div>

      {showConfirmation && (
        <div className="modal-background">
          <div className="confirmation-modal">
            <p>Confirm your booking for {selectedTime} today with {trainer}?</p>
            <button onClick={confirmBooking}>Confirm</button>
            <button className="cancel" onClick={cancelBooking}>Cancel</button>
          </div>
        </div>
      )}

      {showCancelConfirmation && (
        <div className="modal-background">
          <div className="confirmation-modal">
            <p>Cancel your booking for {selectedTime} today with {trainer}?</p>
            <button onClick={confirmCancelBooking}>Confirm Cancel</button>
            <button className="cancel" onClick={cancelBooking}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
