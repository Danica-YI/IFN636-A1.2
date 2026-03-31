import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../service/api';

const DesktopSidebar = ({ navigate, handleLogout, user }) => (
    <div style={{
        width: '240px', minHeight: '100vh', backgroundColor: 'white',
        borderRight: '1px solid #eee', padding: '20px 0',
        position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column',
    }}>
        <div style={{ padding: '0 20px 30px', borderBottom: '1px solid #eee' }}>
            <span style={{ color: '#ECBC76', fontWeight: 'bold', fontSize: '24px' }}>WIMS</span>
            <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#888' }}>Warehouse Inventory</p>
        </div>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{user?.name}</p>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#ECBC76' }}>{user?.role?.toUpperCase()}</p>
        </div>
        <nav style={{ flex: 1, padding: '20px 0' }}>
            {[
                { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
                { icon: '📦', label: 'Stock', path: '/stocks' },
                ...(user?.role === 'admin' ? [
                    { icon: '📋', label: 'Purchase Orders', path: '/orders' },
                    { icon: '👥', label: 'Suppliers', path: '/suppliers' },
                   
                ] : [
                    { icon: '📥', label: 'Inbound', path: '/inbound' },
                    { icon: '📤', label: 'Outbound', path: '/outbound' },
                    { icon: '📋', label: 'View Orders', path: '/orders' },
                ]),
                { icon: '🔔', label: 'Low Stock Alerts', path: '/alerts' },
                { icon: '⚙️', label: 'Adjustments', path: '/adjustments' },
            ].map((item) => (
                <div key={item.path} onClick={() => navigate(item.path)} style={{
                    padding: '12px 20px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    fontSize: '14px',
                    color: window.location.pathname === item.path.split('?')[0] ? '#ECBC76' : '#444',
                    fontWeight: window.location.pathname === item.path.split('?')[0] ? 'bold' : 'normal',
                    backgroundColor: window.location.pathname === item.path.split('?')[0] ? '#FFF8EC' : 'transparent',
                }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFF8EC'}
                    onMouseLeave={e => {
                        if (window.location.pathname !== item.path.split('?')[0])
                            e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                >
                    <span>{item.icon}</span><span>{item.label}</span>
                </div>
            ))}
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
            <button onClick={handleLogout} style={{
                width: '100%', padding: '10px', backgroundColor: '#ECBC76',
                color: 'white', border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
            }}>Logout</button>
        </div>
    </div>
);

const MobileBottomNav = ({ navigate, user }) => (
    <div style={{
        position: 'sticky', bottom: 0, width: '100%', backgroundColor: 'white',
        display: 'flex', justifyContent: 'space-around', padding: '12px 0',
        borderTop: '1px solid #eee', zIndex: 100, borderRadius: '0 0 40px 40px',
    }}>
        <span style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>👤</span>
        <span style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => navigate('/orders')}>📋</span>
        <span style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => navigate('/alerts')}>🔔</span>
        <span style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => navigate('/adjustments')}>⚙️</span>
        <span style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => navigate('/stocks')}>🏭</span>
    </div>
);

function Inbound() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [receivedQty, setReceivedQty] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchOrders();
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await API.get('/orders');
            // Show  shipped orders for inbound
            setOrders(data.filter(o =>  o.status === 'shipped'));
        } catch (err) {
            setError('Failed to fetch orders');
        }
    };

    const handleConfirm = async () => {
        try {
            await API.put(`/orders/${selectedOrder._id}/status`, { status: 'received' });
            setSuccess('Order received successfully!');
            setSelectedOrder(null);
            fetchOrders();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to confirm order');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const statusColor = (status) => {
        const colors = {
            pending: '#FF9F1C',
            approved: '#52B788',
            shipped: '#56CFE1',
            received: '#888',
            cancelled: '#FF6B6B',
        };
        return colors[status] || '#888';
    };

    const OrderDetail = ({ order }) => (
        <div style={{
            backgroundColor: 'white', borderRadius: '16px',
            padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
            {/* Back button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <button onClick={() => setSelectedOrder(null)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '20px', color: '#444',
                }}>←</button>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>Inbound Order Details</h2>
            </div>

            {/* Order Info */}
            <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
                <p style={{ margin: '0 0 6px', fontWeight: 'bold', fontSize: '16px' }}>{order.orderNumber}</p>
                <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#666' }}>
                    Supplier: {order.supplier?.name}
                </p>
                <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#666' }}>
                    Items: {order.items?.length}
                </p>
                <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#666' }}>
                    Date: {new Date(order.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <span style={{
                    color: statusColor(order.status),
                    fontWeight: 'bold', fontSize: '14px',
                }}>{order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}</span>
            </div>

            {/* Items */}
            {order.items?.map((item, index) => (
                <div key={index} style={{
                    padding: '16px', border: '1px solid #eee',
                    borderRadius: '12px', marginBottom: '12px',
                }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 'bold' }}>Product Name: {item.stock?.name}</p>
                    <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#666' }}>Product ID: {item.stock?.sku}</p>
                    <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>Qty Ordered: {item.quantity}</p>
                    <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>Qty Received:</label>
                    <input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={receivedQty[item.stock?._id] || ''}
                        onChange={(e) => setReceivedQty({ ...receivedQty, [item.stock?._id]: e.target.value })}
                        style={{
                            width: '120px', padding: '8px 12px',
                            border: '1.5px solid #ECBC76', borderRadius: '8px',
                            fontSize: '14px', outline: 'none',
                        }}
                    />
                </div>
            ))}

            {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
            {success && <p style={{ color: 'green', fontSize: '14px' }}>{success}</p>}

            <button onClick={handleConfirm} style={{
                width: '100%', padding: '14px',
                backgroundColor: '#ECBC76', color: 'white',
                border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
                marginTop: '8px',
            }}>Confirm</button>
        </div>
    );

    const OrderList = () => (
        <div>
            {orders.length === 0 ? (
                <div style={{
                    backgroundColor: 'white', borderRadius: '16px',
                    padding: '40px', textAlign: 'center', color: '#888',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                    No approved or shipped orders available
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order._id} onClick={() => { setSelectedOrder(order); setReceivedQty({}); }} style={{
                        backgroundColor: 'white', borderRadius: '16px',
                        padding: '20px', marginBottom: '16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        cursor: 'pointer', borderLeft: `4px solid ${statusColor(order.status)}`,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: '0 0 6px', fontWeight: 'bold', fontSize: '16px' }}>{order.orderNumber}</p>
                                <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#666' }}>
                                    Supplier: {order.supplier?.name}
                                </p>
                                <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#666' }}>
                                    {order.items?.length} items • ${order.totalAmount}
                                </p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#aaa' }}>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span style={{
                                color: statusColor(order.status),
                                fontWeight: 'bold', fontSize: '14px',
                            }}>{order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    // 手机版
    if (isMobile) {
        return (
            <div style={{
                minHeight: '100vh', backgroundColor: '#ECBC76',
                display: 'flex', justifyContent: 'center',
                alignItems: 'flex-start', padding: '20px 0',
            }}>
                <div style={{
                    width: '390px', backgroundColor: '#f5f5f5',
                    minHeight: 'calc(100vh - 40px)', borderRadius: '40px',
                    overflow: 'hidden', boxShadow: '0 0 30px rgba(0,0,0,0.2)',
                    display: 'flex', flexDirection: 'column',
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '16px 20px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <span style={{ color: '#ECBC76', fontWeight: 'bold', fontSize: '20px' }}>WIMS</span>
                        <span onClick={handleLogout} style={{ fontSize: '20px', cursor: 'pointer' }}>☰</span>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                        {!selectedOrder ? (
                            <>
                                <h2 style={{ margin: '0 0 16px', fontWeight: 'bold', fontSize: '22px' }}>Inbound Orders</h2>
                                {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
                                <OrderList />
                            </>
                        ) : (
                            <OrderDetail order={selectedOrder} />
                        )}
                    </div>

                    <MobileBottomNav navigate={navigate} user={user} />
                </div>
            </div>
        );
    }

    // 桌面版
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <DesktopSidebar navigate={navigate} handleLogout={handleLogout} user={user} />
            <div style={{ marginLeft: '240px', flex: 1, padding: '30px' }}>
                <h1 style={{ margin: '0 0 24px', fontSize: '28px', fontWeight: 'bold' }}>Inbound Management</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                {!selectedOrder ? <OrderList /> : <OrderDetail order={selectedOrder} />}
            </div>
        </div>
    );
}

export default Inbound;