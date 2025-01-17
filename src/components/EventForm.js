import React, { useState } from 'react';
import axios from 'axios';
import './EventList.css'

const EventForm = ({ onEventAdd }) => {
    const [newEvent, setNewEvent] = useState({ title: '', date: '', reminder: false });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewEvent({
            ...newEvent,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post('http://localhost:5000/api/events', newEvent, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => {
                console.log('Event added successfully:', response.data);
                onEventAdd(response.data);
                setNewEvent({ title: '', date: '', reminder: false });
            })
            .catch(error => {
                console.error('Error adding event:', error);

                if (error.response) {
                    alert(`Error: ${error.response.data.error || 'Failed to add the event.'}`);
                } else if (error.request) {
                    alert('Error: No response received from the server.');
                } else {
                    alert(`Error: ${error.message}`);
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Title:</label>
            <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                required
            />
            <label>Date:</label>
            <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                required
            />
            <label>
                Reminder:
                <input
                    type="checkbox"
                    name="reminder"
                    checked={newEvent.reminder}
                    onChange={handleInputChange}
                />
            </label>
            <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Event'}
            </button>
        </form>
    );
};

export default EventForm;
