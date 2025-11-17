import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    const button = document.querySelector('.hamburger') as HTMLElement;
    const nav = document.querySelector('.nav-links') as HTMLElement;

    if (button) button.classList.toggle('open', this.menuOpen);
    if (nav) {
      nav.classList.remove('mobile-open', 'mobile-collapsed');
      nav.classList.add(this.menuOpen ? 'mobile-open' : 'mobile-collapsed');
    }
  }

  closeMenu() {
    this.menuOpen = false;
    const button = document.querySelector('.hamburger') as HTMLElement;
    const nav = document.querySelector('.nav-links') as HTMLElement;

    button?.classList.remove('open');
    nav?.classList.add('mobile-collapsed');
  }

}
