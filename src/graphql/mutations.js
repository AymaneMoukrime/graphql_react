import { gql } from '@apollo/client';

export const SAVE_COMPTE = gql`
    mutation SaveCompte($compte: CompteRequest!) {
        saveCompte(compte: $compte) {
            id
            solde
            dateCreation
            type
        }
    }
`;

export const ADD_TRANSACTION = gql`
    mutation AddTransaction($transaction: TransactionRequest!) {
        addTransaction(transaction: $transaction) {
            id
            montant
            date
            type
            compte {
                id
            }
        }
    }
`;
