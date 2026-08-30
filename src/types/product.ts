export enum ProductStatus {
  PAUSE = 'PAUSE',
  PROCESS = 'PROCESS',
  DELETE = 'DELETE',
}

export enum ProductCollection {
  FRUIT_VEGETABLE = 'FRUIT_VEGETABLE',
  MEAT = 'MEAT',
  DAIRY = 'DAIRY',
  BAKERY = 'BAKERY',
  BEVERAGE = 'BEVERAGE',
  SNACK = 'SNACK',
  OTHER = 'OTHER',
}

export enum ProductUnit {
  KG = 'KG',
  LITER = 'LITER',
  PIECE = 'PIECE',
}

export interface Product {
  _id: string
  productStatus: ProductStatus
  productCollection: ProductCollection
  productName: string
  productPrice: number
  productLeftCount: number
  productUnit: ProductUnit
  productVolume: number
  productDesc?: string
  productImages: string[]
  productViews: number
  createdAt: string
  updatedAt: string
}