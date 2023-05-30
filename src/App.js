//
import React, { useState, useEffect } from 'react';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [screeningTime, setScreeningTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedOrder, setReservedOrder] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      const user = await response.json();
      setReservedOrder(user);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSeatSelect = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleOrderConfirmation = async () => {
    try {
      const response = await fetch('http://localhost:3001/confirm-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ screeningTime, seats: selectedSeats }),
      });
      const order = await response.json();
      setReservedOrder(order);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3001/user');
        const user = await response.json();
        if (user) {
          setReservedOrder(user);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div>
      <h1>Welcome to Carteav ticket booking system</h1>
      {!reservedOrder ? (
        <div>
          <form onSubmit={handleRegister}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <br />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            <button type="button" onClick={handleRegister}>
              Register
            </button>
          </form>
          <hr />
          <label htmlFor="screeningTime">Screening Time:</label>
          <input
            type="text"
            id="screeningTime"
            value={screeningTime}
            onChange={(e) => setScreeningTime(e.target.value)}
            required
          />
          <br />
          <label>Seats:</label>
          <div>
            {[1, 2, 3, 4].map((seat) => (
              <label key={seat}>
                <input
                  type="checkbox"
                  checked={selectedSeats.includes(seat)}
                  onChange={() => handleSeatSelect(seat)}
                />{' '}
                Seat {seat}
              </label>
            ))}
          </div>
          <br />
          <button onClick={handleOrderConfirmation}>Confirm Order</button>
        </div>
      ) : (
        <p>Order confirmed. User ID: {reservedOrder.id}</p>
      )}
    </div>
  );
};

export default App;
