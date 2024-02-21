import { NAV_BAR_HEIGHT } from '@/lib/constants';
import { CSSProperties } from 'react';

const mainContainerStyle: CSSProperties = {
  height: `calc(100vh - ${NAV_BAR_HEIGHT})`,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

export default async function MainDashboard() {
  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8" style={mainContainerStyle}>
      <div className="text-center p-4">
        <iframe
          title="Power BI Report"
          src={process.env.EMBED_URL}
          allowFullScreen={true}
          style={{ width: '100%', height: '87vh' }}
        />
      </div>
    </main>
  );
}
