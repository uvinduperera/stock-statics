# 🇱🇰 LK Stock Rates

A modern, real-time stock market tracking website for the Colombo Stock Exchange (CSE) in Sri Lanka. This is a fully static website designed to be hosted on GitHub Pages.

## ✨ Features

- **Real-time Market Data**: Live updates from the Colombo Stock Exchange API
- **Market Overview**: Track ASPI and S&P SL20 indices with current values and changes
- **Top Movers**: View top gainers and losers in real-time
- **Stock Search**: Search for specific stocks by symbol (e.g., JKH, LOLC, COMB)
- **Detailed Stock Information**: Get comprehensive details including price, volume, turnover, and more
- **Dark/Light Theme**: Toggle between dark and light modes with preference saved
- **Auto-refresh**: Data automatically updates every 30 seconds
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## 🚀 Live Demo

Visit the live website: [https://uvinduperera.github.io/stock-statics/](https://uvinduperera.github.io/stock-statics/)

## 📊 Data Source

This website uses the unofficial public API from the Colombo Stock Exchange (CSE):
- Base URL: `https://www.cse.lk/api/`
- Data includes market status, indices, top gainers/losers, and individual stock information

## 🛠️ Technology Stack

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS variables for theming
- **JavaScript (ES6+)**: Vanilla JavaScript for API interactions and DOM manipulation
- **GitHub Pages**: Static hosting platform

## 📱 Supported Stock Symbols

Common stock symbols you can search:
- `JKH` - John Keells Holdings
- `LOLC` - LOLC Holdings
- `COMB` - Commercial Bank
- `DIPD` - Dipped Products
- `DIAL` - Dialog Axiata
- `NDB` - NDB Bank
- `SAMP` - Sampath Bank
- `CTC` - Ceylon Tobacco Company
- `HNB` - Hatton National Bank
- `CINS` - Ceylinco Insurance

And many more! The website automatically appends `.N0000` to symbols if needed.

## 🎨 Features Breakdown

### Market Status
- Live market status indicator (Open/Closed)
- Pulsing animation for real-time feel

### Market Summary
- ASPI Index with change percentage
- S&P SL20 Index with change percentage
- Total turnover in LKR
- Total volume of shares traded

### Top Movers
- Top 5 gainers with percentage change
- Top 5 losers with percentage change
- Color-coded for easy identification

### Stock Search
- Search by stock symbol
- Detailed information display
- Shows: Open, High, Low, Volume, Turnover, Market Cap, etc.

### Theme Support
- Light mode (default)
- Dark mode
- Preference saved in browser localStorage

## 🔧 Local Development

To run this website locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/uvinduperera/stock-statics.git
   ```

2. Navigate to the directory:
   ```bash
   cd stock-statics
   ```

3. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server
   ```

4. Visit `http://localhost:8000` in your browser

## 📝 Note on CORS

The website attempts to fetch data directly from the CSE API. If CORS issues occur, it automatically falls back to a CORS proxy service. For production use, you may want to implement your own backend proxy for more reliable data fetching.

## ⚠️ Disclaimer

This website is for educational and informational purposes only. The data is sourced from unofficial APIs and should be verified before making any investment decisions. The developers are not responsible for any losses incurred from using this information.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👨‍💻 Author

**Uvindu Perera**

- GitHub: [@uvinduperera](https://github.com/uvinduperera)

## 🙏 Acknowledgments

- Data provided by [Colombo Stock Exchange](https://www.cse.lk)
- API documentation inspiration from the community
- Icons and emojis for visual enhancement