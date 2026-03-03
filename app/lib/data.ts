import { sql } from '@vercel/postgres';
import {
  FriendField,
  FriendsTableType,
  DebtForm,
  PaymentsTable,
  LatestPaymentRaw,
  User,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';



export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestPayments() {
  noStore();
  try {
    const data = await sql<LatestPaymentRaw>`
      SELECT payments.amount, friends.name, friends.image_url, friends.email, payments.id
      FROM payments
      JOIN friends ON payments.friend_id = friends.id
      ORDER BY payments.date DESC
      LIMIT 5`;

    const latestPayments = data.rows.map((payment) => ({
      ...payment,
      amount: formatCurrency(payment.amount),
    }));
    return latestPayments;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest payments.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const paymentCountPromise = sql`SELECT COUNT(*) FROM payments`;
    const friendCountPromise = sql`SELECT COUNT(*) FROM friends`;
    const paymentStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM payments`;

    const data = await Promise.all([
      paymentCountPromise,
      friendCountPromise,
      paymentStatusPromise,
    ]);

    const numberOfPayments = Number(data[0].rows[0].count ?? '0');
    const numberOfFriends = Number(data[1].rows[0].count ?? '0');
    const totalPaidPayments = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingPayments = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfFriends,
      numberOfPayments,
      totalPaidPayments,
      totalPendingPayments,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredPayments(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const payments = await sql<PaymentsTable>`
      SELECT
        payments.id,
        payments.amount,
        payments.date,
        payments.status,
        friends.name,
        friends.email,
        friends.image_url
      FROM payments
      JOIN friends ON payments.friend_id = friends.id
      WHERE
        friends.name ILIKE ${`%${query}%`} OR
        friends.email ILIKE ${`%${query}%`} OR
        payments.amount::text ILIKE ${`%${query}%`} OR
        payments.date::text ILIKE ${`%${query}%`} OR
        payments.status ILIKE ${`%${query}%`}
      ORDER BY payments.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return payments.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch payments.');
  }
}

export async function fetchPaymentsPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM payments
    JOIN friends ON payments.friend_id = friends.id
    WHERE
      friends.name ILIKE ${`%${query}%`} OR
      friends.email ILIKE ${`%${query}%`} OR
      payments.amount::text ILIKE ${`%${query}%`} OR
      payments.date::text ILIKE ${`%${query}%`} OR
      payments.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of payments.');
  }
}

export async function fetchPaymentById(id: string) {
  noStore();
  try {
    const data = await sql<DebtForm>`
      SELECT
        payments.id,
        payments.friend_id,
        payments.amount,
        payments.status
      FROM payments
      WHERE payments.id = ${id};
    `;

    const payment = data.rows.map((payment) => ({
      ...payment,
      // Convert amount from cents to dollars
      amount: payment.amount / 100,
    }));
    console.log(payment); // Payment is an empty array []
    return payment[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch payment.');
  }
}

export async function fetchFriends() {
  noStore();
  try {
    const data = await sql<FriendField>`
      SELECT
        id,
        name
      FROM friends
      ORDER BY name ASC
    `;

    const friends = data.rows;
    return friends;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all friends.');
  }
}

export async function fetchFilteredFriends(query: string) {
  noStore();
  try {
    const data = await sql<FriendsTableType>`
		SELECT
		  friends.id,
		  friends.name,
		  friends.email,
		  friends.image_url,
		  COUNT(payments.id) AS total_payments,
		  SUM(CASE WHEN payments.status = 'pending' THEN payments.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN payments.status = 'paid' THEN payments.amount ELSE 0 END) AS total_paid
		FROM friends
		LEFT JOIN payments ON friends.id = payments.friend_id
		WHERE
		  friends.name ILIKE ${`%${query}%`} OR
        friends.email ILIKE ${`%${query}%`}
		GROUP BY friends.id, friends.name, friends.email, friends.image_url
		ORDER BY friends.name ASC
	  `;

    const friends = data.rows.map((friend) => ({
      ...friend,
      total_pending: formatCurrency(friend.total_pending),
      total_paid: formatCurrency(friend.total_paid),
    }));

    return friends;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch friend table.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
