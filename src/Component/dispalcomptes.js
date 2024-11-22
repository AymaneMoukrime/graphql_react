import React, { useState } from 'react';
import Modal from 'react-modal';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { ALL_COMPTES, DELETE_COMPTE, COMPTE_TRANSACTIONS, FIND_BY_TYPE } from '../graphql/queries';
import { ADD_TRANSACTION } from '../graphql/mutations';

Modal.setAppElement('#root'); // Required for accessibility

const DisplayComptes = () => {
    const { loading, error, data, refetch } = useQuery(ALL_COMPTES);
    const [findByType, { data: filteredData }] = useLazyQuery(FIND_BY_TYPE);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [transactionsModalIsOpen, setTransactionsModalIsOpen] = useState(false);
    const [selectedCompte, setSelectedCompte] = useState(null);
    const [transaction, setTransaction] = useState({ montant: '', type: 'DEPOT' });
    const [transactions, setTransactions] = useState([]);
    const [selectedType, setSelectedType] = useState('');

    const [addTransaction] = useMutation(ADD_TRANSACTION, {
        refetchQueries: [
            { query: COMPTE_TRANSACTIONS, variables: { id: selectedCompte?.id } },
            { query: ALL_COMPTES },
        ],
        onCompleted: () => {
            alert('Transaction added successfully!');
            setModalIsOpen(false);
            setTransaction({ montant: '', type: 'DEPOT' });
        },
    });

    const [deleteCompte] = useLazyQuery(DELETE_COMPTE, {
        onCompleted: () => refetch(),
    });

    const [fetchTransactions] = useLazyQuery(COMPTE_TRANSACTIONS, {
        onCompleted: (data) => setTransactions(data.compteTransactions),
    });

    const handleFilterChange = (e) => {
        const type = e.target.value;
        setSelectedType(type);
        if (type) {
            findByType({ variables: { type } });
        } else {
            refetch();
        }
    };

    const openTransactionModal = (compte) => {
        setSelectedCompte(compte);
        setModalIsOpen(true);
    };

    const openTransactionsView = (compte) => {
        setSelectedCompte(compte);
        fetchTransactions({ variables: { id: compte.id } });
        setTransactionsModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setTransactionsModalIsOpen(false);
        setSelectedCompte(null);
        setTransactions([]);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this compte?')) {
            deleteCompte({ variables: { id } });
        }
    };

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCompte) {
            alert('No compte selected.');
            return;
        }

        if (transaction.type === 'RETRAIT' && selectedCompte.solde < parseFloat(transaction.montant)) {
            alert(`Insufficient balance. Current balance: ${selectedCompte.solde}`);
            return;
        }

        await addTransaction({
            variables: {
                transaction: {
                    compteId: selectedCompte.id,
                    montant: parseFloat(transaction.montant),
                    type: transaction.type,
                },
            },
        });
    };

    const comptes = selectedType && filteredData ? filteredData.findByType : data?.allComptes;

    if (loading) return <p className="text-center text-blue-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">All Comptes</h1>

            {/* Filter Dropdown */}
            <div className="mb-4">
                <label htmlFor="filter" className="block mb-2 text-sm font-medium">Filter by Type:</label>
                <select
                    id="filter"
                    value={selectedType}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="">All</option>
                    <option value="COURANT">COURANT</option>
                    <option value="EPARGNE">EPARGNE</option>
                </select>
            </div>

            <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">ID</th>
                        <th className="border border-gray-300 px-4 py-2">Solde</th>
                        <th className="border border-gray-300 px-4 py-2">Date Creation</th>
                        <th className="border border-gray-300 px-4 py-2">Type</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {comptes?.map((compte, index) => (
                        <tr key={compte.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-300 px-4 py-2">{compte.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{compte.solde}</td>
                            <td className="border border-gray-300 px-4 py-2">{compte.dateCreation}</td>
                            <td className="border border-gray-300 px-4 py-2">{compte.type}</td>
                            <td className="border border-gray-300 px-4 py-2 space-x-2">
                                <button
                                    onClick={() => handleDelete(compte.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => openTransactionModal(compte)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                >
                                    Add Transaction
                                </button>
                                <button
                                    onClick={() => openTransactionsView(compte)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                >
                                    View Transactions
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Transaction Modal */}
            {selectedCompte && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    className="w-full max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow-lg"
                    overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
                >
                    <h2 className="text-2xl font-bold mb-4">Add Transaction for Compte {selectedCompte.id}</h2>
                    <form onSubmit={handleTransactionSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Montant:</label>
                            <input
                                type="number"
                                value={transaction.montant}
                                onChange={(e) => setTransaction({ ...transaction, montant: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Type:</label>
                            <select
                                value={transaction.type}
                                onChange={(e) => setTransaction({ ...transaction, type: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="DEPOT">DEPOT</option>
                                <option value="RETRAIT">RETRAIT</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Add Transaction
                        </button>
                    </form>
                    <button
                        onClick={closeModal}
                        className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Close
                    </button>
                </Modal>
            )}

            {/* Transactions View Modal */}
            {selectedCompte && (
                <Modal
                    isOpen={transactionsModalIsOpen}
                    onRequestClose={closeModal}
                    className="w-full max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow-lg"
                    overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
                >
                    <h2 className="text-2xl font-bold mb-4">Transactions for Compte {selectedCompte.id}</h2>
                    <table className="table-auto border-collapse border border-gray-300 w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">ID</th>
                                <th className="border border-gray-300 px-4 py-2">Montant</th>
                                <th className="border border-gray-300 px-4 py-2">Date</th>
                                <th className="border border-gray-300 px-4 py-2">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td className="border border-gray-300 px-4 py-2">{transaction.id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{transaction.montant}</td>
                                        <td className="border border-gray-300 px-4 py-2">{transaction.date}</td>
                                        <td className="border border-gray-300 px-4 py-2">{transaction.type}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-gray-500">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <button
                        onClick={closeModal}
                        className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Close
                    </button>
                </Modal>
            )}
        </div>
    );
};

export default DisplayComptes;
