import { fetchFriends } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/payments/breadcrumbs";
import Form from "@/app/ui/payments/create-form";
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Create Payments',
};
export default async function Page() {
    const friends = await fetchFriends();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Payments', href: '/dashboard/payments' },
                    {
                        label: 'Create Payment',
                        href: '/dashboard/payments/create',
                        active: true
                    }
                ]}
            />
            <Form friends={friends} />
        </main>
    )
}