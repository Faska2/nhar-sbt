export type UserRole = "ADMIN" | "CLIENT";

export type User = {
  id: string;
  email: string;
  role: UserRole;
  name?: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type ProductImage = { id: string; url: string };

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
};

export type Cart = {
  id: string;
  items: CartItem[];
};

export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  nameSnapshot: string;
  imageUrl?: string | null;
};

export type Order = {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
  shippingName: string;
  shippingAddress1: string;
  shippingCity: string;
  shippingCountry: string;
  createdAt: string;
  items: OrderItem[];
};

