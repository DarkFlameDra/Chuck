import React, { useState, useEffect } from 'react';

function HighlightedCarsPage() {
  const [cars, setCars] = useState([]);
  const [highlightedCars, setHighlightedCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHighlighted, setShowHighlighted] = useState(false);
  const [searchInHighlighted, setSearchInHighlighted] = useState('');

  useEffect(() => {
    fetch('/data/taladrod-cars.json')
      .then(response => response.json())
      .then(data => {
        setCars(data.Cars);
        const storedHighlightedCars = JSON.parse(localStorage.getItem('highlightedCars')) || [];
        setHighlightedCars(storedHighlightedCars);
      })
      .catch(error => console.error('Error fetching car data:', error));
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleHighlightChange = (car) => {
    const newHighlightedCars = highlightedCars.includes(car.Cid)
      ? highlightedCars.filter(cid => cid !== car.Cid)
      : [...highlightedCars, car.Cid];

    setHighlightedCars(newHighlightedCars);
  };

  const handleConfirm = () => {
    localStorage.setItem('highlightedCars', JSON.stringify(highlightedCars));
    setShowHighlighted(true);
  };

  const handleRemoveHighlight = (car) => {
    const newHighlightedCars = highlightedCars.filter(cid => cid !== car.Cid);
    setHighlightedCars(newHighlightedCars);
    localStorage.setItem('highlightedCars', JSON.stringify(newHighlightedCars));
  };

  const handleSearchInHighlighted = (event) => {
    setSearchInHighlighted(event.target.value);
  };

  const filteredCars = cars.filter(car => car.Model.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredHighlightedCars = cars.filter(car => highlightedCars.includes(car.Cid) && car.Model.toLowerCase().includes(searchInHighlighted.toLowerCase()));

  return (
    <div>
      {!showHighlighted ? (
        <div>
          <h1>Select Cars to Highlight</h1>
          <input
            type="text"
            placeholder="Search by model..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="form-control mb-3"
          />
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Select</th>
                <th>Model</th>
                <th>Price</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map(car => (
                <tr key={car.Cid}>
                  <td>
                    <input
                      type="checkbox"
                      checked={highlightedCars.includes(car.Cid)}
                      onChange={() => handleHighlightChange(car)}
                    />
                  </td>
                  <td>{car.Model}</td>
                  <td>{car.Prc}</td>
                  <td>{car.Yr}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleConfirm} className="btn btn-primary">Show Highlighted Cars</button>
        </div>
      ) : (
        <div>
          <h1>Highlighted Cars</h1>
          <input
            type="text"
            placeholder="Search in highlighted cars..."
            value={searchInHighlighted}
            onChange={handleSearchInHighlighted}
            className="form-control mb-3"
          />
          {highlightedCars.length > 0 ? (
            <div>
              {filteredHighlightedCars.map(car => (
                <div key={car.Cid} className="highlighted-car">
                  <img src={car.Img600} alt={car.Model} className="car-image" />
                  <p><strong>Model:</strong> {car.Model}</p>
                  <p><strong>Price:</strong> {car.Prc}</p>
                  <p><strong>Year:</strong> {car.Yr}</p>
                  <button onClick={() => handleRemoveHighlight(car)} className="btn btn-danger">Remove Highlight</button>
                </div>
              ))}
              <button onClick={() => setShowHighlighted(false)} className="btn btn-secondary mt-3">Back to Selection</button>
            </div>
          ) : (
            <p>No highlighted cars to display.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default HighlightedCarsPage;
