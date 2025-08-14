import { useNotification } from '@/hooks/useNotification'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Editor } from '@tinymce/tinymce-react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useRespondFeedback } from './hooks/useRespondFeedback'
import {
  respondFeedbackSchema,
  type RespondFeedbackFormInput,
  type RespondFeedbackFormOutput,
} from './schemas'

export default function RespondFeedbackPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const { mutate, isPending } = useRespondFeedback()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RespondFeedbackFormInput>({
    resolver: zodResolver(respondFeedbackSchema),
    defaultValues: {
      responseMessage: '',
      responseAttachment: '',
    },
  })

  const onSubmit = (raw: RespondFeedbackFormInput) => {
    const parsed: RespondFeedbackFormOutput = respondFeedbackSchema.parse(raw)

    if (!id) return

    mutate(
      {
        feedbackId: id,
        responseAttachment: parsed.responseAttachment ?? '',
        responseMessage: parsed.responseMessage.trim(),
      },
      {
        onSuccess: () => {
          showNotification('Feedback responded successfully!', 'success')
          navigate(`/feedbacks/${id}`)
        },
        onError: (e: any) => {
          showNotification(e?.message || 'Failed to respond.', 'error')
        },
      }
    )
  }

  return (
    <Box width="100%" mt={4}>
      <Paper component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Respond to Feedback
        </Typography>

        <Stack spacing={3} mt={2}>
          <Controller
            name="responseMessage"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <Editor
                  apiKey="xzlg8gzxxjdykegtbp3ejlfy3zv50kfvo5yk4ezi4oe7dm46"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: 'link lists code table',
                    toolbar:
                      'undo redo | bold italic underline | bullist numlist | link | code',
                    branding: false,
                  }}
                  value={field.value}
                  onEditorChange={field.onChange}
                  onBlur={field.onBlur}
                />
                {fieldState.error && (
                  <FormHelperText>{fieldState.error.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <TextField
            {...register('responseAttachment')}
            label="Attachment URL"
            fullWidth
            placeholder="https://example.com/file.pdf"
            error={!!errors.responseAttachment}
            helperText={errors.responseAttachment?.message}
          />

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? 'Sending...' : 'Send Response'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}
