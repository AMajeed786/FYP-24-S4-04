import React, { useState } from 'react';
import UserHeader from '../../component/userHeader';

// Modal component to input planner duration
const PlannerModal: React.FC<{ onClose: () => void, onSubmit: (value: string) => void }> = ({ onClose, onSubmit }) => {
    const [input, setInput] = useState<string>('');
    const [unit, setUnit] = useState<'days' | 'week' | 'month'>('days');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUnit(e.target.value as 'days' | 'week' | 'month');
    };

    const handleSubmit = () => {
        // Submit the planner information (duration + unit)
        onSubmit(`${input} ${unit}`);
        onClose(); // Close the modal after submission
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Enter Planner Duration</h3>
                <input
                    type="number"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Enter number"
                    min="1"
                />
                <select value={unit} onChange={handleUnitChange}>
                    <option value="days">Days</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                </select>
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

const PlannerData: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [plannerData, setPlannerData] = useState<string>('');

    // Function to handle opening the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to handle closing the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Function to handle the submission of the planner data
    const handlePlannerSubmit = (data: string) => {
        console.log('Planner Duration:', data);
        setPlannerData(data); // Optionally store the data if needed for further use
    };

    return (
        <main>
            <UserHeader />

         
            <div className="planner-container">
                <button className="planner-btn" onClick={openModal}>Check Planner</button>

                {/* If the modal is open, show it */}
                {isModalOpen && <PlannerModal onClose={closeModal} onSubmit={handlePlannerSubmit} />}
            </div>

            {/* Optionally display the entered planner data */}
            {plannerData && <div>Your Planner: {plannerData}</div>}
        </main>
    );
};

export default PlannerData;
