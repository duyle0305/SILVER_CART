import { BaseTable } from '@/components/common/BaseTable'
import type { HeadCell } from '@/components/common/BaseTableHead'
import type { SubCategory } from '@/features/categories/types'
import { useTable } from '@/hooks/useTable'
import AddLinkIcon from '@mui/icons-material/AddLink'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import { Button, IconButton, TableCell, TableRow, Tooltip } from '@mui/material'
import { useState } from 'react'
import UpdateSubCategoryDialog from './UpdateSubCategoryDialog'
import { useLinkSubCategory } from '../hooks/useLinkSubCategory'
import { useQueryClient } from '@tanstack/react-query'
import { useNotification } from '@/hooks/useNotification'
import { useDialog } from '@/hooks/useDialog'

const headCells: readonly HeadCell<SubCategory>[] = [
  { id: 'code', label: 'Code' },
  { id: 'label', label: 'Label' },
  { id: 'description', label: 'Description' },
  { id: 'childrentLabel', label: 'Linked Categories' },
]

interface SubCategoryTableProps {
  subCategories: SubCategory[]
}

const SubCategoryTable = ({ subCategories }: SubCategoryTableProps) => {
  const table = useTable<SubCategory>({ initialOrderBy: 'code' })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null)

  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  const { showDialog, hideDialog } = useDialog()
  const { mutate: linkSubCategory } = useLinkSubCategory()

  const handleOpenDialog = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setEditingSubCategory(null)
    setIsDialogOpen(false)
  }

  const handleUnlink = (subCategoryToUnlink: SubCategory) => {
    showDialog({
      title: 'Confirm Unlink',
      content: `Are you sure you want to unlink "${subCategoryToUnlink.label}"?`,
      actions: (
        <>
          <Button onClick={hideDialog}>Cancel</Button>
          <Button
            onClick={() => {
              linkSubCategory(
                {
                  categoryId: subCategoryToUnlink.id,
                  subCategoryId: null,
                },
                {
                  onSuccess: () => {
                    showNotification(
                      'Successfully unlinked sub-category.',
                      'success'
                    )
                    queryClient.invalidateQueries({ queryKey: ['categories'] })
                    hideDialog()
                  },
                  onError: (error) => {
                    showNotification(
                      error.message || 'Failed to unlink sub-category.',
                      'error'
                    )
                  },
                }
              )
            }}
            color="error"
          >
            Unlink
          </Button>
        </>
      ),
    })
  }

  const renderRow = (row: SubCategory, _: boolean, index: number) => (
    <TableRow key={row.id}>
      <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>
      <TableCell>{row.code}</TableCell>
      <TableCell>{row.label}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell>{row.childrentLabel}</TableCell>
      <TableCell>
        <Tooltip title="Link to another category">
          <IconButton color="primary" onClick={() => handleOpenDialog(row)}>
            <AddLinkIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Unlink this sub-category">
          <IconButton color="error" onClick={() => handleUnlink(row)}>
            <LinkOffIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )

  return (
    <>
      <BaseTable
        data={subCategories}
        headCells={headCells}
        isLoading={false}
        table={table}
        pageCount={Math.ceil(subCategories.length / table.rowsPerPage)}
        toolbar={<></>}
        renderRow={renderRow}
        showCheckbox={false}
        allowModify={true}
        isSortable={false}
        showPagination={false}
      />
      <UpdateSubCategoryDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        subCategory={editingSubCategory}
      />
    </>
  )
}

export default SubCategoryTable
