import type { SortType } from '@/constants'
import type { ProductType } from '@/features/products/constants'

export interface productCategory {
  id: string
  categoryName: string
}

export interface ProductImage {
  id: string
  imagePath: string
  imageName: string
}

export interface ProductItem {
  id: string
  sku: string
  originalPrice: number
  discountedPrice: number
  weight: number
  stock: number
  isActive: boolean
  productImages: ProductImage[]
}

export interface ProductVariant {
  id: string
  variantName: string
  isActive: boolean
  productItems: ProductItem[]
}

export interface ProductData {
  id: string
  productName: string
  description: string
  videoPath: string
  productType: ProductType
  creationDate: string
  productCategories: productCategory[]
  variants: ProductVariant[]
}

export interface ProductQueryParams {
  'PagingRequest.Page'?: number
  'PagingRequest.PageSize'?: number
  'PagingRequest.SortType'?: SortType
  'PagingRequest.ColName'?: string
  ProductName?: string
  ProductType?: string
}

export interface ProductDataParam {
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
