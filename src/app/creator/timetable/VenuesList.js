import React from 'react';
import { Trash2, Edit } from 'lucide-react';

export default function VenuesList({ venues, onEdit, onDelete }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Saved Venues</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {venues.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No venues added yet</p>
        ) : (
          venues.map(venue => (
            <div 
              key={venue.id} 
              className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium">{venue.name}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(venue)}
                  className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(venue.id)}
                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}