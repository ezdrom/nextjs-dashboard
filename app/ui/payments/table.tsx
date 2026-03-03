import Image from 'next/image';
import { UpdatePayment, DeletePayment } from '@/app/ui/payments/buttons';
import PaymentStatus from '@/app/ui/payments/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredPayments } from '@/app/lib/data';

export default async function PaymentsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const payments = await fetchFilteredPayments(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {payments?.map((payment) => (
              <div
                key={payment.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={payment.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${payment.name}'s profile picture`}
                      />
                      <p>{payment.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{payment.email}</p>
                  </div>
                  <PaymentStatus status={payment.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p>{formatDateToLocal(payment.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdatePayment id={payment.id} />
                    <DeletePayment id={payment.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Friend
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {payments?.map((payment) => (
                <tr
                  key={payment.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={payment.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${payment.name}'s profile picture`}
                      />
                      <p>{payment.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {payment.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(payment.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <PaymentStatus status={payment.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePayment id={payment.id} />
                      <DeletePayment id={payment.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
