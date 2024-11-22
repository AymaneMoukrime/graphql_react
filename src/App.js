import React from 'react';
import SaveCompte from './Component/form';
import DisplayComptes from './Component/dispalcomptes';
import TransactionStats from './Component/transactionstats';


const App = () => {
    return (
        <div>
            <h1>GraphQL Client</h1>
            <SaveCompte />
            <DisplayComptes />
            <TransactionStats/>
            
        </div>
    );
};

export default App;
