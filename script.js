
const menuData = [
  {
    id: 1,
    title: 'Kapeng Barako Shot',
    category: 'espresso',
    price: 130.00,
    desc: 'Bold double extraction using traditional Batangas Liberica beans.',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Pandan Coconut Latte',
    category: 'espresso',
    price: 185.00,
    desc: 'Benguet Arabica infused with organic pandan extract and creamy coconut milk.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Nitro Barako Cold Brew',
    category: 'cold',
    price: 195.00,
    desc: '24-hour slow-steeped Batangas Barako infused with nitrogen for a velvety head.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'Sagada Pour-Over',
    category: 'espresso',
    price: 165.00,
    desc: 'Hand-poured single-origin dark roast with subtle floral and cocoa undertones.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    title: 'Tablea Cold Foam Brew',
    category: 'cold',
    price: 190.00,
    desc: 'Cold brew coffee topped with thick cream infused with Davao pure cacao tablea.',
    image: 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    title: 'Ube Cheese Ensaymada',
    category: 'bakery',
    price: 145.00,
    desc: 'Soft, buttery brioche topped with grated queso de bola and sweet purple yam.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80'
  }
];

// ==========================================================================
// State Management
// ==========================================================================
let cart = [];

// ==========================================================================
// DOM Elements
// ==========================================================================
const header = document.getElementById('header');
const menuGrid = document.getElementById('menu-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartTrigger = document.getElementById('cart-trigger');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const drawerCount = document.getElementById('drawer-count');
const cartTotal = document.getElementById('cart-total');
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

// ==========================================================================
// Initialize App
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  renderMenu('all');
  initScrollHandler();
  initListeners();
});

// ==========================================================================
// Menu Rendering & Filtering
// ==========================================================================
function renderMenu(filterCategory) {
  menuGrid.innerHTML = '';

  const filteredItems = filterCategory === 'all' 
    ? menuData 
    : menuData.filter(item => item.category === filterCategory);

  filteredItems.forEach(item => {
    const card = document.createElement('article');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="card-image-wrap">
        <span class="card-category">${item.category}</span>
        <img src="${item.image}" alt="${item.title}" loading="lazy">
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.desc}</p>
        <div class="card-footer">
          <span class="card-price">₱${item.price.toFixed(2)}</span>
          <button class="add-cart-btn" data-id="${item.id}">+ Add</button>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

// ==========================================================================
// Cart State Handlers
// ==========================================================================
function addToCart(id) {
  const product = menuData.find(item => item.id === id);
  if (product) {
    cart.push(product);
    updateCartUI();
    openCartDrawer();
  }
}

function updateCartUI() {
  cartCount.textContent = cart.length;
  drawerCount.textContent = cart.length;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Wala pang laman ang inyong basket.</p>';
    cartTotal.textContent = '₱0.00';
    return;
  }

  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div>
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-price">₱${item.price.toFixed(2)}</div>
      </div>
      <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#888; cursor:pointer; font-size:1.2rem;">&times;</button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  cartTotal.textContent = `₱${total.toFixed(2)}`;
}

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartUI();
};

function openCartDrawer() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
}

function closeCartDrawer() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
}

// ==========================================================================
// Event Listeners & Scroll Logic
// ==========================================================================
function initListeners() {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderMenu(e.target.dataset.filter);
    });
  });

  menuGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-cart-btn')) {
      const id = parseInt(e.target.dataset.id, 10);
      addToCart(id);
    }
  });

  cartTrigger.addEventListener('click', openCartDrawer);
  closeCart.addEventListener('click', closeCartDrawer);
  cartOverlay.addEventListener('click', closeCartDrawer);

  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
  });
}

function initScrollHandler() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}