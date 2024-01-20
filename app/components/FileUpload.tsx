import { Button, buttonVariants } from '@/components/Button';

interface FileUploadProps {
  buttonType: 'outline' | 'ghost';
  icon?: React.ReactNode;
  text: string;
  buttonSize: 'default' | 'sm' | 'lg' | 'nill';
  id: string;
}

export default function FileUpload({
  buttonType,
  icon,
  text,
  buttonSize,
  id,
}: FileUploadProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    if (file) {
      // todo: upload file to server
      // see UploadPdf in doc page
    }
  };

  return (
    <>
      <input
        id={id}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <Button variant={buttonType} size={buttonSize}>
        <label htmlFor={id}>
          <div className="flex items-center text-center">
            {icon}
            {text}
          </div>
        </label>
      </Button>
    </>
  );
}
