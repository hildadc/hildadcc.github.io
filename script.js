// Halleza Steps — Interactivity
const CURRENCY = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });

// Sample products
const PRODUCTS = [
  { id:'hs-01', name:'Auralea Heels 7cm', price:399000, tag:'Heels', img:'assets/p1.svg' },
  { id:'fl-02', name:'Blush Flat Knit', price:279000, tag:'Flatshoes', img:'assets/p2.svg' },
  { id:'hs-03', name:'Navy Stiletto 9cm', price:449000, tag:'Heels', img:'assets/p3.svg' },
  { id:'fl-04', name:'Ivory Daily Flat', price:259000, tag:'Flatshoes', img:'assets/p4.svg' },
  { id:'hs-05', name:'Rose Gold Block 5cm', price:429000, tag:'Heels', img:'assets/p5.svg' },
  { id:'fl-06', name:'Greige Comfort Flat', price:299000, tag:'Flatshoes', img:'assets/p6.svg' },
];

// DOM refs
const grid = document.getElementById('productGrid');
const cartButton = document.getElementById('cartButton');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCart');
const goCheckout = document.getElementById('goCheckout');
const checkoutSummary = document.getElementById('checkoutSummary');
const checkoutTotal = document.getElementById('checkoutTotal');
const checkoutForm = document.getElementById('checkoutForm');

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Render products
function renderProducts(){
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="card" data-animate="fade-up">
      <div class="card-media"><img src="${p.img}" alt="${p.name}"/></div>
      <div class="card-body">
        <span class="tag">${p.tag}</span>
        <h3>${p.name}</h3>
        <div class="price">${CURRENCY.format(p.price)}</div>
        <p class="muted">Bahan nyaman, desain elegan. Siap kirim hari ini.</p>
        <div class="card-actions">
          <button class="btn btn-outline" onclick="addToCart('${p.id}')">Tambah ke Keranjang</button>
          <a class="btn btn-primary" href="#checkout" onclick="addToCart('${p.id}')">Beli Sekarang</a>
        </div>
      </div>
    </article>
  `).join('');
}
renderProducts();

/* Cart state */
let CART = JSON.parse(localStorage.getItem('HALLEZA_CART') || '[]');

function saveCart(){
  localStorage.setItem('HALLEZA_CART', JSON.stringify(CART));
  updateCartUI();
}
function addToCart(id){
  const item = CART.find(i => i.id === id);
  if(item){ item.qty += 1; }
  else{
    const p = PRODUCTS.find(x => x.id === id);
    CART.push({ id, name:p.name, price:p.price, img:p.img, qty:1 });
  }
  openCart();
  saveCart();
}
function changeQty(id, delta){
  const item = CART.find(i => i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) CART = CART.filter(i => i.id !== id);
  saveCart();
}
function removeItem(id){
  CART = CART.filter(i => i.id !== id);
  saveCart();
}
function clearCart(){
  CART = [];
  saveCart();
}

function updateCartUI(){
  cartCount.textContent = CART.reduce((a,c)=> a+c.qty, 0);
  cartItems.innerHTML = CART.length ? CART.map(i => `
    <div class="cart-item">
      <img src="${i.img}" alt="${i.name}"/>
      <div>
        <div><strong>${i.name}</strong></div>
        <div class="muted">${CURRENCY.format(i.price)} · Qty: ${i.qty}</div>
        <div class="qty">
          <button onclick="changeQty('${i.id}', -1)">−</button>
          <button onclick="changeQty('${i.id}', 1)">+</button>
          <button class="btn" style="padding:6px 10px" onclick="removeItem('${i.id}')">Hapus</button>
        </div>
      </div>
      <div><strong>${CURRENCY.format(i.price * i.qty)}</strong></div>
    </div>
  `).join('') : '<p class="muted">Keranjang kosong.</p>';
  const total = CART.reduce((a,c)=> a + c.price * c.qty, 0);
  cartTotal.textContent = CURRENCY.format(total);
  // Checkout summary
  if(checkoutSummary){
    checkoutSummary.innerHTML = CART.length ? CART.map(i => `
      <div style="display:flex; justify-content:space-between; margin:6px 0">
        <span>${i.name} × ${i.qty}</span>
        <strong>${CURRENCY.format(i.price * i.qty)}</strong>
      </div>
    `).join('') : '<p class="muted">Belum ada item. Silakan tambahkan produk.</p>';
    checkoutTotal.textContent = CURRENCY.format(total);
  }
}
updateCartUI();

/* Drawer controls */
function openCart(){ cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); }
function closeCartFn(){ cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); }
cartButton.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartFn);
clearCartBtn.addEventListener('click', clearCart);
/* Close on ESC */
document.addEventListener('keydown', e=>{ if(e.key === 'Escape') closeCartFn(); });

/* Slider */
const slidesEl = document.querySelector('.slides');
const slides = Array.from(document.querySelectorAll('.slide'));
const prev = document.querySelector('.slider-nav.prev');
const next = document.querySelector('.slider-nav.next');
const dots = document.querySelector('.dots');
let idx = 0;
let autoTimer = null;

function go(n){
  slides[idx].classList.remove('current');
  dots.children[idx].classList.remove('active');
  idx = (n + slides.length) % slides.length;
  slides[idx].classList.add('current');
  dots.children[idx].classList.add('active');
}
function nextSlide(){ go(idx+1); }
function prevSlide(){ go(idx-1); }

function startAuto(){ stopAuto(); autoTimer = setInterval(nextSlide, 5000); }
function stopAuto(){ if(autoTimer) clearInterval(autoTimer); }

// build dots
slides.forEach((_, i)=>{
  const b = document.createElement('button'); b.setAttribute('aria-label', 'Slide '+(i+1));
  if(i===0) b.classList.add('active');
  b.addEventListener('click', ()=>{ go(i); startAuto(); });
  dots.appendChild(b);
});
next.addEventListener('click', ()=>{ nextSlide(); startAuto(); });
prev.addEventListener('click', ()=>{ prevSlide(); startAuto(); });
startAuto();

/* Scroll-triggered animations */
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); observer.unobserve(e.target); }
  });
}, { threshold:.12 });
document.querySelectorAll('[data-animate]').forEach(el=> observer.observe(el));

/* Checkout (demo) */
if(checkoutForm){
  checkoutForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(CART.length === 0){ alert('Keranjang kosong. Tambahkan produk dulu ya!'); return; }
    const fd = new FormData(checkoutForm);
    const required = ['nama','email','alamat','kota','kodepos','metode'];
    for(const k of required){
      if(!fd.get(k)){ alert('Mohon lengkapi semua data.'); return; }
    }
    // "Process" order (demo only)
    const order = {
      items: CART, total: CART.reduce((a,c)=> a + c.price*c.qty, 0),
      customer: Object.fromEntries(fd.entries()),
      date: new Date().toISOString()
    };
    localStorage.setItem('HALLEZA_LAST_ORDER', JSON.stringify(order));
    clearCart();
    checkoutForm.reset();
    alert('Pesanan kamu sudah dicatat! Cek localStorage untuk detail (demo). Terima kasih 💖');
  });
}

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    const id = this.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(target){
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 72, behavior:'smooth' });
    }
  });
});
