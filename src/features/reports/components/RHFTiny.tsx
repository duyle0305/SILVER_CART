import { config } from '@/config'
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
            apiKey={config.tinyMCEApiKey}
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
