'use client';

import { FriendField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createPayment } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function Form({ friends }: { friends: FriendField[] }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createPayment, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-payne-50 p-4 md:p-6">
        {/* Friend Name */}
        <div className="mb-4">
          <label htmlFor="friend" className="mb-2 block text-sm font-medium">
            Choose friend
          </label>
          <div className="relative">
            <select
              id="friend"
              name="friendId"
              className="peer block w-full cursor-pointer rounded-md border border-payne-200 py-2 pl-10 text-sm outline-2 placeholder:text-payne-500"
              defaultValue=""
              // use required or this aria-describedby 
              aria-describedby='friend-error'
            >
              <option value="" disabled>
                Select a friend
              </option>
              {friends.map((name) => (
                <option key={name.id} value={name.id}>
                  {name.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-payne-500" />
          </div>
          <div id='friend-error' aria-live='polite' aria-atomic="true">
            {state.errors?.friendId &&
              state.errors.friendId.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Payment Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-payne-200 py-2 pl-10 text-sm outline-2 placeholder:text-payne-500"
                // use required or this aria-describedby 
                aria-describedby='amount-error'
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-payne-500 peer-focus:text-payne-700" />
            </div>
            <div id='amount-error' aria-live='polite' aria-atomic="true">
              {state.errors?.amount &&
                state.errors.amount.map((error: string) => (
                  <p className='mt-2 text-sm text-red-500' key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the payment status
          </legend>
          <div className="rounded-md border border-payne-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-payne-300 bg-payne-100 text-payne-600 focus:ring-2"
                  // use required or this aria-describedby 
                  aria-describedby='status-error'
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-payne-100 px-3 py-1.5 text-xs font-medium text-payne-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-payne-300 bg-payne-100 text-payne-600 focus:ring-2"
                  // use required or this aria-describedby 
                  aria-describedby='status-error'
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-payne-600 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          {state.errors?.status &&
            state.errors.status.map((error: string) => (
              <p className='mt-2 text-sm text-red-500' key={error}>
                {error}
              </p>
            ))}
        </fieldset>
        <p className='mt-2 text-sm text-red-500'>{state.message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/payments"
          className="flex h-10 items-center rounded-lg bg-payne-100 px-4 text-sm font-medium text-payne-600 transition-colors hover:bg-payne-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Payment</Button>
      </div>
    </form>
  );
}
