# Product Management Web Application

## Overview

This is a **Product Management web application** built with **Angular**. It allows users to:

- Add new products.
- Edit existing product details.
- Delete products.
- View a list of products.

The application is designed as a **Single-page application (SPA)** with responsive design for mobile and desktop devices. It includes **Cypress integration tests** to verify key functionalities.

---

## Features

- Form validation for required fields and price constraints.
- Smooth scrolling between sections without page reload.
- Responsive design with a hamburger menu for mobile devices.
- Inline editing of product details.
- Success and error messages for user interactions.
- Integration tests for adding, editing, deleting, and validating products.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)  
- [Angular CLI](https://angular.io/cli) (v20)  
- npm or yarn package manager  

Optional for testing:  
- [Cypress](https://www.cypress.io/) (installed as a dev dependency)

---

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/rohitkdd/product-management.git
cd product-web
```
2. **Install dependencies**
```bash
npm install
# or
yarn install
```
3. **Start the application**
```bash
npm run dev 
# or
ng serve
```
Open your browser at http://localhost:4200
4. **(Optional) Start mock API server**
```bash
npm install -g json-server
json-server --watch db.json --port 3000
```
Make sure to update the API URL in your Angular service if needed.

### Static Files

- **public/**: Contains static files that are served directly (e.g. Images,icons, etc.)
Example usage in templates:

```html
  <img src="/images/image-not-found.jpg" alt="Image not found">
```
## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
npx cypress open
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
