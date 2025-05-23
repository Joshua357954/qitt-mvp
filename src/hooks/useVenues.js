import { useState, useEffect } from 'react';

export default function useVenues() {
  const [venues, setVenues] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Load venues from localStorage
  useEffect(() => {
    const savedVenues = localStorage.getItem('venues');
    alert(savedVenues)
    if (savedVenues) setVenues(JSON.parse(savedVenues));
  }, []);

  // Save venues to localStorage
  useEffect(() => {
    localStorage.setItem('venues', JSON.stringify(venues));
  }, [venues]);

  const addVenue = (name) => {
    setVenues([...venues, {
      id: Date.now().toString(),
      name
    }]);
  };

  const editVenue = (id, newName) => {
    setVenues(venues.map(venue => 
      venue.id === id ? { ...venue, name: newName } : venue
    ));
  };

  const deleteVenue = (id) => {
    setVenues(venues.filter(venue => venue.id !== id));
  };

  return {
    venues,
    editingId,
    setEditingId,
    addVenue,
    editVenue,
    deleteVenue
  };
}