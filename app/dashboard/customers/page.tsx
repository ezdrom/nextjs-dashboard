import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: 'Customers',
};
export default function Customers() {
  return <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
    Dashboard
  </h1>
}