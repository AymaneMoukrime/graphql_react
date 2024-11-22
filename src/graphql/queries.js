import { gql } from '@apollo/client';

export const ALL_COMPTES = gql`
    query GetAllComptes {
        allComptes {
            id
            solde
            dateCreation
            type
        }
    }
`;

export const COMPTE_BY_ID = gql`
    query GetCompteById($id: ID!) {
        compteById(id: $id) {
            id
            solde
            dateCreation
            type
        }
    }
`;

export const TRANSACTION_STATS = gql`
    query GetTransactionStats {
        transactionStats {
            count
            sumDepots
            sumRetraits
        }
    }
`;
export const DELETE_COMPTE = gql`
    query DeleteCompte($id: ID!) {
        deleteCompte(id: $id) {
            id
            solde
            dateCreation
            type
        }
    }
`;

export const FIND_BY_TYPE = gql`
    query FindByType($type: TypeCompte!) {
        findByType(type: $type) {
            id
            solde
            dateCreation
            type
        }
    }
`;

export const COMPTE_TRANSACTIONS = gql`
    query GetCompteTransactions($id: ID!) {
        compteTransactions(id: $id) {
            id
            montant
            date
            type
        }
    }
`;