import { ArrowUpIcon } from '@heroicons/react/20/solid';
import { Button, buttonVariants } from '@/components/Button';

export default function FileUpload() {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    if (file) {
      // todo: upload file to server
      // see UploadPdf in doc page
    }
  };

  return (
    <div className="hover:bg-my-color5 cursor-pointer">
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <Button className={buttonVariants({ variant: 'outline' })}>
        <ArrowUpIcon className="w-6 h-6 mx-auto text-my-color1 mr-2" />
        <label htmlFor="file-upload" className="cursor-pointer">
          Upload File
        </label>
      </Button>
    </div>
  );
}
