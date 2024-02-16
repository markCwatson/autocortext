import { useFormState } from "react-dom";
import { uploadS3 } from '@/actions/uploadS3';
import { Button } from '@/components/Button';

interface FileUploadProps {
  buttonType: 'outline' | 'ghost';
  icon?: React.ReactNode;
  text: string;
  buttonSize: 'default' | 'sm' | 'lg' | 'nill';
}

const initialState = { message: '', status: '' };

export default function FileUpload({
  buttonType,
  icon,
  text,
  buttonSize,
}: FileUploadProps) {
  const [state, formAction] = useFormState(uploadS3, initialState);

  return (
    <>
    <form action={formAction}>
      <input
        id="file"
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
      />
      <Button variant={buttonType} size={buttonSize}>
        <label htmlFor="file">
          <div className="flex items-center text-center cursor-pointer">
            {icon}
            {text}
          </div>
        </label>
      </Button>
      </form>
      {state?.status && (
        <div className={`pt-2 text-red-500`}>
          {state?.message}
        </div>
      )}
    </>
  );
}
