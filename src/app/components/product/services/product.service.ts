import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [
    {
      id: 1,
      name: 'Laptop Pro 15',
      price: 1499.99,
      image: 'https://picsum.photos/400/300?random=1'
    },
    {
      id: 2,
      name: 'Wireless Keyboard',
      price: 59.99,
      image: 'https://picsum.photos/400/300?random=2'
    },
    {
      id: 3,
      name: 'Gaming Mouse',
      price: 79.99,
      image: 'https://picsum.photos/400/300?random=3'
    }
  ];

  private delay<T>(value: T, timeOutInMS = 250): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(value), timeOutInMS));
  }

  async getProducts(): Promise<Product[]> {
    return this.delay([...this.products]);
  }

  async addProduct(product: Product): Promise<Product> {
    this.products.push(product);
    return this.delay(product);
  }

  async updateProduct(updated: Product): Promise<Product | null> {
    const index = this.products.findIndex(p => p.id === updated.id);
    if (index === -1) return this.delay(null);
    this.products[index] = { ...updated };
    return this.delay(this.products[index]);
  }

  async deleteProduct(id: number): Promise<boolean> {
    const before = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.delay(this.products.length < before);
  }


}
