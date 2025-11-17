import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { NewProduct, Product } from '../models/product.model';
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

  newProduct: NewProduct = { name: '', price: 0, image: '' };

  editId: number | null = null;
  editProduct: Product | null = null;

  readonly fallbackImage = '/images/image-not-found.jpg';

  successMessage = '';
  errorMessage = '';
  messageTimeout: number = 0;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showMessage('Failed to load products');
      }
    });
  }

  addProduct(form: NgForm) {
    if (form.invalid) return;

    if (!this.newProduct.image) {
      this.newProduct.image = this.fallbackImage;
    }

    this.productService.addProduct(this.newProduct).subscribe({
      next: (product) => {
        this.products.push(product);
        this.newProduct = { name: '', price: 0, image: '' };
        form.resetForm();
        this.showMessage('Product added successfully!');
      },
      error: () => this.showMessage('Failed to add product')
    });
  }

  edit(p: Product) {
    this.editId = p.id!;
    this.editProduct = { ...p };
  }

  saveEdit(form: NgForm) {
    if (!this.editProduct || form.invalid) return;

    if (!this.editProduct.image) {
      this.editProduct.image = 'assets/no-image.png';
    }

    this.productService.updateProduct(this.editProduct).subscribe({
      next: (updated) => {
        const index = this.products.findIndex(p => p.id === updated.id);
        if (index > -1) this.products[index] = updated;
        this.editId = null;
        this.editProduct = null;
        this.showMessage('Product updated successfully!');
      },
      error: () => this.showMessage('Failed to update product')
    });
  }

  cancelEdit() {
    this.editId = null;
    this.editProduct = null;
  }

  deleteProduct(id: number) {
    if (id) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          this.showMessage('Product deleted successfully!');
        },
        error: () => this.showMessage('Failed to delete product')
      });
    }
  }

  showMessage(msg: string, type = 'success') {
    this.successMessage = msg;

    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    this.messageTimeout = setTimeout(() => {
      this.successMessage = '';
    }, 5000);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
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

