// Function to copy the discount code
function copyDiscountCode(discount_code, current, curr, loaderclass) {
  loaderclass.style.display = "block";
  current.style.display = "none";
  fetch(`/discount/${discount_code}`, {
      method: 'GET',
    })
    .then(response => {
      navigator.clipboard.writeText(discount_code)
        .then(() => {
          loaderclass.style.display = "none";
          current.style.display = "block";
          current.innerHTML = 'Discount Code Copy';
          curr.classList.remove('before-apply');
          curr.classList.add('after-apply');
        })
        .catch(err => {
          console.error('Failed to copy discount code to clipboard:', err);
        });
    })
}

// Event listener for change in switch state
document.getElementById("discountToggle").addEventListener("change", function () {
  const toggleSwitch = document.getElementById("discountToggle");
  if (toggleSwitch.checked) {
    const discountCodeTab = document.querySelector('div.discount-code-snippet .discount-code');
    const current = discountCodeTab.nextElementSibling;
    const curr = discountCodeTab.firstElementChild;
    const discount_code = discountCodeTab.getAttribute('data-id');
    const loaderclass = discountCodeTab.closest('.success-msg-main').querySelector('.codecopy-loader');
    // Call the function to copy discount code only if switch is enabled
    copyDiscountCode(discount_code, current, curr, loaderclass);
  } else {
    // If the switch is disabled, hide the "Discount Code Copy" message
    const discountCodeTab = document.querySelector('div.discount-code-snippet .discount-code');
    const current = discountCodeTab.nextElementSibling;
    current.style.display = "none";
  }
});





// function copyDiscountCode(discount_code, current, curr, loaderclass) {
//   loaderclass.style.display = "block";
//   current.style.display = "none";
//   fetch(`/discount/${discount_code}`, {
//       method: 'GET',
//     })
//     .then(response => {
//       navigator.clipboard.writeText(discount_code)
//         .then(() => {
//           loaderclass.style.display = "none";
//           current.style.display = "block";
//           current.innerHTML = 'Discount Code Copy';
//           curr.classList.remove('before-apply');
//           curr.classList.add('after-apply');
//         })
//         .catch(err => {
//           console.error('Failed to copy discount code to clipboard:', err);
//         });
//     })
// }

// // Event listener for change in switch state
// document.getElementById("discountToggle").addEventListener("change", function () {
//   const toggleSwitch = document.getElementById("discountToggle");
//   if (toggleSwitch.checked) {
//     const discountCodeTab = document.querySelector('div.discount-code-snippet .discount-code');
//     const current = discountCodeTab.nextElementSibling;
//     const curr = discountCodeTab.firstElementChild;
//     const discount_code = discountCodeTab.getAttribute('data-id');
//     const loaderclass = discountCodeTab.closest('.success-msg-main').querySelector('.codecopy-loader');
//     // Call the function to copy discount code only if switch is enabled
//     copyDiscountCode(discount_code, current, curr, loaderclass);
//   } else {
//     // If the switch is disabled, hide the "Discount Code Copy" message
//     const discountCodeTab = document.querySelector('div.discount-code-snippet .discount-code');
//     const current = discountCodeTab.nextElementSibling;
//     current.style.display = "none";
//   }
// });



// Add event listener for the discount toggle
// document.getElementById("discountToggle").addEventListener("change", function() {
//     const discountToggle = document.getElementById("discountToggle");
//     if (discountToggle.checked) {
//         // If discount is applied, get the sale price element
//         const salePriceElement = document.querySelector(".discount-code");
//         const priceAttribute = salePriceElement.getAttribute("data-id-price");
//         const priceParts = priceAttribute.split(" ");
//         const price = priceParts[1];
//         console.log("price", price);
//         updateCartPrice(price);
//     } else {
//         // If discount is not applied, reset the price to its original value
//         const originalPrice = "160.00"; // Assuming original price is constant
//         updateCartPrice(originalPrice);
//     }
// });

// // Function to update cart price
// function updateCartPrice(price) {
//     const cartPriceElement = document.querySelector(".sr-only");
//     if (cartPriceElement) {
//         cartPriceElement.textContent = "Rs. " + price.toFixed(2); // Ensure the price is formatted correctly
//         console.log("Updated Cart Price:", cartPriceElement.textContent);
//     } else {
//         console.error("Cart price element not found.");
//     }
// }



// // Add event listeners to all "Add to Cart" buttons
// const addButtons = document.querySelectorAll(".add-to-cart-button");

// addButtons.forEach(button => {
//     button.addEventListener("click", function(event) {
//         // Fetch product and variant details
//         const product = document.querySelector(".discount-code");
//         const productId = product.getAttribute("data-product-id");
//           console.log("productId",productId);
//         const variantId = product.getAttribute("data-variant-id");
//         const salePriceElement = document.querySelector(".discount-code");
//         const priceAttribute = salePriceElement.getAttribute("data-id-price");
//         const priceParts = priceAttribute.split(" ");
//         const variantPrice = priceParts[1];
//         console.log("variantPrice", variantPrice);

        
//         // Discount
//         const discountOff = 20;

//         // Send a POST request to update the cart
//         fetch('/cart/add.js', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 items: [
//                     {
//                         id: variantId,
//                         discounted_price:variantPrice,
//                         price: variantPrice, 
//                         properties: {
//                             productId: productId,
//                         }
//                     }
//                 ]
//             })
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Failed to update cart. Status:' + response.status);
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log("Cart update successful:", data);
//         })
//         .catch(error => {
//             console.error("Error updating cart:", error);
//         });
//     });
// });









