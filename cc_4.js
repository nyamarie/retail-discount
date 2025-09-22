// products
const products = [
    { id: "SKU-1001", name: "Noise-Canceling Headphones", category: "electronics", price: 199.99, inventory: 12 },
    { id: "SKU-1002", name: "Graphic Tee", category: "apparel", price: 24.99, inventory: 40 },
    { id: "SKU-1003", name: "Organic Apples (3 lb)", category: "groceries", price: 5.99, inventory: 60 },
    { id: "SKU-1004", name: "Laundry Detergent", category: "household", price: 14.49, inventory: 25 },
    { id: "SKU-1005", name: "Notebook", category: "stationery", price: 3.49, inventory: 100 } // default case
  ];

  // caterogory discount
  function getCategoryDiscountRate(category) {
    let rate = 0;
    switch (category) {
      case "electronics":
        rate = 0.20;
        break;
      case "apparel":
        rate = 0.15;
        break;
      case "groceries":
      case "household":
        rate = 0.10;
        break;
      default:
        rate = 0.00;
        break;
    }
    return rate;
  }

  // extra discount
  function getExtraDiscountRate(customerType) {
    if (customerType === "student") return 0.05;
    else if (customerType === "senior") return 0.07;
    else return 0.00; // regular / anything else
  }
  function findProductById(id) {
    return products.find(p => p.id === id);
  }
  function priceForLine(product, qty) {
    const catRate = getCategoryDiscountRate(product.category);
    const discountedUnit = +(product.price * (1 - catRate)).toFixed(2);
    product.discountedPrice = discountedUnit; // derived field for demonstration
  return discountedUnit * qty;
}

// checkout simulation
const customers = [
    {
      number: 1,
      customerType: "regular",
      cart: [
        { id: "SKU-1001", qty: 1 },  // headphones
        { id: "SKU-1005", qty: 3 }   // notebooks
      ]
    },
    {
      number: 2,
      customerType: "student",
      cart: [
        { id: "SKU-1002", qty: 2 },  // graphic tee
        { id: "SKU-1003", qty: 5 }   // apples
      ]
    },
    {
      number: 3,
      customerType: "senior",
      cart: [
        { id: "SKU-1004", qty: 2 },  // detergent
        { id: "SKU-1003", qty: 10 }  // apples
      ]
    }
  ];
  
  console.log("=== BEGIN CHECKOUT SIMULATION ===");
  
  for (let i = 0; i < customers.length; i++) {
    const { number, customerType, cart } = customers[i];
    const extraRate = getExtraDiscountRate(customerType);
  
    let subtotal = 0;
  
    // for...of loop through each cart line; reduce inventory as we go
    for (const line of cart) {
      const product = findProductById(line.id);
      if (!product) {
        console.warn(`Customer ${number}: Product ${line.id} not found; skipping.`);
        continue;
      }
  
      // guard against ordering more than inventory (fulfill as much as possible)
      const fulfillQty = Math.min(line.qty, product.inventory);
      if (fulfillQty === 0) {
        console.warn(`Customer ${number}: ${product.name} is out of stock.`);
        continue;
      }
  
      // compute extended price using category discount
      const lineTotal = priceForLine(product, fulfillQty);
      subtotal += lineTotal;
  
      // reduce inventory
      product.inventory -= fulfillQty;
  
      // if we couldn't fulfill entire request, log it (but continue checkout)
      if (fulfillQty < line.qty) {
        console.warn(
          `Customer ${number}: Only fulfilled ${fulfillQty}/${line.qty} for ${product.name} due to limited inventory.`
        );
      }
    }
  
    // apply extra discount to the total
    const total = +(subtotal * (1 - extraRate)).toFixed(2);
  
    console.log(
      `Customer #${number} (${customerType}) — Subtotal: $${subtotal.toFixed(2)}, Extra Discount: ${(extraRate*100).toFixed(0)}%, Total: $${total.toFixed(2)}`
    );
  }
  
  console.log("=== END CHECKOUT SIMULATION ===\n");

  // we’ll pick one product and show all key/value pairs.
const sampleProduct = products[0]; // first product in array
console.log("— Product detail via for...in (after discounts) —");
for (const key in sampleProduct) {
  // only own properties (skip inherited if any)
  if (Object.prototype.hasOwnProperty.call(sampleProduct, key)) {
    console.log(`${key}: ${sampleProduct[key]}`);
  }
}
console.log(""); 

// object entries
console.log("— All products after inventory updates —");
for (const p of products) {
  // Destructure entries and log pairwise
  for (const [k, v] of Object.entries(p)) {
    console.log(`${p.id} :: ${k} = ${v}`);
  }
  console.log("---");
}

// Nicety: show final snapshot
console.log("Final products snapshot:", JSON.parse(JSON.stringify(products)));