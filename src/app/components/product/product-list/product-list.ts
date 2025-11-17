import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {

  products: Product[] = [];
  isLoading = false;
  error: string | null = null;

  newProduct: Product = { id: 0, name: '', price: 0, image: '' };

  editId: number | null = null;
  editProduct: Product = { id: 0, name: '', price: 0, image: '' };

  readonly fallbackImage = '/images/image-not-found.jpg';

  successMessage = '';
  messageTimeout: number = 0;

  constructor(private productService: ProductService) {}


  async ngOnInit(): Promise<void> {
    await this.loadProducts();
  }

  async loadProducts() {
    this.isLoading = true;
    this.error = null;
    try {
      this.products = await this.productService.getProducts();
    } catch (err) {
      this.error = 'Failed to load products';
    } finally {
      this.isLoading = false;
    }
  }

  validateImage(url: string): Promise<boolean> {
    return new Promise(resolve => {
      if (!url) return resolve(false);
      try {
        new URL(url);
      } catch {
        return resolve(false);
      }
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      setTimeout(() => resolve(false), 3000);
    });
  }

  private async ensureImageOrFallback(url: string, idSeed = 0): Promise<string> {
    const ok = await this.validateImage(url);
    return ok ? url : this.fallbackImage;
  }

  async addProduct(addForm: NgForm) {
    const name = this.newProduct.name?.trim();
    const price = Number(this.newProduct.price);

    if (!name) {
      this.error = 'Product name is required.';
      return;
    }
    if (!price || price <= 0) {
      this.error = 'Price cannot be less than 0.';
      return;
    }

    this.error = null;
    this.isLoading = true;

    try {
      const image = await this.ensureImageOrFallback(this.newProduct.image, Date.now());
      const product: Product = {
        id: Date.now(),
        name,
        price,
        image
      };

      await this.productService.addProduct(product);
      this.showSuccess('Product added successfully!');
      await this.loadProducts();

      this.newProduct = { id: 0, name: '', price: 0, image: '' };
      addForm.resetForm();
    } catch {
      this.error = 'Failed to add product.';
    } finally {
      this.isLoading = false;
    }
  }

  async enableEdit(product: Product) {
    this.editId = product.id;
    this.editProduct = { ...product };
  }

  cancelEdit() {
    this.editId = null;
    this.editProduct = { id: 0, name: '', price: 0, image: '' };
    this.error = null;
  }

  async saveEdit() {
    if (this.editId === null) return;

    const name = this.editProduct.name?.trim();
    const price = Number(this.editProduct.price);

    if (!name) {
      this.error = 'Product name is required.';
      return;
    }
    if (!price || price <= 0) {
      this.error = 'Price cannot be less than 0.';
      return;
    }

    this.isLoading = true;
    try {
      const image = await this.ensureImageOrFallback(this.editProduct.image, this.editProduct.id);
      const updated: Product = { ...this.editProduct, image, price };
      const res = await this.productService.updateProduct(updated);
      if (!res) {
        throw new Error('Update failed');
      }  else {
        this.showSuccess('Product updated successfully!');
      }
      await this.loadProducts();
      this.cancelEdit();
    } catch {
      this.error = 'Failed to save changes.';
    } finally {
      this.isLoading = false;
    }
  }

  async deleteProduct(id: number) {
    const ok = confirm('Are you sure you want to delete this product?');
    if (!ok) return;

    this.isLoading = true;
    try {
      const res = await this.productService.deleteProduct(id);
      if (!res) {
        throw new Error('Delete failed');
      } else {
        this.showSuccess('Product deleted successfully!');
      }
      await this.loadProducts();
    } catch {
      this.error = 'Failed to delete product.';
    } finally {
      this.isLoading = false;
    }
  }

  showSuccess(message: string) {
    this.successMessage = message;

    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    this.messageTimeout = setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }

  removeSuccessMessage() {
    if (this.messageTimeout) {
      this.successMessage = '';
      clearTimeout(this.messageTimeout);
    }
  }

  formatCurrency(value: number) {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(value);
  }
}

