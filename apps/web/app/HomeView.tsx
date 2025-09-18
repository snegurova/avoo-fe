'use client';
import { Button } from '@ui/Button';

export type Props = {
  data: {
    message: string;
  };
};

export const HomeView = ({data} : Props) => {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">AVOO Web (Next.js)</h1>
      <p className="opacity-80">
        Shared UI below comes from <code>packages/ui</code>.
      </p>
          <Button onClick={() => console.log('Hello from shared UI!')}>Shared Button</Button>
        <p className="opacity-80">{data.message}</p>
    </main>
  );
}

export default HomeView;