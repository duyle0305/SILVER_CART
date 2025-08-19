import {
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  StyledToolbar,
  StyledToolbarContainer,
} from './styles/ReportToolbar.style'
import SearchIcon from '@mui/icons-material/Search'

interface ReportToolbarProps {
  keyword: string
  onKeywordChange: (value: string) => void
}

export default function ReportToolbar({
  keyword,
  onKeywordChange,
}: ReportToolbarProps) {
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    onKeywordChange(event.target.value)
  }

  return (
    <StyledToolbarContainer>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          All reports
        </Typography>
      </Stack>
      <StyledToolbar>
        <Grid>
          <TextField
            fullWidth
            size="small"
            name="keyword"
            placeholder="Search report..."
            value={keyword}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </StyledToolbar>
    </StyledToolbarContainer>
  )
}
