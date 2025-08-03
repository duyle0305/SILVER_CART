import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

export const uploadFile = async (
  file: File,
  folder: 'images' | 'videos'
): Promise<string> => {
  const fileRef = ref(storage, `${folder}/${file.name}-${uuidv4()}`)
  await uploadBytes(fileRef, file)
  const downloadURL = await getDownloadURL(fileRef)
  return downloadURL
}
