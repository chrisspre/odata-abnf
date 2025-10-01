#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

/**
 * Generates an HTML documentation page from the OData EDM structure JSON
 */
class HtmlGenerator {
  constructor(jsonFilePath, templatePath) {
    this.jsonFilePath = jsonFilePath;
    this.templatePath = templatePath;
    this.data = null;
  }

  /**
   * Load the JSON data from file
   */
  loadData() {
    const content = fs.readFileSync(this.jsonFilePath, 'utf-8');
    this.data = JSON.parse(content);
  }

  /**
   * Calculate parent relationships by inverting the children relationships
   */
  calculateParents() {
    const parentMap = new Map();
    
    // Initialize all elements with empty parent arrays
    this.data.elements.forEach(element => {
      parentMap.set(element.name, []);
    });

    // For each element, add it as a parent to each of its children
    this.data.elements.forEach(element => {
      if (element.children && element.children.length > 0) {
        element.children.forEach(childName => {
          const parents = parentMap.get(childName) || [];
          parents.push(element.name);
          parentMap.set(childName, parents);
        });
      }
    });

    return parentMap;
  }

  /**
   * Create a valid HTML ID from a name
   */
  makeId(name) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  /**
   * Prepare template data
   */
  prepareTemplateData() {
    const parentMap = this.calculateParents();
    
    // Prepare elements with enhanced data
    const elements = this.data.elements.map(element => {
      const elementId = this.makeId(element.name);
      
      // Prepare children with IDs
      const children = (element.children || []).map(childName => ({
        name: childName,
        id: this.makeId(childName)
      }));
      
      // Prepare parents with IDs
      const parentNames = parentMap.get(element.name) || [];
      const parents = parentNames.map(parentName => ({
        name: parentName,
        id: this.makeId(parentName)
      }));
      
      // Prepare attributes with enhanced type information
      const attributes = (element.attributes || []).map(attr => {
        const attribute = {
          ...attr,
          specUrl: attr.ref ? this.data.metadata.baseUrl + attr.ref : null,
          symbols: attr.symbols || [],
          typeHtml: this.generateTypeHtml(attr)
        };
        return attribute;
      });
      
      return {
        ...element,
        id: elementId,
        children,
        parents,
        attributes
      };
    });
    
    // Prepare attribute categories with enhanced data
    const attributeCategories = Object.entries(this.data.attributeCategories).map(([key, category]) => {
      const subcategories = (category.subcategories || []).map(sub => ({
        ...sub,
        id: this.makeId(sub.name)
      }));
      
      return {
        key,
        ...category,
        id: this.makeId(key),
        subcategories
      };
    });
    
    return {
      metadata: this.data.metadata,
      elements,
      attributeCategories
    };
  }

  /**
   * Generate the type HTML based on attribute category
   */
  generateTypeHtml(attr) {
    if (attr.category === 'basic') {
      const subcategory = attr.subcategory || 'value';
      const subcategoryId = this.makeId(subcategory);
      return `basic: <a href="#subcategory-${subcategoryId}">${subcategory}</a>`;
    } else if (attr.category === 'reference') {
      const subcategory = attr.subcategory || '';
      const typeLabel = subcategory ? `${subcategory} reference` : 'reference';
      if (attr.targets && attr.targets.length > 0) {
        const links = attr.targets.map(target => {
          const targetId = this.makeId(target);
          return `<a href="#element-${targetId}">${target}</a>`;
        });
        
        // Format with Oxford comma and "or"
        let linksText;
        if (links.length === 1) {
          linksText = links[0];
        } else if (links.length === 2) {
          linksText = `${links[0]} or ${links[1]}`;
        } else {
          linksText = links.slice(0, -1).join(', ') + ', or ' + links[links.length - 1];
        }
        
        return `${typeLabel} to: ${linksText}`;
      }
      return typeLabel;
    } else if (attr.category === 'path') {
      const subcategory = attr.subcategory || '';
      const typeLabel = subcategory ? `${subcategory} path` : 'path';
      return `<span class="type-path">${typeLabel}</span>`;
    }
    return attr.category || 'unknown';
  }

  /**
   * Register Handlebars helpers
   */
  registerHelpers() {
    // Helper to compare values
    Handlebars.registerHelper('eq', function(a, b) {
      return a === b;
    });
  }

  /**
   * Generate the complete HTML document
   */
  generate() {
    this.loadData();
    this.registerHelpers();
    
    // Load and compile template
    const templateContent = fs.readFileSync(this.templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    
    // Prepare data
    const templateData = this.prepareTemplateData();
    
    // Generate HTML
    const html = template(templateData);
    
    return html;
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const inputFile = args[0] || path.join(__dirname, 'odata-edm-structure.json');
  const templateFile = path.join(__dirname, 'template.hbs');
  const outputFile = args[1] || path.join(__dirname, 'odata-edm-structure.html');

  console.log('Generating HTML documentation...');
  console.log(`Input: ${inputFile}`);
  console.log(`Template: ${templateFile}`);
  console.log(`Output: ${outputFile}`);

  const generator = new HtmlGenerator(inputFile, templateFile);
  const html = generator.generate();

  fs.writeFileSync(outputFile, html, 'utf-8');
  console.log('Done! HTML documentation generated successfully.');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { HtmlGenerator };
