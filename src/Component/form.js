import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_COMPTE } from '../graphql/mutations';
import { ALL_COMPTES } from '../graphql/queries';

const SaveCompte = () => {
    const [compte, setCompte] = useState({ solde: '', type: 'COURANT' });
    const [saveCompte] = useMutation(SAVE_COMPTE, {
        refetchQueries: [{ query: ALL_COMPTES }], // Refetch ALL_COMPTES after mutation
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!compte.solde || isNaN(compte.solde)) {
            alert('Please enter a valid solde.');
            return;
        }
        await saveCompte({ variables: { compte } });
        alert('Compte saved!');
        setCompte({ solde: '', type: 'COURANT' }); // Reset form
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Create Compte</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="solde">
                        Solde
                    </label>
                    <input
                        type="number"
                        id="solde"
                        placeholder="Enter Solde"
                        value={compte.solde}
                        onChange={(e) => setCompte({ ...compte, solde: parseFloat(e.target.value) })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="type">
                        Type
                    </label>
                    <select
                        id="type"
                        value={compte.type}
                        onChange={(e) => setCompte({ ...compte, type: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="COURANT">COURANT</option>
                        <option value="EPARGNE">EPARGNE</option>
                    </select>
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Save Compte
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SaveCompte;
