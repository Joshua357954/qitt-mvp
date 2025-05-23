import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import VenuesList from './VenuesList';
import useVenues from '@/hooks/useVenues';

export default function AddVenueModal({ isOpen, onClose }) {
  const [venueName, setVenueName] = useState('');
  const [error, setError] = useState('');
  const {
    venues,
    editingId,
    setEditingId,
    addVenue,
    editVenue,
    deleteVenue
  } = useVenues();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!venueName.trim()) {
      setError('Venue name is required');
      return;
    }

    if (editingId) {
      editVenue(editingId, venueName);
      setEditingId(null);
    } else {
      addVenue(venueName);
    }   

    setVenueName('');
    setError('');
  };

  const handleEdit = (venue) => {
    setVenueName(venue.name);
    setEditingId(venue.id);
  };

  const handleDelete = (id) => {
    deleteVenue(id);
    if (editingId === id) {
      setVenueName('');
      setEditingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b bg-indigo-600 text-white">
          <h2 className="text-xl font-semibold">
            {editingId ? 'Edit Venue' : 'Add New Venue'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-indigo-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="venueName" className="block text-sm font-medium text-gray-700 mb-1">
                Venue Name *
              </label>
              <input
                id="venueName"
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Lecture Hall A"
                autoFocus
              />
              {error && <p className="mt-1 text-sm text-red-600 animate-pulse">{error}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                {editingId ? (
                  <>
                    <Check size={18} className="mr-1" />
                    Update
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-1" />
                    Add
                  </>
                )}
              </button>
            </div>
          </form>

          <VenuesList
            venues={venues}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}