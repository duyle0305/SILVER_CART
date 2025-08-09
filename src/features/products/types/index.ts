export interface ProductCategoryBrief {
  id: string
  code: string
  description: string
  label: string
  type: number
  listOfValueId: string
}

export interface ProductListItem {
  id: string
  name: string
  brand: string
  price: number
  description: string
  imageUrl: string
  categories: ProductCategoryBrief[]
}

export interface ProductSearchBody {
  keyword?: string
  categoryIds?: string[]
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortDirection?: boolean
  page: number
  pageSize: number
}

export interface ProductVariantValue {
  id: string
  valueId: string
  valueCode: string
  valueLabel: string
}

export interface ProductVariantDetail {
  id: string
  price: number
  discount: number
  stock: number
  isActive: boolean
  productVariantValues: ProductVariantValue[]
}

export interface ProductDetail {
  id: string
  name: string
  brand: string
  description: string | null
  videoPath: string
  weight: string
  height: string
  length: string
  width: string
  manufactureDate: string
  expirationDate: string
  categories: ProductCategoryBrief[]
  productVariants: ProductVariantDetail[]
}

export interface CreateProductPayload {
  name: string
  brand: string
  description: string
  videoPath: string
  weight: number
  height: number
  length: number
  width: number
  manufactureDate: string
  expirationDate: string
  valueCategoryIds: string[]
  productVariants: {
    price: number
    discount: number
    stock: number
    isActive: boolean
    productImages: {
      url: string
    }[]
    valueIds: string[]
  }[]
}

export interface ProductProperty {
  id: string
  code: string
  description: string
  label: string
  type: number
  listOfValueId: string
}
