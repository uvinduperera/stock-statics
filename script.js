// API Configuration
const API_BASE_URL = 'https://www.cse.lk/api/';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// State management
let currentTheme = localStorage.getItem('theme') || 'light';
let autoRefreshInterval = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeEventListeners();
    loadAllData();
    startAutoRefresh();
});

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
}

// Event Listeners
function initializeEventListeners() {
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('refresh-btn').addEventListener('click', handleRefresh);
    document.getElementById('search-btn').addEventListener('click', handleSearch);
    document.getElementById('stock-search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

// Auto-refresh functionality
function startAutoRefresh() {
    // Refresh data every 30 seconds
    autoRefreshInterval = setInterval(() => {
        loadAllData(true);
    }, 30000);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
}

// Manual refresh handler
function handleRefresh() {
    const refreshIcon = document.querySelector('.refresh-icon');
    refreshIcon.classList.add('spinning');
    
    loadAllData();
    
    setTimeout(() => {
        refreshIcon.classList.remove('spinning');
    }, 1000);
}

// Load all data
async function loadAllData(silent = false) {
    if (!silent) {
        showLoading();
    }
    
    try {
        await Promise.all([
            loadMarketStatus(),
            loadMarketSummary(),
            loadTopGainers(),
            loadTopLosers()
        ]);
        
        updateLastUpdateTime();
    } catch (error) {
        console.error('Error loading data:', error);
        if (!silent) {
            showError('Failed to load market data. Please try again.');
        }
    }
}

// Market Status
async function loadMarketStatus() {
    try {
        const response = await fetchCSEData('marketStatus');
        const statusDot = document.getElementById('market-status-dot');
        const statusText = document.getElementById('market-status-text');
        
        if (response && response.status) {
            const isOpen = response.status.toLowerCase().includes('open');
            statusDot.className = `status-dot ${isOpen ? 'open' : 'closed'}`;
            statusText.textContent = response.status;
        } else {
            statusDot.className = 'status-dot closed';
            statusText.textContent = 'Market Closed';
        }
    } catch (error) {
        console.error('Error loading market status:', error);
        const statusDot = document.getElementById('market-status-dot');
        const statusText = document.getElementById('market-status-text');
        statusDot.className = 'status-dot closed';
        statusText.textContent = 'Status Unavailable';
    }
}

// Market Summary
async function loadMarketSummary() {
    try {
        const response = await fetchCSEData('marketSummery');
        
        if (response) {
            const container = document.getElementById('market-summary-cards');
            container.innerHTML = '';
            
            // ASPI Index
            if (response.aspi) {
                const aspiCard = createSummaryCard(
                    'ASPI',
                    formatNumber(response.aspi.value || response.aspi),
                    response.aspi.change,
                    response.aspi.percentageChange
                );
                container.appendChild(aspiCard);
            }
            
            // S&P SL20 Index
            if (response.sp) {
                const spCard = createSummaryCard(
                    'S&P SL20',
                    formatNumber(response.sp.value || response.sp),
                    response.sp.change,
                    response.sp.percentageChange
                );
                container.appendChild(spCard);
            }
            
            // Turnover
            if (response.turnover) {
                const turnoverCard = createSummaryCard(
                    'Turnover',
                    formatCurrency(response.turnover),
                    'LKR',
                    null,
                    'neutral'
                );
                container.appendChild(turnoverCard);
            }
            
            // Volume
            if (response.volume) {
                const volumeCard = createSummaryCard(
                    'Volume',
                    formatNumber(response.volume),
                    'Shares',
                    null,
                    'neutral'
                );
                container.appendChild(volumeCard);
            }
        }
    } catch (error) {
        console.error('Error loading market summary:', error);
    }
}

// Create summary card
function createSummaryCard(label, value, change, percentage, forceClass = null) {
    const card = document.createElement('div');
    card.className = 'summary-card';
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'card-label';
    labelDiv.textContent = label;
    
    const valueDiv = document.createElement('div');
    valueDiv.className = 'card-value';
    valueDiv.textContent = value;
    
    const changeDiv = document.createElement('div');
    changeDiv.className = 'card-change';
    
    if (forceClass) {
        changeDiv.classList.add(forceClass);
        changeDiv.textContent = change || '';
    } else if (change !== undefined && change !== null && percentage !== undefined && percentage !== null) {
        const changeClass = change >= 0 ? 'positive' : 'negative';
        changeDiv.classList.add(changeClass);
        const sign = change >= 0 ? '+' : '';
        changeDiv.textContent = `${sign}${formatNumber(change)} (${sign}${percentage}%)`;
    } else {
        changeDiv.classList.add('neutral');
        changeDiv.textContent = change || '';
    }
    
    card.appendChild(labelDiv);
    card.appendChild(valueDiv);
    card.appendChild(changeDiv);
    
    return card;
}

// Top Gainers
async function loadTopGainers() {
    try {
        const response = await fetchCSEData('topGainers');
        const container = document.getElementById('top-gainers');
        
        if (response && Array.isArray(response) && response.length > 0) {
            container.innerHTML = '';
            response.slice(0, 5).forEach(stock => {
                const item = createMoverItem(stock, 'positive');
                container.appendChild(item);
            });
        } else {
            container.innerHTML = '<div class="loading-message">No gainers data available</div>';
        }
    } catch (error) {
        console.error('Error loading top gainers:', error);
        document.getElementById('top-gainers').innerHTML = 
            '<div class="error-message">Failed to load gainers</div>';
    }
}

// Top Losers
async function loadTopLosers() {
    try {
        const response = await fetchCSEData('topLooses');
        const container = document.getElementById('top-losers');
        
        if (response && Array.isArray(response) && response.length > 0) {
            container.innerHTML = '';
            response.slice(0, 5).forEach(stock => {
                const item = createMoverItem(stock, 'negative');
                container.appendChild(item);
            });
        } else {
            container.innerHTML = '<div class="loading-message">No losers data available</div>';
        }
    } catch (error) {
        console.error('Error loading top losers:', error);
        document.getElementById('top-losers').innerHTML = 
            '<div class="error-message">Failed to load losers</div>';
    }
}

// Create mover item
function createMoverItem(stock, type) {
    const item = document.createElement('div');
    item.className = 'mover-item';
    
    const info = document.createElement('div');
    info.className = 'mover-info';
    
    const symbol = document.createElement('div');
    symbol.className = 'mover-symbol';
    symbol.textContent = stock.symbol || stock.ticker || 'N/A';
    
    const price = document.createElement('div');
    price.className = 'mover-price';
    price.textContent = `LKR ${formatNumber(stock.price || stock.lastTradedPrice || 0)}`;
    
    info.appendChild(symbol);
    info.appendChild(price);
    
    const change = document.createElement('div');
    change.className = 'mover-change';
    
    const percentage = document.createElement('div');
    percentage.className = `mover-percentage ${type}`;
    const changeValue = stock.percentageChange || stock.change || 0;
    const sign = type === 'positive' ? '+' : '';
    percentage.textContent = `${sign}${changeValue}%`;
    
    const value = document.createElement('div');
    value.className = 'mover-value';
    const priceChange = stock.priceChange || stock.changeValue || 0;
    value.textContent = `${sign}${formatNumber(priceChange)}`;
    
    change.appendChild(percentage);
    change.appendChild(value);
    
    item.appendChild(info);
    item.appendChild(change);
    
    return item;
}

// Search functionality
async function handleSearch() {
    const searchInput = document.getElementById('stock-search');
    const searchTerm = searchInput.value.trim().toUpperCase();
    const resultsContainer = document.getElementById('search-results');
    
    if (!searchTerm) {
        resultsContainer.innerHTML = '<div class="error-message">Please enter a stock symbol</div>';
        return;
    }
    
    resultsContainer.innerHTML = '<div class="loading-message">Searching...</div>';
    
    try {
        // Common stock symbols mapping for convenience
        const symbolMapping = {
            'JKH': 'JKH.N0000',
            'LOLC': 'LOLC.N0000',
            'COMB': 'COMB.N0000',
            'DIPD': 'DIPD.N0000',
            'DIAL': 'DIAL.N0000',
            'NDB': 'NDB.N0000',
            'SAMP': 'SAMP.N0000',
            'CTC': 'CTC.N0000',
            'HNB': 'HNB.N0000',
            'CINS': 'CINS.N0000'
        };
        
        // Try to find the full symbol
        let fullSymbol = searchTerm;
        if (symbolMapping[searchTerm]) {
            fullSymbol = symbolMapping[searchTerm];
        } else if (!searchTerm.includes('.')) {
            fullSymbol = `${searchTerm}.N0000`;
        }
        
        const stockData = await fetchCSEData('companyInfoSummery', { symbol: fullSymbol });
        
        if (stockData && stockData.symbol) {
            displayStockDetails(stockData);
        } else {
            resultsContainer.innerHTML = 
                `<div class="error-message">Stock "${searchTerm}" not found. Try symbols like JKH, LOLC, COMB, etc.</div>`;
        }
    } catch (error) {
        console.error('Error searching stock:', error);
        resultsContainer.innerHTML = 
            `<div class="error-message">Error searching for "${searchTerm}". Please try again.</div>`;
    }
}

// Display stock details
function displayStockDetails(stock) {
    const resultsContainer = document.getElementById('search-results');
    
    const detailDiv = document.createElement('div');
    detailDiv.className = 'stock-detail';
    
    // Header
    const header = document.createElement('div');
    header.className = 'stock-header';
    
    const symbolDiv = document.createElement('div');
    symbolDiv.className = 'stock-symbol';
    symbolDiv.textContent = stock.symbol;
    
    const priceInfo = document.createElement('div');
    priceInfo.style.textAlign = 'right';
    
    const price = document.createElement('div');
    price.className = 'stock-price';
    price.textContent = `LKR ${formatNumber(stock.lastTradedPrice || stock.price || 0)}`;
    
    const change = document.createElement('div');
    change.className = 'stock-change';
    const changeValue = stock.change || 0;
    const percentChange = stock.percentageChange || 0;
    change.classList.add(changeValue >= 0 ? 'positive' : 'negative');
    const sign = changeValue >= 0 ? '+' : '';
    change.textContent = `${sign}${formatNumber(changeValue)} (${sign}${percentChange}%)`;
    
    priceInfo.appendChild(price);
    priceInfo.appendChild(change);
    header.appendChild(symbolDiv);
    header.appendChild(priceInfo);
    
    // Info grid
    const grid = document.createElement('div');
    grid.className = 'stock-info-grid';
    
    const infoItems = [
        { label: 'Open', value: formatNumber(stock.openPrice || stock.open || 0) },
        { label: 'High', value: formatNumber(stock.high || stock.highPrice || 0) },
        { label: 'Low', value: formatNumber(stock.low || stock.lowPrice || 0) },
        { label: 'Previous Close', value: formatNumber(stock.previousClose || 0) },
        { label: 'Volume', value: formatNumber(stock.volume || stock.totalVolume || 0) },
        { label: 'Turnover', value: formatCurrency(stock.turnover || stock.totalTurnover || 0) },
        { label: 'Trades', value: formatNumber(stock.trades || stock.totalTrades || 0) },
        { label: 'Market Cap', value: formatCurrency(stock.marketCap || 0) }
    ];
    
    infoItems.forEach(item => {
        const infoItem = document.createElement('div');
        infoItem.className = 'stock-info-item';
        
        const label = document.createElement('div');
        label.className = 'stock-info-label';
        label.textContent = item.label;
        
        const value = document.createElement('div');
        value.className = 'stock-info-value';
        value.textContent = item.value;
        
        infoItem.appendChild(label);
        infoItem.appendChild(value);
        grid.appendChild(infoItem);
    });
    
    detailDiv.appendChild(header);
    detailDiv.appendChild(grid);
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(detailDiv);
}

// Fetch data from CSE API
async function fetchCSEData(endpoint, data = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const formData = new URLSearchParams(data);
        
        // Try direct fetch first
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
                mode: 'cors'
            });
            
            if (response.ok) {
                return await response.json();
            }
        } catch (directError) {
            console.log('Direct fetch failed, trying CORS proxy...');
        }
        
        // Fallback to CORS proxy
        const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        
        // Try to parse as JSON
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON:', text);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

// Utility functions
function formatNumber(num) {
    if (!num && num !== 0) return '0';
    const number = parseFloat(num);
    if (isNaN(number)) return '0';
    return number.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
}

function formatCurrency(num) {
    if (!num && num !== 0) return 'LKR 0';
    const number = parseFloat(num);
    if (isNaN(number)) return 'LKR 0';
    
    if (number >= 1000000000) {
        return `LKR ${(number / 1000000000).toFixed(2)}B`;
    } else if (number >= 1000000) {
        return `LKR ${(number / 1000000).toFixed(2)}M`;
    } else if (number >= 1000) {
        return `LKR ${(number / 1000).toFixed(2)}K`;
    }
    return `LKR ${number.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('last-update-time').textContent = timeString;
}

function showLoading() {
    document.querySelectorAll('.summary-card').forEach(card => {
        card.classList.add('loading');
    });
}

function showError(message) {
    console.error(message);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
});
