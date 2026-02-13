let currentUser = null;
let tables = [];
let menuItems = [];
let currentTableId = null;
let currentOrderId = null;
let orderItemsMap = {};

// Check authentication
async function checkAuth() {
  try {
    const response = await fetch('/api/session');
    if (response.ok) {
      currentUser = await response.json();
      document.getElementById('username').textContent = currentUser.username;
    } else {
      window.location.href = '/';
    }
  } catch (error) {
    window.location.href = '/';
  }
}

async function logout() {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/';
}

// Tab switching
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(`${tabName}-tab`).classList.add('active');
  event.target.classList.add('active');

  if (tabName === 'tables') loadTables();
  else if (tabName === 'orders') loadOrders();
  else if (tabName === 'menu') loadMenu();
  else if (tabName === 'settings') loadSettings();
}

// Load tables
async function loadTables() {
  try {
    const response = await fetch('/api/tables');
    tables = await response.json();
    
    const grid = document.getElementById('tables-grid');
    grid.innerHTML = tables.map(table => `
      <div class="table-card ${table.status}">
        <div class="table-number">Table ${table.table_number}</div>
        <div class="table-status">${table.status}</div>
        ${table.status === 'available' 
          ? `<button onclick="openOrderModal(${table.id}, ${table.table_number})" class="btn btn-primary">New Order</button>`
          : table.active_order_id 
            ? `<button onclick="viewBill(${table.active_order_id})" class="btn btn-success">View Bill</button>`
            : ''
        }
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading tables:', error);
  }
}

// Load orders
async function loadOrders() {
  try {
    const response = await fetch('/api/orders?status=pending&status=preparing&status=ready');
    const orders = await response.json();
    
    const list = document.getElementById('orders-list');
    if (orders.length === 0) {
      list.innerHTML = '<p>No active orders</p>';
      return;
    }
    
    list.innerHTML = orders.map(order => `
      <div class="order-card">
        <h3>Table ${order.table_number} - Order #${order.id}</h3>
        <p>Status: <span class="status-badge ${order.status}">${order.status}</span></p>
        <p>Waiter: ${order.waiter_name}</p>
        <p>Time: ${new Date(order.created_at).toLocaleTimeString()}</p>
        <div class="order-items">
          ${order.items.map(item => `
            <div class="order-item">
              ${item.item_name} (${item.portion}) x${item.quantity} - ₹${item.price * item.quantity}
              <span class="item-status">${item.status}</span>
            </div>
          `).join('')}
        </div>
        <p><strong>Total: ₹${order.total_amount}</strong></p>
        <button onclick="viewBill(${order.id})" class="btn btn-primary">View Bill</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}

// Order Modal
async function openOrderModal(tableId, tableNumber) {
  currentTableId = tableId;
  orderItemsMap = {};
  
  document.getElementById('orderTableNumber').textContent = tableNumber;
  
  // Load menu
  const response = await fetch('/api/menu');
  menuItems = await response.json();
  
  const menuContainer = document.getElementById('menuItems');
  const categories = [...new Set(menuItems.map(item => item.category))];
  
  menuContainer.innerHTML = categories.map(category => `
    <div class="menu-category">
      <h3>${category || 'Other'}</h3>
      ${menuItems.filter(item => item.category === category).map(item => `
        <div class="menu-item">
          <span class="item-name">${item.name}</span>
          <div class="item-actions">
            ${item.half_price ? `
              <button onclick="addToOrder(${item.id}, 'half', ${item.half_price})" class="btn btn-sm">
                Half (₹${item.half_price})
              </button>
            ` : ''}
            <button onclick="addToOrder(${item.id}, 'full', ${item.full_price})" class="btn btn-sm">
              Full (₹${item.full_price})
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
  
  updateOrderDisplay();
  document.getElementById('orderModal').style.display = 'block';
}

function addToOrder(menuItemId, portion, price) {
  const key = `${menuItemId}-${portion}`;
  if (!orderItemsMap[key]) {
    const item = menuItems.find(m => m.id === menuItemId);
    orderItemsMap[key] = {
      menu_item_id: menuItemId,
      name: item.name,
      portion,
      price,
      quantity: 1
    };
  } else {
    orderItemsMap[key].quantity++;
  }
  updateOrderDisplay();
}

function removeFromOrder(key) {
  if (orderItemsMap[key].quantity > 1) {
    orderItemsMap[key].quantity--;
  } else {
    delete orderItemsMap[key];
  }
  updateOrderDisplay();
}

function updateOrderDisplay() {
  const container = document.getElementById('orderItems');
  const items = Object.entries(orderItemsMap);
  
  if (items.length === 0) {
    container.innerHTML = '<p>No items added</p>';
    document.getElementById('orderTotal').textContent = '0.00';
    return;
  }
  
  let total = 0;
  container.innerHTML = items.map(([key, item]) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div class="order-item-row">
        <span>${item.name} (${item.portion})</span>
        <span>x${item.quantity}</span>
        <span>₹${itemTotal.toFixed(2)}</span>
        <button onclick="removeFromOrder('${key}')" class="btn btn-sm btn-danger">-</button>
      </div>
    `;
  }).join('');
  
  document.getElementById('orderTotal').textContent = total.toFixed(2);
}

async function submitOrder() {
  const items = Object.values(orderItemsMap);
  
  if (items.length === 0) {
    alert('Please add items to the order');
    return;
  }
  
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        table_id: currentTableId,
        items: items.map(item => ({
          menu_item_id: item.menu_item_id,
          portion: item.portion,
          quantity: item.quantity
        }))
      })
    });
    
    if (response.ok) {
      alert('Order placed successfully!');
      closeOrderModal();
      loadTables();
    } else {
      const error = await response.json();
      alert(error.error);
    }
  } catch (error) {
    alert('Error placing order');
  }
}

function closeOrderModal() {
  document.getElementById('orderModal').style.display = 'none';
}

// Bill Modal
async function viewBill(orderId) {
  currentOrderId = orderId;
  
  try {
    const response = await fetch(`/api/orders/${orderId}/bill`);
    const data = await response.json();
    
    const billContent = document.getElementById('billContent');
    billContent.innerHTML = `
      <div class="bill">
        <div class="bill-header">
          <h2>${data.restaurant.name}</h2>
          <p>${data.restaurant.address}</p>
          <p>${data.restaurant.phone}</p>
        </div>
        
        <div class="bill-details">
          <p><strong>Order #${data.order.id}</strong></p>
          <p>Table: ${data.order.table_number}</p>
          <p>Date: ${new Date(data.order.created_at).toLocaleString()}</p>
          <p>Waiter: ${data.order.waiter_name}</p>
        </div>
        
        <table class="bill-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.order.items.map(item => `
              <tr>
                <td>${item.item_name} (${item.portion})</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="bill-total">
          <div class="bill-row">
            <span>Subtotal:</span>
            <span>₹${data.subtotal.toFixed(2)}</span>
          </div>
          <div class="bill-row">
            <span>Tax (${data.restaurant.tax_rate}%):</span>
            <span>₹${data.tax.toFixed(2)}</span>
          </div>
          <div class="bill-row bill-grand-total">
            <span>Grand Total:</span>
            <span>₹${data.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="bill-footer">
          <p>Thank you for dining with us!</p>
        </div>
      </div>
    `;
    
    document.getElementById('billModal').style.display = 'block';
  } catch (error) {
    alert('Error loading bill');
  }
}

let currentBillData = null;
let paymentTipAmount = 0;
let paymentFinalTotal = 0;

async function processPayment() {
  closeBillModal();
  
  // Load bill data for payment
  try {
    const response = await fetch(`/api/orders/${currentOrderId}/bill`);
    currentBillData = await response.json();
    paymentFinalTotal = currentBillData.total;
    
    document.getElementById('paymentModal').style.display = 'block';
    updatePaymentSummary();
  } catch (error) {
    alert('Error loading payment details');
  }
}

function updatePaymentSummary() {
  if (!currentBillData) return;
  
  const summaryDiv = document.getElementById('paymentSummary');
  summaryDiv.innerHTML = `
    <div class="payment-summary">
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>₹${currentBillData.subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Tax (${currentBillData.restaurant.tax_rate}%):</span>
        <span>₹${currentBillData.tax.toFixed(2)}</span>
      </div>
      ${paymentTipAmount > 0 ? `
        <div class="summary-row tip-row">
          <span>Tip:</span>
          <span>₹${paymentTipAmount.toFixed(2)}</span>
        </div>
      ` : ''}
      <div class="summary-row total-row">
        <span><strong>Total:</strong></span>
        <span><strong>₹${paymentFinalTotal.toFixed(2)}</strong></span>
      </div>
    </div>
  `;
}

function setTipPercentage(percent) {
  if (!currentBillData) return;
  
  const billTotal = currentBillData.total;
  paymentTipAmount = (billTotal * percent) / 100;
  paymentFinalTotal = billTotal + paymentTipAmount;
  
  // Clear custom tip input
  document.getElementById('customTip').value = '';
  
  updatePaymentSummary();
}

function setCustomTip() {
  if (!currentBillData) return;
  
  const customAmount = parseFloat(document.getElementById('customTip').value) || 0;
  paymentTipAmount = customAmount;
  paymentFinalTotal = currentBillData.total + paymentTipAmount;
  
  updatePaymentSummary();
}

async function submitPayment() {
  const paymentMethod = document.getElementById('paymentMethod').value;
  const customerEmail = document.getElementById('customerEmail').value;
  const customerName = document.getElementById('customerName').value;
  
  // Validate payment details based on method
  if (paymentMethod === 'card') {
    const cardNumber = document.getElementById('cardNumber').value;
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCVV = document.getElementById('cardCVV').value;
    
    if (!cardNumber || !cardExpiry || !cardCVV) {
      alert('Please enter complete card details');
      return;
    }
  } else if (paymentMethod === 'upi') {
    const upiId = document.getElementById('upiId').value;
    if (!upiId || !upiId.includes('@')) {
      alert('Please enter valid UPI ID');
      return;
    }
  }
  
  // Show processing
  document.getElementById('submitPaymentBtn').textContent = 'Processing...';
  document.getElementById('submitPaymentBtn').disabled = true;
  
  try {
    const paymentData = {
      orderId: currentOrderId,
      paymentMethod,
      amount: paymentFinalTotal,
      tipAmount: paymentTipAmount,
      customerEmail: customerEmail || undefined,
      customerName: customerName || undefined
    };
    
    const response = await fetch('/api/payment/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    
    if (response.ok) {
      const result = await response.json();
      
      // Show success message
      alert(`Payment Successful!\nTransaction ID: ${result.transactionId}${result.receiptSent ? '\n\nReceipt sent to ' + customerEmail : ''}`);
      
      closePaymentModal();
      loadTables();
      loadOrders();
    } else {
      const error = await response.json();
      alert(`Payment failed: ${error.error}`);
    }
  } catch (error) {
    alert('Payment processing error. Please try again.');
  } finally {
    document.getElementById('submitPaymentBtn').textContent = 'Submit Payment';
    document.getElementById('submitPaymentBtn').disabled = false;
  }
}

function changePaymentMethod() {
  const method = document.getElementById('paymentMethod').value;
  
  // Hide all payment detail sections
  document.querySelectorAll('.payment-details').forEach(el => el.style.display = 'none');
  
  // Show selected payment method details
  if (method === 'card') {
    document.getElementById('cardDetails').style.display = 'block';
  } else if (method === 'upi') {
    document.getElementById('upiDetails').style.display = 'block';
  } else if (method === 'wallet') {
    document.getElementById('walletDetails').style.display = 'block';
  }
}

function closePaymentModal() {
  document.getElementById('paymentModal').style.display = 'none';
  paymentTipAmount = 0;
  paymentFinalTotal = 0;
  currentBillData = null;
  
  // Reset form
  document.getElementById('paymentMethod').value = 'cash';
  document.getElementById('customerEmail').value = '';
  document.getElementById('customerName').value = '';
  document.getElementById('customTip').value = '';
  changePaymentMethod();
}

async function completeOrder() {
  if (!confirm('Mark this order as completed and close the table?')) return;
  
  try {
    const response = await fetch(`/api/orders/${currentOrderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' })
    });
    
    if (response.ok) {
      alert('Order completed!');
      closeBillModal();
      loadTables();
    }
  } catch (error) {
    alert('Error completing order');
  }
}

function closeBillModal() {
  document.getElementById('billModal').style.display = 'none';
}

// Menu Management
async function loadMenu() {
  try {
    const response = await fetch('/api/menu');
    menuItems = await response.json();
    
    const list = document.getElementById('menu-list');
    const categories = [...new Set(menuItems.map(item => item.category))];
    
    list.innerHTML = categories.map(category => `
      <div class="menu-category-manage">
        <h3>${category || 'Other'}</h3>
        ${menuItems.filter(item => item.category === category).map(item => `
          <div class="menu-item-manage">
            <div>
              <strong>${item.name}</strong><br>
              ${item.half_price ? `Half: ₹${item.half_price} | ` : ''}Full: ₹${item.full_price}
            </div>
            <button onclick="deleteMenuItem(${item.id})" class="btn btn-sm btn-danger">Delete</button>
          </div>
        `).join('')}
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading menu:', error);
  }
}

function showAddMenuItem() {
  document.getElementById('menuModal').style.display = 'block';
}

function closeMenuModal() {
  document.getElementById('menuModal').style.display = 'none';
  document.getElementById('menuItemForm').reset();
}

document.getElementById('menuItemForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    name: document.getElementById('itemName').value,
    category: document.getElementById('itemCategory').value,
    half_price: document.getElementById('halfPrice').value || null,
    full_price: document.getElementById('fullPrice').value
  };
  
  try {
    const response = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      alert('Menu item added!');
      closeMenuModal();
      loadMenu();
    }
  } catch (error) {
    alert('Error adding menu item');
  }
});

async function deleteMenuItem(id) {
  if (!confirm('Delete this menu item?')) return;
  
  try {
    await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    loadMenu();
  } catch (error) {
    alert('Error deleting item');
  }
}

// Settings
async function loadSettings() {
  try {
    const response = await fetch('/api/restaurant');
    const data = await response.json();
    
    document.getElementById('restaurantName').value = data.name;
    document.getElementById('restaurantAddress').value = data.address;
    document.getElementById('restaurantPhone').value = data.phone;
    document.getElementById('taxRate').value = data.tax_rate;
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

document.getElementById('restaurantForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    name: document.getElementById('restaurantName').value,
    address: document.getElementById('restaurantAddress').value,
    phone: document.getElementById('restaurantPhone').value,
    tax_rate: document.getElementById('taxRate').value
  };
  
  try {
    await fetch('/api/restaurant', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    alert('Settings saved!');
  } catch (error) {
    alert('Error saving settings');
  }
});

// Initialize
checkAuth().then(() => {
  loadTables();
  setInterval(loadTables, 30000); // Refresh every 30 seconds
});
