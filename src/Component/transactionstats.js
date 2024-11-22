import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { TRANSACTION_STATS } from '../graphql/queries';
import Modal from 'react-modal';

const TransactionStats = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal visibility state
    const [loadTransactionStats, { loading, error, data }] = useLazyQuery(TRANSACTION_STATS);
    
    const openModal = () => {
        loadTransactionStats(); // Trigger the query when the modal is opened
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) return <p className="text-center text-blue-500">Loading stats...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

    const stats = data ? data.transactionStats : null;

    return (
        <div className="p-6 bg-gray-100 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Transaction Statistics</h2>

            {/* Button to Open Modal */}
            <div className="flex justify-center mb-4">
                <button
                    onClick={openModal}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Show Transaction Stats
                </button>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="w-full max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg"
                overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Transaction Stats</h2>
                <div className="mb-4">
                    {stats ? (
                        <>
                            <p className="text-lg">Total Transactions: {stats.count || 0}</p>
                            <p className="text-lg">Total Deposits: {stats.sumDepots.toFixed(2) || 0}</p>
                            <p className="text-lg">Total Withdrawals: {stats.sumRetraits.toFixed(2) || 0}</p>
                        </>
                    ) : (
                        <p className="text-center text-gray-500">No stats available</p>
                    )}
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={closeModal}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default TransactionStats;
