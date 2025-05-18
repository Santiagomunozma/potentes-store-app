type Product = {
  id: string;
  name: string;
  description: string;
  careInstructions: string;
  sku: string;
  imageUrl: string;
  stock: number;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  inventories: {
    id: string;
    color: {
      id: string;
      color: string;
      createdAt: string;
      updatedAt: string;
    };
    size: {
      id: string;
      size: string;
      createdAt: string;
      updatedAt: string;
    };
    quantity: number;
    createdAt: string;
    updatedAt: string;
  }[];
};

export type { Product };
