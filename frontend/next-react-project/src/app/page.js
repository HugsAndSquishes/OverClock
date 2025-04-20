import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/attendance');
}



/*
export default function Home() {
  return (
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <h1>More react to come</h1>
    </main>
  );
}
*/
