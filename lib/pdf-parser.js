const pdfParse = require('pdf-parse');
const fs = require('fs').promises;

/**
 * Parse PDF menu and extract text
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<Object>} Parsed menu data
 */
async function parsePDFMenu(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);
    
    const { text, numpages } = pdfData;
    
    // Extract menu items using patterns
    const menuItems = extractMenuItems(text);
    
    return {
      success: true,
      totalPages: numpages,
      rawText: text,
      items: menuItems,
      fileName: filePath.split('/').pop(),
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Extract menu items from text using pattern matching
 * @param {string} text - Raw PDF text
 * @returns {Array} Array of menu items
 */
function extractMenuItems(text) {
  const items = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  // Pattern: Item Name ... Price (₹123 or Rs.123 or 123)
  const pricePattern = /(?:₹|Rs\.?|INR)?\s*(\d+(?:\.\d{2})?)/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip headers and empty lines
    if (!line || line.length < 3) continue;
    if (/^(menu|appetizers|mains|desserts|beverages|starters)/i.test(line)) continue;
    
    // Look for price pattern in the line
    const priceMatch = line.match(pricePattern);
    
    if (priceMatch) {
      const price = parseFloat(priceMatch[1]);
      
      // Extract item name (text before price)
      let name = line.replace(priceMatch[0], '').trim();
      name = name.replace(/\.{2,}.*$/, '').trim(); // Remove dots
      name = name.replace(/[-–—]+$/, '').trim(); // Remove dashes
      
      if (name && price > 0 && price < 10000) {
        // Look ahead for description
        let description = '';
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (nextLine && !pricePattern.test(nextLine) && nextLine.length > 10) {
            description = nextLine;
          }
        }
        
        items.push({
          name,
          price,
          description,
          category: detectCategory(name, description),
        });
      }
    }
  }
  
  return items;
}

/**
 * Detect menu item category based on name and description
 * @param {string} name - Item name
 * @param {string} description - Item description
 * @returns {string} Category name
 */
function detectCategory(name, description) {
  const text = (name + ' ' + description).toLowerCase();
  
  if (/appetizer|starter|soup|salad/i.test(text)) return 'Appetizers';
  if (/curry|biryani|rice|dal|paneer|chicken|mutton|fish|main/i.test(text)) return 'Main Course';
  if (/dessert|sweet|ice cream|kulfi|gulab/i.test(text)) return 'Desserts';
  if (/drink|beverage|tea|coffee|juice|soda|lassi/i.test(text)) return 'Beverages';
  if (/bread|naan|roti|paratha/i.test(text)) return 'Breads';
  
  return 'Other';
}

/**
 * Clean and validate extracted menu items
 * @param {Array} items - Raw extracted items
 * @returns {Array} Cleaned and validated items
 */
function cleanMenuItems(items) {
  return items
    .filter(item => item.name && item.price > 0)
    .map(item => ({
      name: item.name.trim(),
      price: parseFloat(item.price.toFixed(2)),
      description: item.description ? item.description.trim() : '',
      category: item.category || 'Other',
    }));
}

module.exports = {
  parsePDFMenu,
  extractMenuItems,
  cleanMenuItems,
};
