import { mainContainerStyle } from '@/lib/mainContainerStyle';

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
