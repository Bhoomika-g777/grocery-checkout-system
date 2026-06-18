# Retail Grocery Checkout Billing System

A lightweight, high-performance full-stack web application designed to simulate an automated supermarket checkout desk. The application dynamically structures a product repository, itemizes ongoing customer carts, securely computes compound promotional rule matrices, factors standard retail taxation tiers, and instantly generates an invoice summary receipt.

## 🛠️ Technology Stack Used

- **Frontend:** HTML5, Vanilla JavaScript (ES6+), Tailwind CSS (via High-Performance CDN)
- **Backend Server:** Node.js, Express.js (REST API Architecture)
- **Database Simulation:** Static JSON File Configuration (`products.json`)
- **Deployment Environments:** GitHub Ecosystem (Source Control), Vercel (Serverless Cloud Deployment)

---

## ⚙️ Setup and Local Run Instructions

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Backend Server Setup
1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
  Install the necessary dependencies:

2. ```Bash
npm install
Boot up the server in development mode:

3. ```Bash
npm run dev
The terminal should output: 🚀 Server running on port 5000

### 2. Frontend Launch Instructions
Open the project folder in your code workspace (e.g., VS Code).

Right-click on frontend/index.html and launch it using Live Server (or simply open the index.html file path directly inside any web browser).

The browser address bar will run on the local host configuration: http://127.0.0.1:5500/frontend/index.html

## 💡 Development Assumptions
Static Pricing Integrity: Product inventories and base unit valuations are handled as secure, read-only static lookups via products.json rather than direct client-side pricing overrides to prevent client-side price tampering.

Fixed Promotion Targets: The "Buy One Get One Free" (BOGO) mechanism targets specified item configurations (such as Coffee and Bread) natively by evaluating quantity / 2 splits.

Tax Progression: Standard sales tax (18%) is applied uniformly on the taxable total amount calculated strictly after all compound promotional discounts are applied.

## 🤖 AI Assistance & Development Reflection
During the development lifecycle of this project, I leveraged AI collaboration to build, refactor, and deploy the application. The tool acted as both a pair-programmer and an architectural validator, helping convert an initial backend structure into a complete full-stack web application. It expedited styling layouts using Tailwind CSS utility pillars, resolved asynchronous state parameters across cross-origin pathways (CORS), and optimized routing arrays within the backend workspace to support serverless cloud deployment.

The main development challenge was ensuring seamless frontend-to-backend communication across varying execution domains. Initially, the frontend structure expected a slightly different payload schema than what the server produced. By using the AI tool to inspect runtime error stack traces, we successfully refactored the fetch workflows, updated deployment rules via a custom vercel.json file, and successfully launched the functional app live in record time.
