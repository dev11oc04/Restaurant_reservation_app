import React, { useState } from 'react';
import './App.css';

const ReservationSystem = () => {
  const totalSeats = 50;
  const [seatsLeft, setSeatsLeft] = useState(totalSeats);
  const [reservations, setReservations] = useState([]);
  const [guestCount, setGuestCount] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleReservation = (e) => {
    e.preventDefault();
    const guests = parseInt(guestCount);

    if (guests > seatsLeft) {
      alert('Not enough seats available.');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }

    if (name && phone && guestCount) {
      const newReservation = {
        name,
        phone,
        guestCount: guests,
        checkIn: new Date().toLocaleTimeString(),
        checkOut: null,
      };

      setReservations([...reservations, newReservation]);
      setSeatsLeft(seatsLeft - guests);
      setName('');
      setPhone('');
      setGuestCount('');
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleCheckout = (index) => {
    const updatedReservations = reservations.map((reservation, i) => {
      if (i === index && !reservation.checkOut) {
        reservation.checkOut = new Date().toLocaleTimeString();
        setSeatsLeft(seatsLeft + reservation.guestCount);
      }
      return reservation;
    });
    setReservations(updatedReservations);
  };

  const handleDelete = (index) => {
    const reservationToDelete = reservations[index];
    if (!reservationToDelete.checkOut) {
      setSeatsLeft(seatsLeft + reservationToDelete.guestCount);
    }
    setReservations(reservations.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h1 className="title">Restaurant Reservation System</h1>

      {/* Seats Info */}
      <div className="seats-container">
        <div className="seats-box">
          <h2>Total Seats</h2>
          <p>{totalSeats}</p>
        </div>
        <div className="seats-box">
          <h2>Seats Left</h2>
          <p>{seatsLeft}</p>
        </div>
      </div>

      {/* Reservation Form */}
      <form onSubmit={handleReservation} className="reservation-form">
        <input
          type="number"
          value={guestCount}
          onChange={(e) => setGuestCount(e.target.value)}
          placeholder="Guest Count"
          min="1"
          max={seatsLeft}
          required
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
            if (value.length <= 10) setPhone(value);
          }}
          placeholder="Phone Number"
          required
        />
        <button type="submit">Reserve</button>
      </form>

      {/* Reservations Table */}
      <table className="reservation-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? (
            reservations.map((reservation, index) => (
              <tr key={index}>
                <td>{reservation.name}</td>
                <td>{reservation.phone}</td>
                <td>{reservation.checkIn}</td>
                <td>
                  {reservation.checkOut ? reservation.checkOut : 'Not Checked Out'}
                </td>
                <td>
                  {!reservation.checkOut && (
                    <button onClick={() => handleCheckout(index)}>Checkout</button>
                  )}
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No Reservations</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationSystem;
