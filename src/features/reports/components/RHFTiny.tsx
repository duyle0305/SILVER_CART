import { FormControl, FormHelperText } from '@mui/material'
import { Editor } from '@tinymce/tinymce-react'
import { Controller, useFormContext } from 'react-hook-form'

export function RHFTiny({ name }: { name: string }) {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth error={!!fieldState.error}>
          <Editor
            apiKey="xzlg8gzxxjdykegtbp3ejlfy3zv50kfvo5yk4ezi4oe7dm46"
            value={field.value ?? ''}
            init={{
              menubar: false,
              plugins: 'lists link table code image',
              toolbar:
                'undo redo | bold italic underline | bullist numlist | link table | code',
              height: 300,
            }}
            onEditorChange={(v) => field.onChange(v)}
            onBlur={field.onBlur}
          />
          {!!fieldState.error && (
            <FormHelperText>{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}
