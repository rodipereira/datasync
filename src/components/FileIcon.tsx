
import { File, FileText } from "lucide-react";

interface FileIconProps {
  fileType: string;
}

const FileIcon = ({ fileType }: FileIconProps) => {
  if (fileType.includes('pdf')) {
    return <FileText className="h-6 w-6 text-red-500" />;
  } else if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) {
    return <FileText className="h-6 w-6 text-green-500" />;
  } else {
    return <File className="h-6 w-6 text-blue-500" />;
  }
};

export default FileIcon;
