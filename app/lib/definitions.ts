// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Friend = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Payment = {
  id: string;
  friend_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestPayment = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestPaymentRaw = {
  id: string;
  amount: number;      // from payments.amount
  name: string;        // from friends.name
  email: string;       // from friends.email
  image_url: string;   // from friends.image_url
};
export type PaymentsTable = {
  id: string;
  friend_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type FriendsTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_payments: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedFriendsTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_payments: number;
  total_pending: string;
  total_paid: string;
};

export type FriendField = {
  id: string;
  name: string;
};

export type DebtForm = {
  id: string;
  friend_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
