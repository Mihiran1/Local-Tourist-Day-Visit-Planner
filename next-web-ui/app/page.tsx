import { redirect } from 'next/navigation';

export default function Home() {
  // වෙනත් path එකක් නැත්නම් කෙලින්ම /login එකට යවනවා
  redirect('/login');
}
