import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  ngOnInit() {
    const lightIcon = document.getElementById('light-icon')!;
    const darkIcon = document.getElementById('dark-icon')!;

    const toggleButton = document.querySelector('.theme-toggle')!;
    const screenshotLight = document.querySelector('.screenshot-light')!;
    const screenshotDark = document.querySelector('.screenshot-dark')!;

    const htmlElement = document.documentElement;

    toggleButton.addEventListener('click', () => {
      if (htmlElement.getAttribute('data-theme') === 'dark') {
        htmlElement.removeAttribute('data-theme');
        htmlElement.style.setProperty('color-scheme', 'light');

        lightIcon.setAttribute('display', 'inline-block');
        darkIcon.setAttribute('display', 'none');

        screenshotLight.classList.remove('hidden');
        screenshotDark.classList.add('hidden');
      } else {
        htmlElement.setAttribute('data-theme', 'dark');
        htmlElement.style.setProperty('color-scheme', 'dark');

        lightIcon.setAttribute('display', 'none');
        darkIcon.setAttribute('display', 'inline-block');

        screenshotLight.classList.add('hidden');
        screenshotDark.classList.remove('hidden');
      }
    });

    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );
    let darkMode = darkModeMediaQuery.matches;

    // console.log("DARK MODE?", darkMode);
    darkIcon.setAttribute('display', 'none');
  }
}
