const API_URL = 'http://localhost:5000/api';
let allProducts = []; 
let cart = [];

// Track which product IDs have active BOGO deals (Matches backend promotionService.js)
const BOGO_ITEMS = [3, 4]; 

// 1. Fetch products and initialize catalog + filters
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        allProducts = await response.json();
        
        renderCategoryFilters();
        renderProducts(allProducts); 
    } catch (err) {
        console.error("Error fetching products:", err);
    }
}

// 2. Extract and render unique category filter buttons
function renderCategoryFilters() {
    const filterContainer = document.getElementById('category-filters');
    const categories = ['All', ...new Set(allProducts.map(p => p.category))];
    
    filterContainer.innerHTML = categories.map((category, index) => {
        const isActive = index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
        return `
            <button 
                onclick="filterCategory('${category}', this)" 
                class="category-btn text-xs font-semibold px-4 py-2 rounded-full transition ${isActive}">
                ${category}
            </button>
        `;
    }).join('');
}

// 3. Filter displayed products when category changes
window.filterCategory = function(category, buttonElement) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    buttonElement.classList.remove('bg-gray-200', 'text-gray-700');
    buttonElement.classList.add('bg-blue-600', 'text-white');

    if (category === 'All') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        renderProducts(filtered);
    }
};

// 4. Render the product cards grid with BOGO Badges
function renderProducts(products) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `<p class="text-gray-400 italic col-span-2">No products available.</p>`;
        return;
    }

    products.forEach(product => {
        // Check if item is eligible for BOGO
        const hasBogo = BOGO_ITEMS.includes(product.id);
        const bogoBadge = hasBogo 
            ? `<span class="inline-block bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">Buy 1 Get 1 Free</span>` 
            : '';

        container.innerHTML += `
            <div class="border p-4 rounded-lg flex justify-between items-center bg-gray-50 hover:shadow-sm transition relative overflow-hidden">
                <div>
                    <div class="flex items-center flex-wrap gap-1">
                        <h3 class="font-semibold text-gray-800">${product.name}</h3>
                        ${bogoBadge}
                    </div>
                    <span class="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                        ${product.category}
                    </span>
                    <p class="text-blue-600 font-bold mt-1">$${product.price.toFixed(2)}</p>
                </div>
                <button onclick="addToCart(${product.id}, '${product.name}')" class="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition">
                    + Add
                </button>
            </div>
        `;
    });
}

// 5. Add Item to local cart array
window.addToCart = function(id, name) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, quantity: 1, name });
    }
    updateCartUI();
};

// 6. Render Cart state updates
function updateCartUI() {
    const container = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        container.innerHTML = `<p class="text-gray-400 italic">Cart is empty.</p>`;
        checkoutBtn.disabled = true;
        return;
    }

    checkoutBtn.disabled = false;
    container.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center bg-gray-100 p-2 rounded text-sm my-1">
            <span>${item.name}</span>
            <span class="font-bold">x${item.quantity}</span>
        </div>
    `).join('');
}

// 7. Submit Cart payload to backend
document.getElementById('checkout-btn').addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_URL}/billing/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart })
        });
        const billSummary = await response.json();
        displayReceipt(billSummary);
    } catch (err) {
        alert("Failed to compute billing checkout calculation.");
    }
});

// 8. Render computed invoice with clear offer breakdown
function displayReceipt(summary) {
    const receiptBox = document.getElementById('receipt-box');
    const itemsDiv = document.getElementById('receipt-items');
    const summaryDiv = document.getElementById('receipt-summary');

    receiptBox.classList.remove('hidden');

    // Show selected quantities along with specific BOGO alerts if triggered
    itemsDiv.innerHTML = cart.map(item => {
        const productInfo = allProducts.find(p => p.id === item.id);
        let bogoAlert = '';
        
        if (BOGO_ITEMS.includes(item.id) && item.quantity >= 2) {
            const freeCount = Math.floor(item.quantity / 2);
            const savedCash = freeCount * productInfo.price;
            bogoAlert = `<div class="text-[11px] text-red-600 font-medium italic">* BOGO applied: ${freeCount} Free (-$${savedCash.toFixed(2)})</div>`;
        }

        return `
            <div class="border-b border-gray-100 py-1">
                <div class="flex justify-between text-xs text-gray-700">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>$${((productInfo ? productInfo.price : 0) * item.quantity).toFixed(2)}</span>
                </div>
                ${bogoAlert}
            </div>
        `;
    }).join('');

    const subtotal = summary.subtotal || 0;
    const discount = summary.discount || 0;
    const tax = summary.tax || 0;
    const total = summary.total || 0;
    const taxableAmount = subtotal - discount;

    summaryDiv.innerHTML = `
        <div class="flex justify-between text-gray-500 text-xs"><span>Subtotal Value:</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="flex justify-between text-red-600 font-semibold text-xs"><span>Total Offers Saved:</span><span>-$${discount.toFixed(2)}</span></div>
        <div class="flex justify-between border-t pt-1 text-gray-600 text-xs"><span>Taxable Total:</span><span>$${taxableAmount.toFixed(2)}</span></div>
        <div class="flex justify-between text-gray-500 text-xs"><span>Tax (18%):</span><span>+$${tax.toFixed(2)}</span></div>
        <div class="flex justify-between border-t-2 border-double pt-1.5 text-base font-bold text-gray-900"><span>Grand Total:</span><span>$${total.toFixed(2)}</span></div>
    `;
}

fetchProducts();