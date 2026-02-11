let currentUser = null;

async function checkAuth() {
  try {
    const response = await fetch('/api/session');
    if (response.ok) {
      currentUser = await response.json();
      if (currentUser.role !== 'chef') {
        alert('Access denied. Chef login required.');
        window.location.href = '/';
      }
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

async function loadOrders() {
  try {
    const response = await fetch('/api/orders');
    const orders = await response.json();
    
    const pending = orders.filter(o => o.status === 'pending');
    const preparing = orders.filter(o => o.status === 'preparing');
    const ready = orders.filter(o => o.status === 'ready');
    
    displayOrders('pending-orders', pending);
    displayOrders('preparing-orders', preparing);
    displayOrders('ready-orders', ready);
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}

function displayOrders(containerId, orders) {
  const container = document.getElementById(containerId);
  
  if (orders.length === 0) {
    container.innerHTML = '<p class="empty-state">No orders</p>';
    return;
  }
  
  container.innerHTML = orders.map(order => `
    <div class="chef-order-card">
      <div class="order-header">
        <h3>Table ${order.table_number}</h3>
        <span class="order-time">${getTimeAgo(order.created_at)}</span>
      </div>
      
      <div class="order-items-list">
        ${order.items.map(item => `
          <div class="chef-order-item ${item.status}">
            <div class="item-details">
              <strong>${item.item_name}</strong>
              <span class="portion-badge">${item.portion}</span>
              <span class="quantity-badge">x${item.quantity}</span>
            </div>
            ${item.notes ? `<div class="item-notes">Note: ${item.notes}</div>` : ''}
            <div class="item-status">${item.status}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="order-actions">
        ${order.status === 'pending' ? `
          <button onclick="updateOrderStatus(${order.id}, 'preparing')" class="btn btn-primary">
            Start Preparing
          </button>
        ` : ''}
        ${order.status === 'preparing' ? `
          <button onclick="updateOrderStatus(${order.id}, 'ready')" class="btn btn-success">
            Mark Ready
          </button>
        ` : ''}
        ${order.status === 'ready' ? `
          <button onclick="updateOrderStatus(${order.id}, 'served')" class="btn btn-secondary">
            Mark Served
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');
}

async function updateOrderStatus(orderId, status) {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    
    if (response.ok) {
      loadOrders();
    }
  } catch (error) {
    alert('Error updating order status');
  }
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const orderTime = new Date(timestamp);
  const diffMs = now - orderTime;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  return `${diffHours}h ${diffMins % 60}m ago`;
}

// Initialize
checkAuth().then(() => {
  loadOrders();
  setInterval(loadOrders, 10000); // Refresh every 10 seconds
});
