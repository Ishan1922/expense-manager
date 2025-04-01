export interface Transaction {
    id: number;
    amount: number;
    created_at: string;
    description: string;
    transaction_type: number;
    category_id: number;
}

export interface Category {
    id: number;
    name: string;
    type_id: number;
}

export const API_URL = "https://expense-manager-27qr.onrender.com";