import { fetchFriends, fetchPaymentById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/payments/breadcrumbs";
import Form from "@/app/ui/payments/edit-form";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Edit Payments',
};
export default async function Page({params}: {params: {id: string}}) {
    const id = params.id;
    const [payment, friends] = await Promise.all([
        fetchPaymentById(id),
        fetchFriends()
    ])

    if(!payment){
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Payments', href: '/dashboard/payments' },
                    {
                        label: 'Edit Payment',
                        href: `/dashboard/payments/${id}/edit`,
                        active: true,
                    },
                ]} />
            <Form payment={payment} friends={friends} />
        </main>
    )
}