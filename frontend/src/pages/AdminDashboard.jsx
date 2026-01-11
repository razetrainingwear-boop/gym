import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Mail, 
  ShoppingBag, 
  Clock, 
  Send, 
  Trash2, 
  LogOut,
  RefreshCw,
  ChevronDown,
  Check,
  X,
  BarChart3,
  TrendingUp,
  DollarSign,
  Gift,
  Calendar,
  Target,
  Download,
  Search,
  Eye,
  Package,
  Activity,
  Tag,
  AlertCircle,
  Copy,
  MessageSquare,
  RotateCcw,
  Shuffle,
  FileText,
  CheckSquare,
  Square
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('all');
  
  // Data states
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [contactsSummary, setContactsSummary] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  
  // New feature states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filterDiscipline, setFilterDiscipline] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [emailLogsSummary, setEmailLogsSummary] = useState(null);
  const [duplicates, setDuplicates] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [giveawayWinner, setGiveawayWinner] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [newDiscountCode, setNewDiscountCode] = useState({ code: '', discount_percent: 10, max_uses: 0 });
  
  // Email form state
  const [emailForm, setEmailForm] = useState({
    subject: '',
    html_content: '',
    target: 'all'
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState(null);

  const timeframeOptions = [
    { value: 'today', label: 'Today' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Check if already authenticated
  useEffect(() => {
    checkAuth();
  }, [user]);
  
  // Auto-refresh effect
  useEffect(() => {
    let interval;
    if (autoRefresh && isAuthenticated) {
      interval = setInterval(() => {
        loadStats();
      }, 30000); // Refresh every 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, isAuthenticated]);

  const checkAuth = async () => {
    // If user is logged in and is admin, auto-authenticate immediately
    if (user?.is_admin) {
      setIsAuthenticated(true);
      loadStats();
      return;
    }
    
    // No fallback password auth needed - only admin users can access
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Store token in localStorage as fallback
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
        }
        setIsAuthenticated(true);
        setPassword('');
        loadStats();
      } else {
        setLoginError(data.detail || 'Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      await fetch(`${API_URL}/api/admin/logout`, {
        method: 'POST',
        
        headers: token ? { 'X-Admin-Token': token } : {}
      });
      localStorage.removeItem('admin_token');
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { 'X-Admin-Token': token } : {};
  };

  const loadStats = async (tf = timeframe) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/stats?timeframe=${tf}`, {
        credentials: 'include',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
    setLoading(false);
  };

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    loadStats(newTimeframe);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        credentials: 'include',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
    setLoading(false);
  };

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/subscribers`, {
        
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch (error) {
      console.error('Failed to load subscribers:', error);
    }
    setLoading(false);
  };

  const loadWaitlist = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/waitlist`, {
        
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setWaitlist(data.waitlist || []);
    } catch (error) {
      console.error('Failed to load waitlist:', error);
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/orders`, {
        
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
    setLoading(false);
  };

  const loadAllContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/all-contacts`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setAllContacts(data.contacts || []);
      setContactsSummary(data.summary || null);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
    setLoading(false);
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Load all data for analytics
      const [statsRes, ordersRes, usersRes, waitlistRes, subscribersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/admin/orders`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/admin/users`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/admin/waitlist`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/admin/subscribers`, { headers: getAuthHeaders() })
      ]);

      const [statsData, ordersData, usersData, waitlistData, subscribersData] = await Promise.all([
        statsRes.json(),
        ordersRes.json(),
        usersRes.json(),
        waitlistRes.json(),
        subscribersRes.json()
      ]);

      const ordersList = ordersData.orders || [];
      const usersList = usersData.users || [];
      const waitlistList = waitlistData.waitlist || [];
      const subscribersList = subscribersData.subscribers || [];

      // Process data for charts
      // 1. Revenue over time (last 30 days)
      const last30Days = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayOrders = ordersList.filter(o => o.created_at?.startsWith(dateStr));
        const revenue = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        last30Days.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: revenue,
          orders: dayOrders.length
        });
      }

      // 2. Order status breakdown
      const statusCounts = {};
      ordersList.forEach(o => {
        const status = o.status || 'pending';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      const orderStatusData = Object.entries(statusCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
      }));

      // 3. Signups over time (last 7 days)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayUsers = usersList.filter(u => u.created_at?.startsWith(dateStr)).length;
        const daySubscribers = subscribersList.filter(s => s.timestamp?.startsWith(dateStr)).length;
        const dayWaitlist = waitlistList.filter(w => w.created_at?.startsWith(dateStr)).length;
        last7Days.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          users: dayUsers,
          subscribers: daySubscribers,
          waitlist: dayWaitlist
        });
      }

      // 4. Product popularity (from waitlist)
      const productCounts = {};
      waitlistList.forEach(w => {
        const product = w.product_name || 'Unknown';
        productCounts[product] = (productCounts[product] || 0) + 1;
      });
      const productData = Object.entries(productCounts)
        .map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + '...' : name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // 5. Calculate totals
      const totalRevenue = ordersList.reduce((sum, o) => sum + (o.total || 0), 0);
      const avgOrderValue = ordersList.length > 0 ? totalRevenue / ordersList.length : 0;

      setAnalyticsData({
        revenueData: last30Days,
        orderStatusData: orderStatusData.length > 0 ? orderStatusData : [{ name: 'No Orders', value: 1 }],
        signupData: last7Days,
        productData: productData.length > 0 ? productData : [{ name: 'No Data', value: 1 }],
        totalRevenue,
        avgOrderValue,
        totalOrders: ordersList.length,
        totalUsers: usersList.length,
        totalWaitlist: waitlistList.length
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
    setLoading(false);
  };

  // ============== NEW FEATURE FUNCTIONS ==============
  
  // Export to CSV
  const exportToCSV = async () => {
    try {
      window.open(`${API_URL}/api/admin/export/contacts`, '_blank');
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  // Search contacts
  const searchContacts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (filterDiscipline !== 'all') params.append('discipline', filterDiscipline);
      if (filterSource !== 'all') params.append('source', filterSource);
      if (customDateStart) params.append('start_date', customDateStart);
      if (customDateEnd) params.append('end_date', customDateEnd);
      
      const res = await fetch(`${API_URL}/api/admin/search?${params}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Failed to search:', error);
    }
    setLoading(false);
  };

  // Pick giveaway winner
  const pickGiveawayWinner = async () => {
    if (!window.confirm('Pick a random giveaway winner?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/giveaway/pick-winner`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setGiveawayWinner(data.winner);
        alert(`Winner: ${data.winner.email}\nTotal entries: ${data.total_entries}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Failed to pick winner:', error);
    }
    setLoading(false);
  };

  // Get user details
  const loadUserDetails = async (email) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/user/${encodeURIComponent(email)}/details`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setUserDetails(data);
      setSelectedUser(email);
    } catch (error) {
      console.error('Failed to load user details:', error);
    }
    setLoading(false);
  };

  // Load inventory
  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/inventory`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setInventory(data.inventory || []);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
    setLoading(false);
  };

  // Update inventory
  const updateInventory = async (productId, size, quantity) => {
    try {
      await fetch(`${API_URL}/api/admin/inventory/${productId}?size=${size}&quantity=${quantity}`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      loadInventory();
    } catch (error) {
      console.error('Failed to update inventory:', error);
    }
  };

  // Delete contact
  const deleteContact = async (email) => {
    if (!window.confirm(`Delete ALL data for ${email}? This cannot be undone.`)) return;
    try {
      await fetch(`${API_URL}/api/admin/contact/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      loadAllContacts();
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  // Bulk delete
  const bulkDeleteContacts = async () => {
    if (selectedContacts.length === 0) return;
    if (!window.confirm(`Delete ${selectedContacts.length} contacts? This cannot be undone.`)) return;
    
    try {
      await fetch(`${API_URL}/api/admin/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ emails: selectedContacts })
      });
      setSelectedContacts([]);
      loadAllContacts();
    } catch (error) {
      console.error('Failed to bulk delete:', error);
    }
  };

  // Toggle contact selection
  const toggleContactSelection = (email) => {
    setSelectedContacts(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  // Select all contacts
  const selectAllContacts = () => {
    if (selectedContacts.length === allContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(allContacts.map(c => c.email));
    }
  };

  // Load activity log
  const loadActivityLog = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/activity-log?limit=100`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setActivityLog(data.logs || []);
    } catch (error) {
      console.error('Failed to load activity log:', error);
    }
    setLoading(false);
  };

  // Load discount codes
  const loadDiscountCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/discount-codes`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setDiscountCodes(data.codes || []);
    } catch (error) {
      console.error('Failed to load discount codes:', error);
    }
    setLoading(false);
  };

  // Create discount code
  const createDiscountCode = async () => {
    if (!newDiscountCode.code) return;
    try {
      await fetch(`${API_URL}/api/admin/discount-codes?code=${newDiscountCode.code}&discount_percent=${newDiscountCode.discount_percent}&max_uses=${newDiscountCode.max_uses}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      setNewDiscountCode({ code: '', discount_percent: 10, max_uses: 0 });
      loadDiscountCodes();
    } catch (error) {
      console.error('Failed to create discount code:', error);
    }
  };

  // Load email logs
  const loadEmailLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/email-logs?limit=200`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setEmailLogs(data.logs || []);
      setEmailLogsSummary(data.summary || null);
    } catch (error) {
      console.error('Failed to load email logs:', error);
    }
    setLoading(false);
  };

  // Load duplicates
  const loadDuplicates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/duplicates`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setDuplicates(data.duplicates || []);
    } catch (error) {
      console.error('Failed to load duplicates:', error);
    }
    setLoading(false);
  };

  // Merge duplicates
  const mergeDuplicates = async (email) => {
    if (!window.confirm(`Merge duplicate entries for ${email}?`)) return;
    try {
      await fetch(`${API_URL}/api/admin/merge-duplicates?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      loadDuplicates();
    } catch (error) {
      console.error('Failed to merge duplicates:', error);
    }
  };

  // Add user note
  const addUserNote = async (email) => {
    if (!newNote.trim()) return;
    try {
      await fetch(`${API_URL}/api/admin/user/${encodeURIComponent(email)}/notes?note=${encodeURIComponent(newNote)}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      setNewNote('');
      loadUserDetails(email);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  // Resend email
  const resendEmail = async (email, emailType = 'welcome') => {
    if (!window.confirm(`Resend ${emailType} email to ${email}?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/resend-email/${encodeURIComponent(email)}?email_type=${emailType}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error('Failed to resend email:', error);
    }
  };

  // ============== END NEW FEATURE FUNCTIONS ==============

  const deleteSubscriber = async (email) => {
    if (!window.confirm(`Delete subscriber ${email}?`)) return;
    
    try {
      await fetch(`${API_URL}/api/admin/subscriber/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        
        headers: getAuthHeaders()
      });
      loadSubscribers();
    } catch (error) {
      console.error('Failed to delete subscriber:', error);
    }
  };

  const deleteUser = async (userId, email) => {
    if (!window.confirm(`Delete user ${email}?`)) return;
    
    try {
      await fetch(`${API_URL}/api/admin/user/${userId}`, {
        method: 'DELETE',
        
        headers: getAuthHeaders()
      });
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const sendBulkEmail = async (e) => {
    e.preventDefault();
    if (!emailForm.subject || !emailForm.html_content) {
      alert('Please fill in subject and content');
      return;
    }
    
    if (!window.confirm(`Send email to ${emailForm.target} recipients?`)) return;
    
    setSendingEmail(true);
    setEmailResult(null);
    
    try {
      const res = await fetch(`${API_URL}/api/admin/send-bulk-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        
        body: JSON.stringify(emailForm)
      });
      const data = await res.json();
      setEmailResult(data);
      
      if (data.success) {
        setEmailForm({ subject: '', html_content: '', target: 'all' });
      }
    } catch (error) {
      setEmailResult({ success: false, message: 'Failed to send emails' });
    }
    setSendingEmail(false);
  };

  // Load data when tab changes
  useEffect(() => {
    if (!isAuthenticated) return;
    
    switch (activeTab) {
      case 'users':
        loadUsers();
        break;
      case 'contacts':
        loadAllContacts();
        break;
      case 'subscribers':
        loadSubscribers();
        break;
      case 'waitlist':
        loadWaitlist();
        break;
      case 'orders':
        loadOrders();
        break;
      case 'analytics':
        loadAnalytics();
        break;
      case 'inventory':
        loadInventory();
        break;
      case 'activity':
        loadActivityLog();
        break;
      case 'discounts':
        loadDiscountCodes();
        break;
      case 'email-logs':
        loadEmailLogs();
        break;
      case 'duplicates':
        loadDuplicates();
        break;
      default:
        loadStats();
    }
  }, [activeTab, isAuthenticated]);

  // Login Screen - only shown if not admin
  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-container">
          <h1>Admin Access</h1>
          <p>You must be logged in as an admin to access this page.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '16px' }}>
            Please log in with your admin account (joviloh25@gmail.com)
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="admin-login-btn"
            style={{ marginTop: '20px' }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <h1>RAZE Admin Dashboard</h1>
        <button onClick={handleLogout} className="admin-logout-btn">
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {[
          { id: 'overview', label: 'Overview', icon: <ChevronDown size={18} /> },
          { id: 'contacts', label: 'All Contacts', icon: <Users size={18} /> },
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
          { id: 'inventory', label: 'Inventory', icon: <Package size={18} /> },
          { id: 'discounts', label: 'Discounts', icon: <Tag size={18} /> },
          { id: 'activity', label: 'Activity Log', icon: <Activity size={18} /> },
          { id: 'email-logs', label: 'Email Status', icon: <AlertCircle size={18} /> },
          { id: 'duplicates', label: 'Duplicates', icon: <Copy size={18} /> },
          { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
          { id: 'email', label: 'Send Email', icon: <Send size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="admin-content">
        {loading && <div className="admin-loading">Loading...</div>}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="admin-overview">
            {/* Time Frame Selector */}
            <div className="timeframe-selector">
              <Calendar size={18} />
              <span>Time Period:</span>
              <div className="timeframe-buttons">
                {timeframeOptions.map(option => (
                  <button
                    key={option.value}
                    className={`timeframe-btn ${timeframe === option.value ? 'active' : ''}`}
                    onClick={() => handleTimeframeChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card signups">
                <Users className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.total_users}</h3>
                  <p>Total Signups</p>
                  <span className="stat-sub">+{stats.recent_users_7d} this week</span>
                </div>
              </div>
              <div className="stat-card waitlist">
                <Clock className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.total_waitlist}</h3>
                  <p>Waitlist Entries</p>
                  <span className="stat-sub">+{stats.recent_waitlist_7d || 0} this week</span>
                </div>
              </div>
              <div className="stat-card giveaway">
                <Gift className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.total_giveaway || 0}</h3>
                  <p>Giveaway Entries</p>
                  <span className="stat-sub">+{stats.recent_giveaway_7d || 0} this week</span>
                </div>
              </div>
              <div className="stat-card subscribers">
                <Mail className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.total_subscribers}</h3>
                  <p>Email Subscribers</p>
                  <span className="stat-sub">+{stats.recent_subscribers_7d} this week</span>
                </div>
              </div>
              <div className="stat-card orders">
                <ShoppingBag className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.total_orders}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
            </div>

            {/* Breakdown Section */}
            <div className="breakdown-section">
              <h3><Target size={20} /> Breakdown by Discipline</h3>
              
              <div className="breakdown-grid">
                {/* Signups Breakdown */}
                <div className="breakdown-card">
                  <h4>Signups by Type</h4>
                  <div className="breakdown-items">
                    <div className="breakdown-item mag">
                      <span className="breakdown-label">MAG (Men's)</span>
                      <span className="breakdown-value">{stats.mag_users || 0}</span>
                      <div className="breakdown-bar">
                        <div 
                          className="breakdown-fill mag" 
                          style={{ width: `${stats.total_users > 0 ? ((stats.mag_users || 0) / stats.total_users * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="breakdown-item wag">
                      <span className="breakdown-label">WAG (Women's)</span>
                      <span className="breakdown-value">{stats.wag_users || 0}</span>
                      <div className="breakdown-bar">
                        <div 
                          className="breakdown-fill wag" 
                          style={{ width: `${stats.total_users > 0 ? ((stats.wag_users || 0) / stats.total_users * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="breakdown-item other">
                      <span className="breakdown-label">Others</span>
                      <span className="breakdown-value">{stats.other_users || 0}</span>
                      <div className="breakdown-bar">
                        <div 
                          className="breakdown-fill other" 
                          style={{ width: `${stats.total_users > 0 ? ((stats.other_users || 0) / stats.total_users * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="breakdown-total">
                    <span>Total</span>
                    <span>{stats.total_users}</span>
                  </div>
                </div>

                {/* Waitlist Breakdown */}
                <div className="breakdown-card">
                  <h4>Waitlist by Type</h4>
                  <div className="breakdown-items">
                    <div className="breakdown-item mag">
                      <span className="breakdown-label">MAG (Men's)</span>
                      <span className="breakdown-value">{stats.mag_waitlist || 0}</span>
                      <div className="breakdown-bar">
                        <div 
                          className="breakdown-fill mag" 
                          style={{ width: `${stats.total_waitlist > 0 ? ((stats.mag_waitlist || 0) / stats.total_waitlist * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="breakdown-item wag">
                      <span className="breakdown-label">WAG (Women's)</span>
                      <span className="breakdown-value">{stats.wag_waitlist || 0}</span>
                      <div className="breakdown-bar">
                        <div 
                          className="breakdown-fill wag" 
                          style={{ width: `${stats.total_waitlist > 0 ? ((stats.wag_waitlist || 0) / stats.total_waitlist * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="breakdown-item other">
                      <span className="breakdown-label">Others</span>
                      <span className="breakdown-value">{stats.other_waitlist || 0}</span>
                      <div className="breakdown-bar">
                        <div 
                          className="breakdown-fill other" 
                          style={{ width: `${stats.total_waitlist > 0 ? ((stats.other_waitlist || 0) / stats.total_waitlist * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="breakdown-total">
                    <span>Total</span>
                    <span>{stats.total_waitlist}</span>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="breakdown-card summary">
                  <h4>Quick Summary</h4>
                  <div className="summary-stats">
                    <div className="summary-item">
                      <span className="summary-label">Giveaway Entries</span>
                      <span className="summary-value giveaway">{stats.total_giveaway || 0}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Email Subscribers</span>
                      <span className="summary-value subscribers">{stats.total_subscribers}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Orders</span>
                      <span className="summary-value orders">{stats.total_orders}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="action-buttons-row">
              <button onClick={() => loadStats()} className="refresh-btn">
                <RefreshCw size={16} /> Refresh Stats
              </button>
              <button onClick={pickGiveawayWinner} className="action-btn giveaway">
                <Shuffle size={16} /> Pick Giveaway Winner
              </button>
              <label className="auto-refresh-toggle">
                <input 
                  type="checkbox" 
                  checked={autoRefresh} 
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                Auto-refresh (30s)
              </label>
            </div>

            {/* Search & Filter Section */}
            <div className="search-filter-section">
              <h4><Search size={18} /> Search & Filter</h4>
              <div className="search-row">
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <select value={filterDiscipline} onChange={(e) => setFilterDiscipline(e.target.value)} className="filter-select">
                  <option value="all">All Disciplines</option>
                  <option value="MAG">MAG</option>
                  <option value="WAG">WAG</option>
                </select>
                <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="filter-select">
                  <option value="all">All Sources</option>
                  <option value="giveaway_popup">Giveaway</option>
                  <option value="early_access">Early Access</option>
                  <option value="waitlist">Waitlist</option>
                </select>
                <input type="date" value={customDateStart} onChange={(e) => setCustomDateStart(e.target.value)} className="date-input" />
                <input type="date" value={customDateEnd} onChange={(e) => setCustomDateEnd(e.target.value)} className="date-input" />
                <button onClick={searchContacts} className="search-btn">
                  <Search size={16} /> Search
                </button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="search-results">
                  <h5>Found {searchResults.length} results</h5>
                  <div className="results-list">
                    {searchResults.slice(0, 20).map((r, i) => (
                      <div key={i} className="result-item" onClick={() => loadUserDetails(r.email)}>
                        <span className="result-email">{r.email}</span>
                        <span className={`discipline-badge ${(r.discipline || 'unknown').toLowerCase()}`}>{r.discipline}</span>
                        <span className={`source-badge ${r.source}`}>{r.source}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Giveaway Winner Display */}
            {giveawayWinner && (
              <div className="giveaway-winner-card">
                <h4>🎉 Giveaway Winner</h4>
                <p className="winner-email">{giveawayWinner.email}</p>
                <p className="winner-name">{giveawayWinner.name || 'No name provided'}</p>
                <button onClick={() => setGiveawayWinner(null)} className="close-btn">×</button>
              </div>
            )}
          </div>
        )}

        {/* All Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="admin-table-container">
            <div className="table-header">
              <h2>All Contacts ({allContacts.length})</h2>
              <div className="header-actions">
                <button onClick={exportToCSV} className="action-btn export">
                  <Download size={16} /> Export CSV
                </button>
                {selectedContacts.length > 0 && (
                  <button onClick={bulkDeleteContacts} className="action-btn delete">
                    <Trash2 size={16} /> Delete ({selectedContacts.length})
                  </button>
                )}
                <button onClick={loadAllContacts} className="refresh-btn">
                  <RefreshCw size={16} /> Refresh
                </button>
              </div>
            </div>
            
            {/* Summary Cards */}
            {contactsSummary && (
              <div className="contacts-summary">
                <div className="summary-card">
                  <span className="summary-number">{contactsSummary.total_signed_up}</span>
                  <span className="summary-label">Signed Up</span>
                </div>
                <div className="summary-card giveaway">
                  <span className="summary-number">{contactsSummary.total_giveaway}</span>
                  <span className="summary-label">Giveaway</span>
                </div>
                <div className="summary-card early">
                  <span className="summary-number">{contactsSummary.total_early_access}</span>
                  <span className="summary-label">Early Access</span>
                </div>
                <div className="summary-card waitlist">
                  <span className="summary-number">{contactsSummary.total_with_waitlist}</span>
                  <span className="summary-label">Waitlist</span>
                </div>
                <div className="summary-card orders">
                  <span className="summary-number">{contactsSummary.total_with_orders}</span>
                  <span className="summary-label">Has Orders</span>
                </div>
                <div className="summary-card cart">
                  <span className="summary-number">{contactsSummary.total_with_cart}</span>
                  <span className="summary-label">Has Cart</span>
                </div>
                <div className="summary-card mag">
                  <span className="summary-number">{contactsSummary.mag_count}</span>
                  <span className="summary-label">MAG</span>
                </div>
                <div className="summary-card wag">
                  <span className="summary-number">{contactsSummary.wag_count}</span>
                  <span className="summary-label">WAG</span>
                </div>
              </div>
            )}

            <div className="table-scroll">
              <table className="admin-table enhanced">
                <thead>
                  <tr>
                    <th>
                      <button onClick={selectAllContacts} className="select-all-btn">
                        {selectedContacts.length === allContacts.length ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    </th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Discipline</th>
                    <th>Source</th>
                    <th>Signed Up</th>
                    <th>Giveaway</th>
                    <th>Early Access</th>
                    <th>Waitlist</th>
                    <th>Orders</th>
                    <th>Cart</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allContacts.map((contact, i) => (
                    <tr key={i} className={selectedContacts.includes(contact.email) ? 'selected' : ''}>
                      <td>
                        <button onClick={() => toggleContactSelection(contact.email)} className="select-btn">
                          {selectedContacts.includes(contact.email) ? <CheckSquare size={16} /> : <Square size={16} />}
                        </button>
                      </td>
                      <td className="email-cell">{contact.email}</td>
                      <td>{contact.name || '-'}</td>
                      <td>
                        <span className={`discipline-badge ${(contact.discipline || 'unknown').toLowerCase()}`}>
                          {contact.discipline || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <span className={`source-badge ${contact.signup_source}`}>
                          {contact.signup_source}
                        </span>
                      </td>
                      <td>
                        {contact.signed_up ? (
                          <span className="status-yes"><Check size={14} /></span>
                        ) : (
                          <span className="status-no"><X size={14} /></span>
                        )}
                      </td>
                      <td>
                        {contact.has_giveaway_entry ? (
                          <span className="status-yes"><Check size={14} /></span>
                        ) : (
                          <span className="status-no"><X size={14} /></span>
                        )}
                      </td>
                      <td>
                        {contact.has_early_access ? (
                          <span className="status-yes"><Check size={14} /></span>
                        ) : (
                          <span className="status-no"><X size={14} /></span>
                        )}
                      </td>
                      <td>
                        {contact.waitlist_products?.length > 0 ? (
                          <span className="waitlist-badge" title={contact.waitlist_products.join(', ')}>
                            {contact.waitlist_products.length} item{contact.waitlist_products.length > 1 ? 's' : ''}
                          </span>
                        ) : '-'}
                      </td>
                      <td>
                        {contact.orders_count > 0 ? (
                          <span className="orders-badge">
                            {contact.orders_count} (${contact.total_spent?.toFixed(0) || 0})
                          </span>
                        ) : '-'}
                      </td>
                      <td>
                        {contact.has_cart ? (
                          <span className="status-yes"><Check size={14} /></span>
                        ) : (
                          <span className="status-no"><X size={14} /></span>
                        )}
                      </td>
                      <td>{contact.signup_date ? new Date(contact.signup_date).toLocaleDateString() : '-'}</td>
                      <td>
                        <div className="action-btns">
                          <button onClick={() => loadUserDetails(contact.email)} className="action-btn-sm view" title="View Details">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => resendEmail(contact.email)} className="action-btn-sm resend" title="Resend Email">
                            <RotateCcw size={14} />
                          </button>
                          <button onClick={() => deleteContact(contact.email)} className="action-btn-sm delete" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {allContacts.length === 0 && (
                    <tr><td colSpan="13" className="empty-row">No contacts found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* User Detail Modal */}
            {selectedUser && userDetails && (
              <div className="user-detail-modal">
                <div className="modal-content">
                  <button onClick={() => setSelectedUser(null)} className="close-modal">×</button>
                  <h3>User Details: {selectedUser}</h3>
                  
                  {userDetails.user && (
                    <div className="detail-section">
                      <h4>Account Info</h4>
                      <p><strong>Name:</strong> {userDetails.user.name || '-'}</p>
                      <p><strong>Discipline:</strong> {userDetails.user.discipline || '-'}</p>
                      <p><strong>Auth:</strong> {userDetails.user.auth_provider || '-'}</p>
                      <p><strong>Joined:</strong> {new Date(userDetails.user.created_at).toLocaleString()}</p>
                    </div>
                  )}
                  
                  <div className="detail-section">
                    <h4>Subscriptions ({userDetails.subscriptions?.length || 0})</h4>
                    {userDetails.subscriptions?.map((s, i) => (
                      <span key={i} className={`source-badge ${s.source}`}>{s.source}</span>
                    ))}
                  </div>
                  
                  <div className="detail-section">
                    <h4>Waitlist ({userDetails.waitlist?.length || 0})</h4>
                    {userDetails.waitlist?.map((w, i) => (
                      <p key={i}>{w.product_name} - {w.size}</p>
                    ))}
                  </div>
                  
                  <div className="detail-section">
                    <h4>Orders ({userDetails.orders?.length || 0})</h4>
                    {userDetails.orders?.map((o, i) => (
                      <p key={i}>Order #{o.order_id?.slice(0,8)} - ${o.total}</p>
                    ))}
                  </div>
                  
                  <div className="detail-section">
                    <h4>Notes</h4>
                    {userDetails.notes?.map((n, i) => (
                      <div key={i} className="note-item">
                        <p>{n.note}</p>
                        <small>{new Date(n.created_at).toLocaleString()}</small>
                      </div>
                    ))}
                    <div className="add-note">
                      <input 
                        type="text" 
                        placeholder="Add a note..." 
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <button onClick={() => addUserNote(selectedUser)}>
                        <MessageSquare size={14} /> Add
                      </button>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Email History</h4>
                    {userDetails.email_logs?.slice(0,5).map((e, i) => (
                      <p key={i} className={`email-log-item ${e.status}`}>
                        {e.email_type} - {e.status} - {new Date(e.sent_at).toLocaleDateString()}
                      </p>
                    ))}
                  </div>
                  
                  <div className="modal-actions">
                    <button onClick={() => resendEmail(selectedUser, 'welcome')} className="action-btn">
                      <RotateCcw size={14} /> Resend Welcome
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analyticsData && (
          <div className="admin-analytics">
            {/* Top Stats Row */}
            <div className="analytics-stats-row">
              <div className="analytics-stat-card revenue">
                <DollarSign className="analytics-icon" />
                <div>
                  <h3>${analyticsData.totalRevenue.toFixed(2)}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
              <div className="analytics-stat-card orders">
                <ShoppingBag className="analytics-icon" />
                <div>
                  <h3>{analyticsData.totalOrders}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="analytics-stat-card avg">
                <TrendingUp className="analytics-icon" />
                <div>
                  <h3>${analyticsData.avgOrderValue.toFixed(2)}</h3>
                  <p>Avg Order Value</p>
                </div>
              </div>
              <div className="analytics-stat-card waitlist">
                <Clock className="analytics-icon" />
                <div>
                  <h3>{analyticsData.totalWaitlist}</h3>
                  <p>Waitlist Entries</p>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
              {/* Revenue Chart */}
              <div className="chart-card full-width">
                <h3>Revenue (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4A9FF5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4A9FF5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                      formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#4A9FF5" 
                      strokeWidth={2}
                      fill="url(#revenueGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Signups Chart */}
              <div className="chart-card">
                <h3>Signups (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analyticsData.signupData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="users" fill="#4A9FF5" name="Users" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="subscribers" fill="#10B981" name="Subscribers" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="waitlist" fill="#F59E0B" name="Waitlist" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Order Status Pie Chart */}
              <div className="chart-card">
                <h3>Order Status</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analyticsData.orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {analyticsData.orderStatusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={['#4A9FF5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top Products Chart */}
              <div className="chart-card">
                <h3>Top Waitlisted Products</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analyticsData.productData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis type="number" stroke="#888" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#888" fontSize={11} width={100} />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Entries" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <button onClick={loadAnalytics} className="refresh-btn">
              <RefreshCw size={16} /> Refresh Analytics
            </button>
          </div>
        )}

        {/* Users Tab - Enhanced View */}
        {activeTab === 'users' && (
          <div className="admin-table-container">
            <div className="table-header">
              <h2>All Accounts ({users.length})</h2>
              <button onClick={loadUsers} className="refresh-btn">
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <div className="table-scroll">
              <table className="admin-table enhanced">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Discipline</th>
                    <th>Source</th>
                    <th>Provider</th>
                    <th>Giveaway</th>
                    <th>Waitlist</th>
                    <th>Cart</th>
                    <th>Orders</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={i}>
                      <td className="email-cell">{user.email}</td>
                      <td>{user.name || '-'}</td>
                      <td>
                        <span className={`discipline-badge ${(user.discipline || 'unknown').toLowerCase()}`}>
                          {user.discipline || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <span className={`source-badge ${user.signup_source || 'direct'}`}>
                          {user.signup_source || 'Direct'}
                        </span>
                      </td>
                      <td>{user.auth_provider || '-'}</td>
                      <td>
                        {user.has_giveaway_entry ? (
                          <span className="status-yes"><Check size={14} /></span>
                        ) : (
                          <span className="status-no"><X size={14} /></span>
                        )}
                      </td>
                      <td>
                        {user.waitlist_count > 0 ? (
                          <span className="waitlist-badge" title={user.waitlist_products?.join(', ')}>
                            {user.waitlist_count} item{user.waitlist_count > 1 ? 's' : ''}
                          </span>
                        ) : '-'}
                      </td>
                      <td>
                        {user.has_cart ? (
                          <span className="status-yes"><Check size={14} /></span>
                        ) : (
                          <span className="status-no"><X size={14} /></span>
                        )}
                      </td>
                      <td>
                        {user.orders_count > 0 ? (
                          <span className="orders-badge">
                            {user.orders_count} (${user.total_spent?.toFixed(0) || 0})
                          </span>
                        ) : '-'}
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <button 
                          onClick={() => deleteUser(user.user_id, user.email)}
                          className="delete-btn"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="11" className="empty-row">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <div className="admin-table-container">
            <div className="table-header">
              <h2>Email Subscribers ({subscribers.length})</h2>
              <button onClick={loadSubscribers} className="refresh-btn">
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, i) => (
                  <tr key={i}>
                    <td>{sub.email}</td>
                    <td><span className={`source-badge ${sub.source}`}>{sub.source}</span></td>
                    <td>{sub.product_id || '-'}</td>
                    <td>{new Date(sub.timestamp).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => deleteSubscriber(sub.email)}
                        className="delete-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr><td colSpan="5" className="empty-row">No subscribers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Waitlist Tab */}
        {activeTab === 'waitlist' && (
          <div className="admin-table-container">
            <div className="table-header">
              <h2>Waitlist Entries ({waitlist.length})</h2>
              <button onClick={loadWaitlist} className="refresh-btn">
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Product</th>
                  <th>Variant</th>
                  <th>Size</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry.email}</td>
                    <td>{entry.product_name}</td>
                    <td>{entry.variant}</td>
                    <td>{entry.size}</td>
                    <td>#{entry.position || i + 1}</td>
                  </tr>
                ))}
                {waitlist.length === 0 && (
                  <tr><td colSpan="5" className="empty-row">No waitlist entries found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="admin-table-container">
            <div className="table-header">
              <h2>Orders ({orders.length})</h2>
              <button onClick={loadOrders} className="refresh-btn">
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={i}>
                    <td className="order-id">{order.order_id?.slice(0, 12)}...</td>
                    <td>{order.shipping?.email || order.customer_email || '-'}</td>
                    <td>{order.items?.length || 0} items</td>
                    <td>${order.total?.toFixed(2) || '0.00'}</td>
                    <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="6" className="empty-row">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Send Email Tab */}
        {activeTab === 'email' && (
          <div className="admin-email-form">
            <h2>Send Bulk Email</h2>
            
            <form onSubmit={sendBulkEmail}>
              <div className="form-group">
                <label>Target Audience</label>
                <select 
                  value={emailForm.target}
                  onChange={(e) => setEmailForm({...emailForm, target: e.target.value})}
                >
                  <option value="all">All (Subscribers + Users)</option>
                  <option value="subscribers">All Subscribers</option>
                  <option value="users">Registered Users Only</option>
                  <option value="waitlist">Waitlist Only</option>
                  <option value="early_access">Early Access Subscribers</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  placeholder="Email subject..."
                />
              </div>
              
              <div className="form-group">
                <label>HTML Content</label>
                <textarea
                  value={emailForm.html_content}
                  onChange={(e) => setEmailForm({...emailForm, html_content: e.target.value})}
                  placeholder="<h1>Hello!</h1><p>Your email content here...</p>"
                  rows={10}
                />
              </div>
              
              <button type="submit" disabled={sendingEmail} className="send-email-btn">
                {sendingEmail ? (
                  <>Sending...</>
                ) : (
                  <><Send size={18} /> Send Email</>
                )}
              </button>
            </form>
            
            {emailResult && (
              <div className={`email-result ${emailResult.success ? 'success' : 'error'}`}>
                {emailResult.success ? <Check size={20} /> : <X size={20} />}
                <div>
                  <strong>{emailResult.success ? 'Success!' : 'Failed'}</strong>
                  <p>{emailResult.message}</p>
                  {emailResult.sent_count !== undefined && (
                    <p>Sent: {emailResult.sent_count} / {emailResult.total_recipients}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
