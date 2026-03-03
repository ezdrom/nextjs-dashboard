import { deletePayment } from '@/app/lib/actions';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreatePayment() {
  return (
    <Link
      href="/dashboard/payments/create"
      className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
    >
      <span className="hidden md:block">Create Payment</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdatePayment({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/payments/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeletePayment({ id }: { id: string }) {
  const deletePaymentWithId = deletePayment.bind(null, id);
  
  return (
    <form action={deletePaymentWithId} >
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
