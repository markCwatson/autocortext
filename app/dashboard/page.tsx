export default async function MainDashboard() {
  return (
    <div className="text-center p-4">
      <iframe
        title="Power BI Report"
        src={process.env.EMBED_URL}
        allowFullScreen={true}
        style={{ width: '100%', height: '87vh' }}
      />
    </div>
  );
}
