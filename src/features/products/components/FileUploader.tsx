import { Typography } from '@mui/material'
import { UploadBox } from './styles/CreateUpdateProductPage.styles'
import { useRef, type ChangeEvent } from 'react'

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void
  accept: string
  multiple?: boolean
  label: string
  icon: React.ReactNode
}

const FileUploader = ({
  onFileSelect,
  accept,
  multiple = false,
  label,
  icon,
}: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      onFileSelect(Array.from(files))
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept={accept}
        multiple={multiple}
      />
      <UploadBox onClick={() => fileInputRef.current?.click()}>
        {icon}
        <Typography variant="body2">{label}</Typography>
      </UploadBox>
    </>
  )
}

export default FileUploader
