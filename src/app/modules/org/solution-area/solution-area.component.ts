import { Component, effect, OnInit } from '@angular/core';
import { UserService } from '../../../Service/user.service';
import { signal, computed } from '@angular/core';
import { NgFor } from '@angular/common';
import { searchHide } from '../../../shared/search-store';
@Component({
  selector: 'app-solution-area',
  imports: [NgFor],
  templateUrl: './solution-area.component.html',
  styleUrl: './solution-area.component.scss',
})
export class SolutionAreaComponent implements OnInit {
  constructor(private userService: UserService) {
    searchHide.set(false);
    effect(() => {
      console.log('Cart updated:', this.cart());
    });
    const count = signal(4);
    const doubleCount = computed(() => count() * 2);
    console.log(doubleCount());
  }
  ngOnInit(): void {
    this.onBreadCrumb();
  }

  breadCrumb = ['Organization', 'Solution Area'];

  onBreadCrumb() {
    this.userService.mysubject$.next(this.breadCrumb);
  }

  // Product List
  chnageArrayvalue = signal({
    name: 'Gurmet',
    class: '12th',
  });
  products = signal<any>([
    { id: 1, name: 'Paracetamol', price: 20 },
    { id: 2, name: 'Dolo 650', price: 25 },
    { id: 3, name: 'Disprin', price: 15 },
  ]);

  cart = signal<any[]>([]);

  cartCount = computed(() => this.cart().length);

  addToCart(product: any) {
    const currentCart = this.cart();
    this.cart.set([...currentCart, product]);
    this.showToast(`${product.name} added to cart`);
  }

  removeFromCart(product: any) {
    const currentCart = this.cart();
    const updatedCart = currentCart.filter((item) => item.id !== product.id);
    this.cart.set(updatedCart);
    this.showToast(`${product.name} removed from cart`);
  }

  showToast(message: string) {
    alert(message);
  }
}
