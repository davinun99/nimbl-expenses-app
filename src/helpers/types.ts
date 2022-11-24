import { User } from '@react-native-google-signin/google-signin';

export type UserInfo = User & {
	tokens: {
		idToken: string;
		accessToken: string;
	};
};
type KPI = {
	kpi_frequency: 'Monthly';
	kpi_goal_value: 16;
	kpi_id: 3;
	kpi_level: 1;
	kpi_name: 'Calls booked';
};
export type NimblUser = {
	city: string;
	kpi: Array<KPI>;
	recruiter_type_id: number;
	role: string;
	user_id: number;
};
export type ExpenseCategory = {
	expense_category_description: string;
	expense_category_id: number;
	external_reference: string;
};
export type ExpenseDocument = {
	created_date: string;
	expense_document_id: number;
	filename: string;
	s3_bucket: string;
	s3_document_key: string;
};
export type ExpensePayMethod = {
	card_alias: string;
	card_name: string;
	card_number: string;
	is_default_card: boolean;
	nimbl_user_id: 11;
	payment_method_id: number;
};

export type NewExpense = {
	amount: number | null;
	expense_category_id: string;
	expense_currency: string;
	expense_date: string;
	expense_description: string;
	expense_pay_method_id: number | null;
};
export type Expense = {
	amount: number;
	expense_category: ExpenseCategory | undefined;
	expense_category_id: number;
	expense_currency: string;
	expense_date: string;
	expense_description: string;
	expense_document: ExpenseDocument | undefined;
	expense_document_id: number;
	expense_id: number;
	expense_pay_method_id: number;
	expense_payment_method: ExpensePayMethod | undefined;
};
