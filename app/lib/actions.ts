'use server';

import { signIn } from '@/auth';
import { sql } from '@vercel/postgres';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const FormSchema = z.object({
    id: z.string(),
    friendId: z.string({ invalid_type_error: 'Please select a friend.' }),
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    date: z.string(),
    status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an payment status.' })
})

const CreatePayment = FormSchema.omit({ id: true, date: true });
const UpdatePayment = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
        friendId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
export async function createPayment(prevState: State, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreatePayment.safeParse({
        friendId: formData.get('friendId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to create Payment.'
        };
    }

    // Prepare data for insertion into the database
    const { friendId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try {
        await sql`
            INSERT INTO payments (friend_id, amount, status, date)
            VALUES (${friendId}, ${amountInCents}, ${status}, ${date})
        `;
    }
    catch (error) {
        // if a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Payment.'
        }
    }
    // console.log(rawFormData);
    // console.log(typeof rawFormData.amount);

    // revalidate the cache for the payments page and redirect the user.
    revalidatePath('/dashboard/payments');
    redirect('/dashboard/payments');
}

export async function updatePayment(id: string, formData: FormData) {
    const { friendId, amount, status } = UpdatePayment.parse({
        friendId: formData.get('friendId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE payments
            SET friend_id = ${friendId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Payment. ' }
    }

    revalidatePath('/dashboard/payments');
    redirect('/dashboard/payments');
}

export async function deletePayment(id: string) {
    // throw new Error('Failed to Delete Payment');
    // Unreachable code block
    try {
        await sql`DELETE FROM payments WHERE id = ${id}`;
        revalidatePath('/dashboard/payments');
        return { message: 'Deleted Payment. ' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Payment.' };
    }
}