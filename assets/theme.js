/**
 * Theme js
 *
 * @package Dev
 */

'use strict';

// Slide up.
function btySlideUp( target, duration = 200 ) {
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.height             = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow      = 'hidden';
	target.style.height        = 0;
	target.style.paddingTop    = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop     = 0;
	target.style.marginBottom  = 0;

	window.setTimeout(
		function() {
			target.style.display = 'none';
			target.style.removeProperty( 'height' );
			target.style.removeProperty( 'padding-top' );
			target.style.removeProperty( 'padding-bottom' );
			target.style.removeProperty( 'margin-top' );
			target.style.removeProperty( 'margin-bottom' );
			target.style.removeProperty( 'overflow' );
			target.style.removeProperty( 'transition-duration' );
			target.style.removeProperty( 'transition-property' );
		},
		duration
	);
}

// Slide down.
function btySlideDown( target, duration = 200 ) {
	target.style.removeProperty( 'display' );
	let display = window.getComputedStyle( target ).display;

	if ( 'none' === display ) {
		display = 'block';
	}

	target.style.display = display;

	let height = target.offsetHeight;

	target.style.overflow      = 'hidden';
	target.style.height        = 0;
	target.style.paddingTop    = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop     = 0;
	target.style.marginBottom  = 0;
	target.offsetHeight;
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height             = height + 'px';

	target.style.removeProperty( 'padding-top' );
	target.style.removeProperty( 'padding-bottom' );
	target.style.removeProperty( 'margin-top' );
	target.style.removeProperty( 'margin-bottom' );

	window.setTimeout(
		function() {
			target.style.removeProperty( 'height' );
			target.style.removeProperty( 'overflow' );
			target.style.removeProperty( 'transition-duration' );
			target.style.removeProperty( 'transition-property' );
		},
		duration
	);
}

// Toggle dropdown.
function btyToggleDropdown( doc = document ) {
	let toggle = doc.querySelectorAll( '.toggle-dropdown .dropdown-summary' );
	if ( ! toggle.length ) {
		return;
	}

	toggle.forEach(
		function( el ) {
			let parent      = el.parentNode,
				title       = el.querySelector( '.summary-info' ),
				mobileTitle = el.parentNode.querySelector( '.dropdown-content-title' );

			document.addEventListener(
				'click',
				function( e ) {
					let target = e.target;

					if ( target === el || target.closest( '.dropdown-summary' ) ) {
						return;
					}

					if ( target.classList.contains( 'dropdown-item' ) ) {
						if ( title ) {
							title.innerText = target.getAttribute( 'data-value' );
						}

						if ( mobileTitle ) {
							mobileTitle.innerText = target.getAttribute( 'data-value' );
						}
					}

					parent.removeAttribute( 'open' );
				}
			);

			el.onclick = function( e ) {
				if ( 'string' === typeof( parent.getAttribute( 'open' ) ) ) {
					parent.removeAttribute( 'open' );
				} else {
					let sibling = parent.parentNode.querySelector( '.toggle-dropdown[open]' );
					if ( sibling ) {
						sibling.removeAttribute( 'open' );
					}

					parent.setAttribute( 'open', '' );
				}
			}
		}
	);
}

// Json parse.
function btyJsonParse( string ) {
	try {
		return JSON.parse( string );
	} catch ( e ) {
		return false;
	}
}

// Remove item in array.
function btyRemoveArrayItem( arr = [], item ) {
	if ( ! arr.length || ! item ) {
		return [];
	}

	return arr.filter(
		function( el ) {
			return el != item;
		}
	);
}

// Set delay time when user typing.
const btySearchDelay = function( timer = 0 ) {
	return function( callback, ms ) {
		clearTimeout( timer );
		timer = setTimeout( callback, ms );
	};
}();

// Get image src.
function btyGetImageSrc( img ) {
	// Create canvas.
	let canvas  = document.createElement( 'canvas' ),
		context = canvas.getContext( '2d' );

	// Set width and height.
	canvas.width  = img.width;
	canvas.height = img.height;

	// Draw the image.
	context.drawImage( img, 0, 0 );

	return canvas.toDataURL( 'image/jpeg', 1.0 );
}

// Scrolling detect direction.
function btyScrollingDetect() {
	let body = document.body;

	if ( window.oldScroll > window.scrollY ) {
		body.classList.add( 'direction-up' );
		body.classList.remove( 'direction-down' );
	} else {
		body.classList.remove( 'direction-up' );
		body.classList.add( 'direction-down' );
	}

	// Reset state.
	window.oldScroll = window.scrollY;
}

// Set loading animation for image.
function btyImageLoad( image, image_src, image_key, ele_loading ) {
	let newImage = new Image();

	newImage.crossOrigin = 'anonymous';

	// Check local storage first.
	if ( sessionStorage.getItem( image_key ) ) {
		image.src = sessionStorage.getItem( image_key );
		return;
	}

	// Add loading animation.
	image.parentNode.classList.add( 'loading' );

	// Handle.
	newImage.onload = function() {
		ele_loading.classList.remove( 'loading' );
		let renderImage = btyGetImageSrc( newImage );

		// Set final image src.
		image.src = renderImage;

		// Save image to local storage.
		if ( image_key ) {
			sessionStorage.setItem( image_key, renderImage );
		}
	}

	newImage.onerror = function() {
		ele_loading.classList.remove( 'loading' );
	}

	// Set image src for 'newImage.onload' function handle.
	newImage.src = image_src;
}

// Get form data.
function btySerializeForm( form, type = 'string' ) {
	let obj      = {},
		formData = new FormData( form );

	for ( let key of formData.keys() ) {
		obj[ key ] = formData.get( key );
	}

	return 'string' === type ? JSON.stringify( obj ) : obj;
};

// Get fetch config.
function btyFetchConfig( type = 'json' ) {
	return {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/' + type
		}
	};
}

// Get price format.
function btyFormatPrice( money = 0, format = false ) {
	if ( 'string' === typeof( money ) ) {
		money = money.replace( '.', '' );
	}

	if ( false === format ) {
		format = btyGlobals.money_format;
	}

	let value            = '',
		placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;

	function defaultOption( opt, def ) {
		return 'undefined' === typeof( opt ) ? def : opt;
	}

	function formatWithDelimiters( number, precision, thousands, decimal ) {
		precision = defaultOption( precision, 2 );
		thousands = defaultOption( thousands, ',' );
		decimal   = defaultOption( decimal, '.' );

		if ( isNaN( number ) || number == null ) {
			return 0;
		}

		number = ( number / 100.0 ).toFixed( precision );

		let parts   = number.split( '.' ),
			dollars = parts[0].replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands ),
			money   = parts[1] ? ( decimal + parts[1] ) : '';

		return dollars + money;
	}

	switch ( format.match( placeholderRegex )[1] ) {
		case 'amount':
			value = formatWithDelimiters( money, 2 );
			break;
		case 'amount_no_decimals':
			value = formatWithDelimiters( money, 0 );
			break;
		case 'amount_with_comma_separator':
			value = formatWithDelimiters( money, 2, '.', ',' );
			break;
		case 'amount_no_decimals_with_comma_separator':
			value = formatWithDelimiters( money, 0, '.', ',' );
			break;
		case 'amount_with_space_separator':
			value = formatWithDelimiters( money, 2, ' ', ',' );
			break;
		case 'amount_with_period_and_space_separator':
			value = formatWithDelimiters( money, 2, ' ', '.' );
			break;
		case 'amount_no_decimals_with_space_separator':
			value = formatWithDelimiters( money, 0, '.', '' );
			break;
		case 'amount_with_apostrophe_separator':
			value = formatWithDelimiters( money, 2, "'", '.' );
			break;
	}

	return format.replace( placeholderRegex, value );
}

// Render price html.
function btyPriceHtml( price, compare_price = false, unit_price = false, unit_price_measurement = {} ) {
	let html         = '',
		regularPrice = btyStrings.product.regular_price;

	if ( compare_price ) {
		html += '<s class="regular-price">';
		html += '<span class="sr-only">' + regularPrice + ': </span>';
		html += btyFormatPrice( compare_price );
		html += '</s>';

		html += '<span class="price">';
		html += '<span class="sr-only">' + btyStrings.product.sale_price + ': </span>';
		html += btyFormatPrice( price );
		html += '</span>';
	} else {
		html += '<span class="regular-price">';
		html += '<span class="sr-only">' + regularPrice + ': </span>';
		html += btyFormatPrice( price );
		html += '</span>';
	}

	if ( unit_price ) {
		html += '<span class="unit-price">';
		html += btyFormatPrice( unit_price ) + '/' + unit_price_measurement.quantity_unit;
		html += '</span>';
	}

	return html;
}

// Parse html dom.
function btyGetSectionHtml( text = '', selector = '.shopify-section', html = 'inner' ) {
	let el = new DOMParser().parseFromString( text, 'text/html' ).querySelector( selector );

	return el ? ( 'inner' === html ? el.innerHTML : el.outerHTML ) : '';
}

/**
 * Update html dom.
 *
 * @param  array sections The response sections.
 * @param  array modules  The modules need update html dom.
 */
function btyUpdateHtml( sections, modules ) {
	modules.forEach(
		function( mod ) {
			let query = document.querySelectorAll( mod.node );
			if ( ! query.length ) {
				return;
			}

			query.forEach(
				function( el ) {
					el.innerHTML = btyGetSectionHtml( sections[ mod.section ], mod.selector );
				}
			);
		}
	);
}

// Countdown time.
function btyCountdownTime( doc = document ) {
	let selectors = doc.querySelectorAll( '.countdown-time' );

	if ( ! selectors.length ) {
		return;
	}

	selectors.forEach(
		function( el ) {
			let time        = el.getAttribute( 'data-time' ),
				dayField    = el.querySelector( '.days' ),
				hourField   = el.querySelector( '.hours' ),
				minuteField = el.querySelector( '.minutes' ),
				secondField = el.querySelector( '.seconds' );

			if ( ! dayField || ! hourField || ! minuteField || ! secondField ) {
				return;
			}

			// Check time first.
			if ( isNaN( Date.parse( time ) ) ) {
				return;
			}

			// Convert to milisecond.
			let 
				second = 1000,
				minute = second * 60,
				hour   = minute * 60,
				day    = hour * 24;

			const countDownFn = function() {
				let countDown = new Date( time ).getTime(),
					now       = new Date().getTime(),
					distance  = countDown - now,
					dayInner  = Math.floor( distance / day );

				if ( distance < 0 ) {
					el.parentNode.remove();

					clearInterval( init );

					return;
				}

				if ( 0 == dayInner && dayField ) {
					dayField.parentNode.remove();
				} else {
					dayField.innerText = ( '0' + dayInner ).slice( -2 );
				}

				hourField.innerText   = ( '0' + Math.floor( ( distance % day ) / hour ) ).slice( -2 );
				minuteField.innerText = ( '0' + Math.floor( ( distance % hour ) / minute ) ).slice( -2 );
				secondField.innerText = ( '0' + Math.floor( ( distance % minute ) / second ) ).slice( -2 );

				// Show countdown.
				el.parentNode.classList.remove( 'hidden' );
			}

			let init = setInterval( countDownFn, 1000 );
		}
	);
}

/**
 * Close theme popup
 *
 * @param  string class_name  Class name remove form <html>
 * @return node   parent_node Parent node to implement click overlay.
 */
function btyClosePopup( class_name, parent_node ) {
	if ( ! class_name ) {
		return;
	}

	let doc    = document.documentElement,
		button = parent_node ? parent_node.querySelector( '.close-button' ) : false;

	// Click to popup overlay.
	if ( parent_node ) {
		parent_node.addEventListener(
			'click',
			function( e ) {
				if ( e.target != parent_node ) {
					return;
				}

				doc.classList.remove( class_name );
			}
		);
	}

	// Use ESC key.
	doc.addEventListener(
		'keyup',
		function( e ) {
			if ( 27 !== e.keyCode ) {
				return;
			}

			doc.classList.remove( class_name );
		}
	);

	// Use close button.
	if ( button ) {
		button.onclick = function() {
			doc.classList.remove( class_name );
		}
	}
}

// Dialog search form.
function btyDialogSearch() {
	let actions = document.querySelectorAll( '.action-search' );
	if ( ! actions.length ) {
		return;
	}

	let dialog = document.querySelector( '.dialog-search' ),
		input  = dialog ? dialog.querySelector( '.search-input' ) : false,
		button = dialog ? dialog.querySelector( '.search-button' ) : false,
		result = dialog ? dialog.querySelector( '.sarch-results' ) : false;

	if ( ! input || ! button || ! result ) {
		return;
	}

	// Toggle dialog search.
	actions.forEach(
		function( el ) {
			el.onclick = function( e ) {
				e.preventDefault();

				// Focus input field.
				input.focus();

				// Reset search result first.
				if ( ! input.value.trim() ) {
					result.innerHTML = '';
				}

				document.documentElement.classList.add( 'dialog-search-open' );

				btyClosePopup( 'dialog-search-open', dialog );
			}
		}
	);

	// Type to search.
	input.oninput = function() {
		btySearchDelay(
			function() {
				let value = input.value.trim();
				if ( ! value ) {
					result.innerHTML = '';
					return;
				}

				dialog.classList.add( 'searching' );

				let url = btyGlobals.search_url + '?section_id=search&type=' + btyGlobals.search_type + '&options[prefix]=last&options[unavailable_products]=' + btyGlobals.search_unavailable + '&limit=6&q=' + value;
				fetch( url )
					.then(
						function( r ) {
							if ( 200 !== r.status ) {
								console.log( 'Status Code: ' + r.status );
								throw r;
							}

							return r.text();
						}
					).then(
						function( res ) {
							result.innerHTML = btyGetSectionHtml( res, '.fetch-search' );
						}
					).catch(
						function( e ) {
							console.error( e );
						}
					).finally(
						function() {
							dialog.classList.remove( 'searching' );
						}
					);
			},
			300
		);
	}
}

// search form header.
function btyDialogSearchHeader() {
	let dialog = document.querySelector( '.dialog-search-header' ),
		input  = dialog ? dialog.querySelector( '.search-input' ) : false,
		button = dialog ? dialog.querySelector( '.search-button' ) : false,
		result = dialog ? dialog.querySelector( '.sarch-results' ) : false;

	if ( ! input || ! button || ! result ) {
		return;
	}

	// Type to search.
	input.oninput = function() {
		btySearchDelay(
			function() {
				let value = input.value.trim();
				if ( ! value ) {
					result.innerHTML = '';
					return;
				}

				dialog.classList.add( 'searching' );

				let url = btyGlobals.search_url + '?section_id=search&type=' + btyGlobals.search_type + '&options[prefix]=last&options[unavailable_products]=' + btyGlobals.search_unavailable + '&limit=6&q=' + value;
				fetch( url )
					.then(
						function( r ) {
							if ( 200 !== r.status ) {
								console.log( 'Status Code: ' + r.status );
								throw r;
							}

							return r.text();
						}
					).then(
						function( res ) {
							result.innerHTML = btyGetSectionHtml( res, '.fetch-search' );
						}
					).catch(
						function( e ) {
							console.error( e );
						}
					).finally(
						function() {
							dialog.classList.remove( 'searching' );
						}
					);
			},
			300
		);
	}
}


// Quantity button.
function btyQuantityButton( doc = document ) {
	let buttons = doc.querySelectorAll( '.quantity-button' );
	if ( ! buttons.length ) {
		return;
	}

	buttons.forEach(
		function( el ) {
			let eventChange = new Event( 'change', { bubbles: true } );

			el.onclick = function() {
				let input = el.parentNode.querySelector( '.quantity-input' );
				if ( ! input ) {
					return;
				}

				let current = Number( input.value || 0 ),
					step    = Number( input.getAttribute( 'step' ) || 1 ),
					min     = Number( input.getAttribute( 'min' ) || 0 ),
					max     = Number( input.getAttribute( 'max' ) ),
					name    = el.name;

				if ( 'minus' === name && current >= step ) { // Minus button.
					if ( current <= min || ( current - step ) < min ) {
						return;
					}

					input.value = current - step;
				} else if ( 'plus' === name ) { // Plus button.
					if ( max && ( current >= max || ( current + step ) > max ) ) {
						return;
					}

					input.value = current + step;
				}

				// Trigger event.
				input.dispatchEvent( eventChange );
			}
		}
	);
}

// Main menu.
function btyNavMenu( doc = document ) {
	let toggle = doc.querySelector( '.toggle-panel' ),
		panel  = doc.querySelector( '.site-panel' );

	if ( ! toggle || ! panel ) {
		return;
	}

	// Toggle site panel.
	toggle.onclick = function() {
		document.documentElement.classList.add( 'site-panel-open' );

		btyClosePopup( 'site-panel-open', panel );
	}

	// Toggle sub menu.
	let links = doc.querySelectorAll( '.site-panel .has-children' );
	if ( ! links.length ) {
		return;
	}

	links.forEach(
		function( el ) {
			el.onclick = function( e ) {
				if ( e.target.classList.contains( 'menu-text' ) ) {
					return;
				}

				e.preventDefault();

				let menu    = el.closest( '.toggle-navigation' ),
					parent  = el.parentNode,
					subMenu = parent.querySelector( '.sub-menu' ) || parent.querySelector( '.sub-mega-menu' );
				if ( ! subMenu ) {
					return;
				}

				parent.classList.add( 'active' );

				// Update current sub menu.
				let level = Number( subMenu.getAttribute( 'data-level' ) || 1 ),
					back  = parent.querySelector( '.back' );
				if ( level ) {
					menu.setAttribute( 'data-level', level );
				}

				// Go back parent level.
				if ( back ) {
					back.onclick = function() {
						parent.classList.remove( 'active' );
						menu.setAttribute( 'data-level', level - 1 );
					}
				}
			}
		}
	);
}

// Popup newletter and popup Cookies.
function btyCookiespopup( doc = document ) {
	let cookieAlert   = doc.querySelector( '.popup-cookies' ),
		acceptCookies = doc.querySelector( '.acceptcookies' ),
		overlay       = doc.querySelector( '.popup-newletter-overlay' ),
		checkbox      = doc.querySelector( '.js-check-input-popup-newletter' ),
		popup         = doc.querySelector( '.popup-newletter' );

	if ( ! cookieAlert || ! acceptCookies || ! overlay || ! checkbox || ! popup ) {
		return;
	}

	overlay.onclick = function( e ) {
		if ( overlay === e.target ) {
			document.documentElement.classList.remove( 'popup-newletter-open' );
		}
	}

	if ( ! getCookie( 'popupNewletterCookies' ) ) {
		setTimeout(
			function() {
				document.documentElement.classList.add( 'popup-newletter-open' );
				btyClosePopup( 'popup-newletter-open', popup );
			},
			1000
		);
	}

	if ( ! getCookie( 'acceptCookies' ) ) {
		cookieAlert.classList.add( 'show' );
	}

	cookieAlert.offsetHeight;

	checkbox.onchange = function() {
		if ( checkbox.checked ) {
			setCookie( 'popupNewletterCookies', true, 30 );
			window.dispatchEvent( new Event( 'cookieAlertAccept' ) )
		}
	}

	acceptCookies.addEventListener(
		'click',
		function () {
			setCookie( 'acceptCookies', true, 30 );
			cookieAlert.classList.remove( 'show' );
			window.dispatchEvent( new Event( 'cookieAlertAccept' ) )
		}
	);

	function setCookie( cname, cvalue, exdays ) {
		let d = new Date();
		d.setTime( d.getTime() + ( exdays * 24 * 60 * 60 * 1000) );
		let expires = "expires=" + d.toUTCString();
		doc.cookie  = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	function getCookie( cname ) {
		let name          = cname + "=",
			decodedCookie = decodeURIComponent( doc.cookie ),
			ca	          = decodedCookie.split( ';' ),
			lengthca	  = ca.length;
		for ( var i = 0; i < lengthca; i++ ) {
			var c = ca[i];
			while ( c.charAt( 0 ) === ' ' ) {
				c = c.substring( 1 );
			}
			if ( c.indexOf( name ) === 0 ) {
				return c.substring( name.length, c.length );
			}
		}
		return "";
	}
}

// Popup visit website
function btyPopupVisit( doc = document ) {
	let overlay       = doc.querySelector( '.popup-countdown-visit-website-overlay' ),
		popup         = doc.querySelector( '.popup-countdown-visit-website' );

	if ( ! overlay || ! popup ) {
		return;
	}

	setTimeout(
		function() {
			document.documentElement.classList.add( 'popup-countdown-visit-website-open' );
			btyClosePopup( 'popup-countdown-visit-website-open', popup );
		},
		1000
	);

	overlay.onclick = function( e ) {
		if ( overlay === e.target ) {
			document.documentElement.classList.remove( 'popup-countdown-visit-website-open' );
		}
	}

}

// Slider.
const btySliderInstances = {};
function btySlider( doc = document, event = {} ) {
	let selectors = doc.querySelectorAll( '.theme-slider .swiper' );
	if ( ! selectors.length || 'undefined' === typeof( Swiper ) ) {
		return;
	}

	selectors.forEach(
		function( el ) {
			let section      = el.closest( '.slider-section' ),
				sectionId    = section ? section.id.replace( 'shopify-section-', '' ) : false,
				data         = section ? section.querySelector( '[data-slider]' ) : false,
				initialSlide = 0;

			if ( false === data ) {
				return;
			}

			// For design mode.
			if ( Shopify.designMode && sectionId ) {
				let current = Object.keys( event ).length ? el.querySelector( '.swiper-slide[data-' + event.detail.blockId + ']' ) : false;
				if ( current ) {
					initialSlide = current.getAttribute( 'data-index' );
				}

				if ( 'undefined' !== typeof( btySliderInstances[sectionId] ) ) {
					btySliderInstances[sectionId].slideTo( initialSlide, 500 );
				}
			}

			if ( el.classList.contains( 'swiper-initialized' ) ) {
				return;
			}

			let options = btyJsonParse( data.content.textContent );

			// Active slide index.
			options.initialSlide = initialSlide;

			// Fire on init.
			options.on.init = function( swp ) {
				let currentSlide = swp.wrapperEl.querySelector( '.swiper-slide.swiper-slide-active' );

				if ( currentSlide ) {
					currentSlide.classList.add( 'swiper-slide-ready' );
				}
			}

			if ( Shopify.designMode && sectionId ) {
				// For design mode.
				btySliderInstances[sectionId] = new Swiper( el, options );
			} else {
				// For frontend mode.
				const slider = new Swiper( el, options );

				slider.on(
					'slideChangeTransitionEnd',
					function( swp ) {
						let swiperSlide  = swp.wrapperEl.querySelectorAll( '.swiper-slide' ),
							currentSlide = swp.wrapperEl.querySelector( '.swiper-slide.swiper-slide-active' );

						if ( swiperSlide.length ) {
							swiperSlide.forEach(
								function( el ) {
									el.classList.remove( 'swiper-slide-ready' );
								}
							);
						}

						if ( currentSlide ) {
							currentSlide.classList.add( 'swiper-slide-ready' );

							btyAnimationImageLoad( currentSlide );
						}
					}
				);
			}

			// Remove template slider options.
			data.remove();
		}
	);
}

// Carousel.
function btyCarousel( doc = document, event = {} ) {
	let selectors = doc.querySelectorAll( '.carousel-swiper .swiper' );
	if ( ! selectors.length || 'undefined' === typeof( Swiper ) ) {
		return;
	}

	selectors.forEach(
		function( el ) {
			let data = el.parentNode.querySelector( '[data-options]' );
			if ( ! data || el.classList.contains( 'swiper-initialized' ) ) {
				return;
			}

			let options = btyJsonParse( data.content.textContent );

			// Init.
			const slider = new Swiper( el, options );

			// Remove template slider options.
			data.remove();
		}
	);
}

// Account popup.
function btyAccountPopup( doc = document ) {
	let selectors = doc.querySelectorAll( '.action-account' ),
		customer  = document.querySelector( '.customer-wraper' );
	if ( ! selectors.length || ! customer || document.body.classList.contains( 'has-account-details' ) ) {
		return;
	}

	// Get display style.
	const getStyles = function( el, property = 'display' ) {
		let obj = window.getComputedStyle( el, null );

		return obj.getPropertyValue( property );
	}

	// Get first input field.
	const getInput  = function( parent ) {
		return parent.querySelector( '.field input' );
	}

	// Toggle popup.
	selectors.forEach(
		function( el ) {
			el.onclick = function( e ) {
				e.preventDefault();

				let login    = customer.querySelector( '.login' ),
					loginBox = login ? login.querySelector( '#login-container' ) : false,
					recover  = login ? login.querySelector( '#recover-container' ) : false,
					register = customer.querySelector( '.register' );

				if ( ! recover || ! loginBox || ! register ) {
					return;
				}

				// Focus input field on desktop.
				if ( window.matchMedia( '(min-width: 992px)' ).matches) {
					if ( getStyles( register ) === 'block' ) {
						getInput( register ).focus();
					} else if ( getStyles( recover ) === 'block' ) {
						getInput( recover ).focus();
					} else if ( getStyles( loginBox ) === 'block' ) {
						getInput( loginBox ).focus();
					}
				}

				// Add loading animation.
				document.documentElement.classList.add( 'customer-open' );

				// Close popup.
				btyClosePopup( 'customer-open', customer );

				customer.onclick = function( e ) {
					let target = e.target;

					// Create account.
					if ( target.classList.contains( 'create-account' ) ) {
						e.preventDefault();

						login.classList.add( 'hidden' );
						register.classList.remove( 'hidden' );

						getInput( register ).focus();
					}

					// Sign-in.
					if ( target.classList.contains( 'sign-in' ) ) {
						e.preventDefault();

						login.classList.remove( 'hidden' );
						register.classList.add( 'hidden' );

						getInput( loginBox ).focus();
					}

					// Fogot password.
					if ( target.classList.contains( 'forgot-password' ) ) {
						setTimeout(
							function() {
								getInput( recover ).focus();
							}
						);
					}

					// Cancel login.
					if ( target.classList.contains( 'login-cancel' ) ) {
						setTimeout(
							function() {
								getInput( loginBox ).focus();
							}
						);
					}
				}
			}
		}
	);
}

// Display submenu when tabbed.
function btyTabNav() {
	document.addEventListener(
		'keyup',
		function( e ) {
			if ( 9 === e.which ) {
				let nav = document.activeElement;
				if ( ! nav.closest( '.header-navigation' ) ) {
					return;
				}

				let item = nav.closest( '.header-navigation > li' );
				if ( item ) {
					let oldTabbed = document.querySelectorAll( '.tabbed' );
					if ( oldTabbed.length ) {
						oldTabbed.forEach(
							function( el ) {
								if ( el !== item ) {
									el.classList.remove( 'tabbed' );
								}
							}
						);
					}

					item.classList.add( 'tabbed' );
				} else {
					let tabbed = document.querySelector( '.tabbed' );
					if ( tabbed ) {
						tabbed.classList.remove( 'tabbed' );
					}
				}
			}
		}
	);

	document.addEventListener(
		'mousemove',
		function( e ) {
			let tabbed = document.querySelector( '.tabbed' );
			if ( ! tabbed ) {
				return;
			}

			if ( e.target.closest( '.tabbed' ) ) {
				return;
			}

			tabbed.classList.remove( 'tabbed' );
		}
	);
}

// Find if two arrays contain any common item in Javascript.
function btyDiffObject( haystack, arr ) {
	return arr.every(
		function( v ) {
			return haystack.includes( v );
		}
	);
};

// Update cart item count.
function btyCartItemCount( items = 1 ) {
	let count = document.querySelectorAll( '.cart-item-count' );
	if ( ! count.length ) {
		return;
	}

	items = Number( items );

	count.forEach(
		function( el ) {
			el.innerHTML = items;

			if ( items < 1 ) {
				el.classList.add( 'hidden' );
			} else {
				el.classList.remove( 'hidden' );
			}
		}
	);
}

// Selected variant image.
function btySelectedVariant( variant, data, slider ) {
	for ( let opt in data ) {
		if ( btyDiffObject( Object.values( variant ), data[opt].options ) ) {
			if ( 'object' === typeof( slider ) && Object.keys( slider ).length ) {
				slider.slideTo( ( data[opt].featured_media.position - 1 ), 500, false );
			}

			return data[opt];
		}
	}
}

// Fetch cart data.
function btyFetchCart( obj, modules, item ) {
	let body = JSON.stringify( obj );
	fetch( btyGlobals.cart_change_url, {...btyFetchConfig(), ...{ body } } )
		.then(
			function( r ) {
				if ( 200 !== r.status ) {
					console.log( 'Status Code: ' + r.status );
					throw r;
				}

				return r.json();
			}
		).then(
			function( res ) {
				// Update cart item count first.
				btyCartItemCount( res.item_count );

				// Cart empty.
				if ( ! res.items.length ) {
					let cartTable       = document.querySelector( '.cart-page-section .container' ),
						cartSubtotal    = cartTable ? cartTable.querySelector( '.cart-footer' ) : false,
						sideCartContent = document.querySelector( '.side-cart-content' ),
						sideCartFooter  = document.querySelector( '.side-cart-footer' );

					// Update cart table section.
					if ( cartTable ) {
						cartTable.innerHTML = btyGetSectionHtml( res.sections['main-cart'], '.container' );
					}

					// Remove cart subtotal section.
					if ( cartSubtotal ) {
						cartSubtotal.remove();
					}

					// Update side cart content.
					if ( sideCartContent ) {
						sideCartContent.innerHTML = btyGetSectionHtml( res.sections['side-cart'], '.side-cart-content' );
					}

					// Remove side cart footer.
					if ( sideCartFooter ) {
						sideCartFooter.remove();
					}
				}

				// Update current item.
				let currentItem = res.items.filter( (e) => e.id === Number( obj.id ) );
				if ( currentItem.length ) {
					let sidecartContent = item.closest( '.side-cart-content' ),
						totalPrice      = item.querySelector( '.totals-item-price' );
					if ( totalPrice ) {
						totalPrice.innerHTML = btyGetSectionHtml( res.sections['main-cart'], '[data-id="' + obj.id + '"] .totals-item-price' );
					}

					if ( sidecartContent ) {
						item.innerHTML = btyGetSectionHtml( res.sections['side-cart'], '[data-id="' + obj.id + '"]' );
					}
				} else {
					item.remove();
				}

				// Update html.
				btyUpdateHtml( res.sections, modules );

				// Re-init quantity button.
				btyQuantityButton();

				// Re-init update product quantity.
				btyUpdateProductQuantity();
			}
		).catch(
			function( e ) {
				console.error( e );
			}
		).finally(
			function() {
				// Remove loading.
				item.classList.remove( 'updating' );
			}
		);
}

// Update product quantity.
function btyUpdateProductQuantity( doc = document ) {
	let item = doc.querySelectorAll( '.product-item[data-id]' );
	if ( ! item.length ) {
		return;
	}

	// Register dom html need an update when the response available.
	let modules = [
		{
			node: '.cart-totals',
			section: 'main-cart',
			selector: '.cart-totals'
	},
		{
			node: '.header-icons .mini-cart', // Original selector html.
			section: 'mini-cart', // Name of section, eg: mini-cart.liquid.
			selector: '.mini-cart' // Response selector html.
	}
	];

	item.forEach(
		function( el ) {
			let id = el.getAttribute( 'data-id' );

			if ( ! id ) {
				return;
			}

			let removes = el.querySelectorAll( '.product-remove' ),
				inputs  = el.querySelectorAll( '.quantity-input' );

			// Quantity change.
			if ( inputs.length ) {
				inputs.forEach(
					function( input ) {
						input.onchange = function() {
							let data, quantity = Number( input.value.trim() );

							// Loading effect.
							el.classList.add( 'updating' );

							data = {
								id: id,
								quantity: quantity,
								sections: modules.map( (s) => s.section ),
								sections_url: window.location.pathname
							}

							// Fetch data.
							btyFetchCart( data, modules, el );
						}
					}
				);
			}

			// Remove button click.
			if ( removes.length ) {
				removes.forEach(
					function( remove ) {
						remove.onclick = function( e ) {
							e.preventDefault();

							// Loading effect.
							el.classList.add( 'updating' );

							let data = {
								id: id,
								quantity: 0,
								sections: modules.map( (s) => s.section ),
								sections_url: window.location.pathname
							}

							// Fetch data.
							btyFetchCart( data, modules, el );
						}
					}
				);
			}
		}
	);
}

// Collection slide.
function btyCollectionSlide( doc = document ) {
	let slide = doc.querySelectorAll( '.collection-slide-section .swiper' );
	if ( ! slide.length || 'undefined' === typeof( Swiper ) ) {
		return;
	}

	slide.forEach(
		function( el ) {
			if ( el.classList.contains( 'swiper-initialized' ) ) {
				return;
			}

			let options = {
				slidesPerView: 2,
				spaceBetween: 10,
				loop: true,
				autoHeight: true,
				navigation: {
					nextEl: el.parentNode.querySelector( '.swiper-button-next' ),
					prevEl: el.parentNode.querySelector( '.swiper-button-prev' )
				},
				breakpoints: {
					768: {
						slidesPerView: 3
					},
					992: {
						slidesPerView: el.getAttribute( 'data-col' ) || 3
					}
				}
			}

			const swiper = new Swiper( el, options );
		}
	);
}

// Variant options.
function btyQuickViewVariants( doc = document, slider = {} ) {
	let selector = doc.querySelector( '.product-variants' );
	if ( ! selector ) {
		return;
	}

	let variants = selector.querySelector( '[data-product-variants]' ),
		quantity = selector.querySelector( '[data-inventory-quantity]' ),
		field    = selector.querySelectorAll( '.field-value' );
	if ( ! field.length || ! variants ) {
		return;
	}

	let summary      = selector.parentNode,
		variant_pick = {};

	variants = JSON.parse( variants.textContent );
	quantity = JSON.parse( quantity.textContent );

	field.forEach(
		function( el ) {
			if ( 'radio' === el.type ) {
				if ( el.checked ) {
					variant_pick[ el.name ] = el.value;
				}
			} else {
				variant_pick[ el.name ] = el.value;
			}

			el.onchange = function() {
				variant_pick[ el.name ] = el.value;

				// When variant change.
				let selected    = btySelectedVariant( variant_pick, variants, slider ),
					price       = summary.querySelector( '.product-price' ),
					labeled     = el.parentNode.querySelector( '.selected-value' ),
					form        = summary.querySelector( '[data-type="add-to-cart-form"]' ),
					input       = form ? form.querySelector( '.quantity-input' ) : false,
					productId   = form ? form.querySelector( '[name="id"]' ) : false,
					productLink = summary.querySelector( '.product-url' ),
					productUrl  = selector ? selector.getAttribute( 'data-url' ) : false,
					button      = form ? form.querySelector( '[name="add"]' ) : false,
					amount      = summary.querySelector( '.product-sale-label .sale-total' ),
					shareInput  = summary.querySelector( '.product-share .field-input' );

				// Update product url.
				if ( productUrl ) {
					if ( productLink ) {
						productLink.href = productUrl + '?variant=' + selected.id;
					}

					if ( shareInput ) {
						shareInput.value = window.location.origin + productUrl + '?variant=' + selected.id;
					}
				}

				// Update price.
				if ( price ) {
					price.innerHTML = btyPriceHtml( selected.price, selected.compare_at_price, selected.unit_price, selected.unit_price_measurement );
				}

				// Update selected value.
				if ( labeled ) {
					labeled.innerHTML = el.value;
				}

				// Update sale number badge.
				if ( amount ) {
					if ( selected.compare_at_price ) {
						let amountTotal = 100 * ( selected.compare_at_price - selected.price ) / selected.compare_at_price;

						amount.innerHTML = Math.round( amountTotal ) + '%';

						amount.parentNode.classList.remove( 'hidden' );
					} else {
						amount.parentNode.classList.add( 'hidden' );
					}
				}

				// Update product variant ID.
				if ( productId ) {
					productId.value = selected.id;
				}

				// Set max quantity.
				if ( input ) {
					let max = quantity.filter(
						function ( e ) {
							return e.id === selected.id;
						}
					);
					if ( max.length ) {
						let qty = max[0].qty;

						if ( qty > 0 ) {
							if ( Number( input.value ) > qty ) {
								input.value = qty;
							}

							input.setAttribute( 'max', qty );
						} else {
							input.removeAttribute( 'max' );
						}
					} else {
						input.removeAttribute( 'max' );
					}
				}

				// Update form state.
				if ( form ) {
					if ( selected.available ) {
						form.classList.remove( 'disabled' );
					} else {
						form.classList.add( 'disabled' );
					}
				}

				// Update add to cart button text.
				if ( button ) {
					if ( selected.available ) {
						button.innerHTML = btyStrings.product.add_to_cart;
					} else {
						button.innerHTML = btyStrings.product.out_of_stock;
					}
				}
			}
		}
	);

	// For first load.
	btySelectedVariant( variant_pick, variants, slider );
}

// Quick view.
function btyQuickView( doc = document ) {
	let box      = doc.querySelector( '.quick-view' ),
		content  = box ? box.querySelector( '.quick-view-content' ) : false,
		selector = doc.querySelectorAll( '.product-quick-view' );
	if ( ! content || ! selector.length ) {
		return;
	}

	selector.forEach(
		function( el ) {
			el.onclick = function( e ) {
				e.preventDefault();
				let product_id = el.parentNode.getAttribute( 'data-id' );
				if ( product_id == box.getAttribute( 'data-id' ) ) {
					document.documentElement.classList.add( 'quick-view-open' );
					return;
				}

				document.documentElement.classList.add( 'quick-view-open' );
				box.classList.add( 'loading' );
				box.setAttribute( 'data-id', product_id );

				fetch( el.href + '?sections=quickview' )
					.then(
						function( r ) {
							if ( 200 !== r.status ) {
								console.log( 'Status Code: ' + r.status );
								throw r;
							}

							return r.json();
						}
					).then(
						function( res ) {
							content.innerHTML = btyGetSectionHtml( res.quickview );

							// Re-init Buy now button.
							if ( window.Shopify.PaymentButton ) {
								Shopify.PaymentButton.init();
							}

							let options,
								gallery       = document.querySelector( '.quick-view .product-gallery .swiper' ),
								swiper_script = document.querySelector( '.quick-view #quick-view-swiper' );

							if ( swiper_script && gallery ) {
								options = {
									slidesPerView: 1,
									spaceBetween: 10,
									keyboard: {
										enabled: true
									},
									navigation: {
										nextEl: '.quick-view .swiper-button-next',
										prevEl: '.quick-view .swiper-button-prev'
									},
									pagination: {
										el: '.quick-view .swiper-pagination',
										type: 'bullets',
										clickable: true
									}
								}

								import( swiper_script.src )
									.then(
										function( module ) {
											let quickViewSlide = new Swiper( gallery, options );

											btyQuickViewVariants( box, quickViewSlide );
										}
									).catch(
										function( er ) {
											console.log( er );
										}
									);

								let swiper = new Swiper(
									'.mySwiper',
									{
										spaceBetween: 10,
										slidesPerView: 4,
										freeMode: true,
										watchSlidesProgress: true,
									}
								);

								let swiper2 = new Swiper(
									'.mySwiper2',
									{
										spaceBetween: 10,
										navigation: {
											nextEl: '.swiper-button-next',
											prevEl: '.swiper-button-prev',
										},
										thumbs: {
											swiper: swiper,
										},
									}
								);
							} else {
								btyQuickViewVariants( box, {} );
							}
						}
					).catch(
						function( e ) {
							console.error( e );
						}
					).finally(
						function() {
							// Re-init share.
							btyProductShare();

							// Re-init quantity.
							btyQuantityButton();

							// Re-init add to cart.
							btyAddToCart();

							// Remove loading.
							box.classList.remove( 'loading' );

							// Close popup.
							btyClosePopup( 'quick-view-open', box );
						}
					);
			}
		}
	);
}

// Update storage.
function btyUpdateStorage( key, array, id, type = 'local' ) {
	let storage = 'local' === type ? localStorage : sessionStorage;

	if ( ! storage.getItem( key ) ) {
		// Set key.
		storage.setItem( key, JSON.stringify( array ) );
	} else if ( ! storage.getItem( key ).includes( id ) ) {
		// Add new id.
		let parseStorage = btyJsonParse( storage.getItem( key ) );
		if ( ! parseStorage ) {
			return;
		}

		parseStorage.push( id );

		storage.setItem( key, JSON.stringify( parseStorage ) );
	}
}

// Update variants on popup.
function btyVariantsPopup( doc = document, popup ) {
	let variants = doc.querySelectorAll( '.product-variants' );
	if ( ! popup || ! variants.length ) {
		return;
	}

	variants.forEach(
		function( el ) {
			let variantData = el.querySelector( '[data-product-variants]' ),
				productId   = el.getAttribute( 'data-id' ),
				select      = el.querySelectorAll( '.field-value' ),
				imageLink   = popup.querySelector( '.preview-image [data-id="' + productId + '"]' ),
				image       = imageLink ? imageLink.querySelector( 'img' ) : false,
				price       = popup.querySelector( '[data-id="' + productId + '"] .product-price' ),
				stock       = popup.querySelector( '[data-id="' + productId + '"] .product-stock-status' ),
				form        = popup.querySelector( '.form-add-to-cart[data-id="' + productId + '"]' ),
				inputId     = form ? form.querySelector( '[name="id"]' ) : false,
				variantPick = {};

			if ( ! select.length ) {
				return;
			}

			variantData = btyJsonParse( variantData.textContent );
			if ( ! variantData ) {
				return;
			}

			// Foreach.
			select.forEach(
				function( sel ) {
					variantPick[ sel.name ] = sel.value;

					// Change event.
					sel.onchange = function() {
						variantPick[ sel.name ] = sel.value;

						let selected = btySelectedVariant( variantPick, variantData );

						// Update image.
						if ( image ) {
							image.removeAttribute( 'srcset' );
							btyImageLoad( image, selected.featured_media.preview_image.src, selected.featured_media.id, image.parentNode );
						}

						// Update current variant id.
						if ( inputId ) {
							inputId.value = selected.id;
						}

						// Update stock status, add to cart button text.
						if ( selected.available ) {
							if ( form ) {
								form.classList.remove( 'disabled' );
							}

							if ( stock ) {
								stock.innerHTML = btyStrings.product.in_stock;
								stock.classList.remove( 'inventory--low' );
								stock.classList.add( 'inventory--high' );
							}
						} else {
							if ( form ) {
								form.classList.add( 'disabled' );
							}

							if ( stock ) {
								stock.innerHTML = btyStrings.product.out_of_stock;
								stock.classList.remove( 'inventory--high' );
								stock.classList.add( 'inventory--low' );
							}
						}

						// Update frequently bought together product data.
						let fbt_item = sel.closest( '.fbt-item' );
						if ( fbt_item ) {
							fbt_item.setAttribute( 'data-price', selected.price );
						}

						if ( fbt_item ) {
							fbt_item.setAttribute( 'data-id', selected.id );
						}

						let fbt_price = popup.querySelector( '[data-id="' + selected.id + '"] .product-price' );
						if ( fbt_price ) {
							fbt_price.innerHTML = btyPriceHtml( selected.price, selected.compare_at_price );
						}

						// Update price.
						if ( price ) {
							price.innerHTML = btyPriceHtml( selected.price, selected.compare_at_price );
						}

						// Update total bundle price.
						btyUpdatePrice();
					}
				}
			);

			// First matching variants.
			let firstSelected = btySelectedVariant( variantPick, variantData );
			if ( firstSelected.available ) {
				if ( form ) {
					form.classList.remove( 'disabled' );
				}

				if ( stock ) {
					stock.innerHTML = btyStrings.product.in_stock;
					stock.classList.remove( 'inventory--low' );
					stock.classList.add( 'inventory--high' );
				}
			} else {
				if ( form ) {
					form.classList.add( 'disabled' );
				}

				if ( stock ) {
					stock.innerHTML = btyStrings.product.out_of_stock;
					stock.classList.remove( 'inventory--high' );
					stock.classList.add( 'inventory--low' );
				}
			}

			if ( price ) {
				price.innerHTML = btyPriceHtml( firstSelected.price, firstSelected.compare_at_price );
			}

			let fbt_price = popup.querySelector( '[data-id="' + firstSelected.id + '"] .product-price' );
			if ( fbt_price ) {
				fbt_price.innerHTML = btyPriceHtml( firstSelected.price, firstSelected.compare_at_price );
			}
		}
	);
}

// Calculator total price for frequently bought together.
function btyUpdatePrice() {
	let selector = document.querySelector( '.product-bought-together' ),
		marked   = selector ? selector.querySelectorAll( '.fbt-item .checkmark:checked' ) : [],
		button   = selector ? selector.querySelector( '.total-price' ) : false,
		price    = selector ? selector.querySelector( '.price-unit' ) : false;

	if ( ! button || ! price ) {
		return;
	}

	if ( ! marked.length ) {
		button.classList.add( 'hidden' );
		return;
	}

	button.classList.remove( 'hidden' );

	let total = 0;

	marked.forEach(
		function( m ) {
			total += Number( m.closest( '.fbt-item' ).getAttribute( 'data-price' ) );
		}
	);

	price.innerHTML = btyFormatPrice( total );
}

// Frequently bought together.
function btyBoughtTogether( doc = document ) {
	let selector = doc.querySelector( '.product-bought-together' );
	if ( ! selector ) {
		return;
	}

	// Support variants.
	btyVariantsPopup( selector, selector );

	let items = selector.querySelectorAll( '.fbt-item' );
	if ( ! items.length ) {
		return;
	}

	items.forEach(
		function( el ) {
			let mark = el.querySelector( '.checkmark' );
			if ( ! mark ) {
				return;
			}

			el.addEventListener(
				'click',
				function( e ) {
					if ( e.target.classList.contains( 'field-value' ) || e.target.classList.contains( 'fbt-info-title' ) ) {
						return;
					}

					mark.click();
				}
			);

			mark.onchange = function() {
				btyUpdatePrice();
			}
		}
	);
}

// Side cart.
function btySideCart() {
	let buttons  = document.querySelectorAll( '.action-cart' ),
		sideCart = document.querySelector( '.side-cart' );
	if ( ! buttons.length || ! sideCart ) {
		return;
	}

	buttons.forEach(
		function( el ) {
			el.onclick = function( e ) {
				e.preventDefault();

				document.documentElement.classList.add( 'side-cart-open' );

				btyClosePopup( 'side-cart-open', sideCart );
			}
		}
	);
}

// Click cart icon to show mini cart
let clickOpenMiniCarts = document.querySelectorAll('.header-icon');
clickOpenMiniCarts.forEach (
	function(clickOpenMiniCart) {
		clickOpenMiniCart.addEventListener('click', function() {
			let miniCart = getMiniCartElement();
			miniCart.classList.toggle('is-visible')
			let closeMinicartBtn = miniCart.querySelector('.remove-mini-cart')
			closeMinicartBtn.addEventListener('click', function() {
				miniCart.classList.remove( 'is-visible' );
			})
		})
	}
)

// Ajax add to cart.
function btyAddToCart( doc = document ) {
	let buttons = doc.querySelectorAll( '.add-to-cart-button' );
	if ( ! buttons.length ) {
		return;
	}

	// Register dom html need an update when the response available.
	let modules = [
		{
			node: '.header-icons .mini-cart', // Original selector html.
			section: 'mini-cart', // Name of section, eg: mini-cart.liquid.
			selector: '.mini-cart' // Ajax response selector html.
	},
		{
			section: 'cart-count'
	}
	];
	
	buttons.forEach(
		function( button ) {
			button.onclick = function( e ) {
				if ( 'A' === button.tagName.toUpperCase() ) {
					return;
				}

				e.preventDefault();

				button.classList.add( 'loading' );

				let data,
					items      = [],
					form       = button.closest( '[data-type="add-to-cart-form"]' ),
					body       = btySerializeForm( form, 'json' ),
					quantity   = Number( body.quantity || 1 ),
					summary    = button.closest( '.product-summary' ),
					fbt_marked = summary ? summary.querySelectorAll( '.fbt-item .checkmark:checked' ) : [];

				// Load sections.
				body.sections = modules.map( (s) => s.section );

				// Add product items.
				body.items = [
					{
						id: body.id,
						quantity: quantity
				}
				];

				// Get fbt product ids.
				if ( fbt_marked.length ) {
					fbt_marked.forEach(
						function( fbt ) {
							let item    = fbt.closest( '.fbt-item' ),
								item_id = item.getAttribute( 'data-id' );

							body.items.push(
								{
									id: item_id,
									quantity: 1
								}
							);
						}
					);
				}

				// Remove legacy id, quantity to avoid conflict.
				delete body.id;
				delete body.quantity;

				body = JSON.stringify( body );

				data = { ...btyFetchConfig( 'javascript' ), body };

				// Fetch data.
				fetch( btyGlobals.cart_add_url, data )
					.then(
						function( r ) {
							if ( 200 !== r.status ) {
								console.log( 'Status Code: ' + r.status );
								throw r;
							}

							return r.json();
						}
					).then(
						function( res ) {
							if ( res.errors ) {
								return;
							}

							// Update html.
							btyUpdateHtml( res.sections, modules );

							// Update cart items count.
							btyCartItemCount( btyGetSectionHtml( res.sections['cart-count'], '.shopify-section' ) );

							setTimeout(
								function() {
									// Show side cart.
									document.documentElement.classList.add( 'side-cart-open' );
								}
							);

							let miniCart = getMiniCartElement()

							// Trigger mini cart.
							if ( miniCart ) {
								miniCart.classList.add( 'is-visible' );
								let closeMinicartBtn = miniCart.querySelector('.remove-mini-cart')
								closeMinicartBtn.addEventListener('click', function() {
									miniCart.classList.remove( 'is-visible' );
								})
							}

						}
					).catch(
						function( e ) {
							console.error( e );
						}
					).finally(
						function() {
							// Re-init quantity.
							btyQuantityButton();

							// Re-init update quantity button.
							btyUpdateProductQuantity();

							button.classList.remove( 'loading' );

							btyClosePopup( 'side-cart-open', document.querySelector( '.side-cart' ) );
						}
					);
			}
		}
	);
}

function getMiniCartElement() {
	const bodyHasClass = document.body.classList.contains("pity");
	let miniCartSelector;
	if (bodyHasClass) {
		miniCartSelector = '.sticky-header .header-icons .item.cart';
	} else {
		miniCartSelector = '.header-icons .item.cart';
	}


	return document.querySelector( miniCartSelector );	
}

// Update wishlist count.
function btyUpdateCount( array = [], selector = '.action-wishlist .item-count' ) {
	let count = document.querySelectorAll( selector );
	if ( ! count.length ) {
		return;
	}

	count.forEach(
		function( el ) {
			el.innerHTML = array.length ? array.length : '';
		}
	);
}

// Update compare count.
function btyUpdateCountcompare( array = [], selector = '.action-compare .item-count' ) {
	let count = document.querySelectorAll( selector );
	if ( ! count.length ) {
		return;
	}

	count.forEach(
		function( el ) {
			el.innerHTML = array.length ? array.length : '';
		}
	);
}


// Compare.
function btyCompare( doc = document ) {
	let box      = doc.querySelector( '.compare-box' ),
		content  = box ? box.querySelector( '.compare-content' ) : false,
		selector = doc.querySelectorAll( '.product-compare' );
	if ( ! content || ! selector.length || 'undefined' === typeof( Storage ) ) {
		return;
	}

	// Set active for products added to compare.
	if ( sessionStorage.getItem( 'compare-ids' ) ) {
		btyJsonParse( sessionStorage.getItem( 'compare-ids' ) ).forEach(
			function( id ) {
				let compareBtn     = doc.querySelector( '.product-actions[data-id="' + id + '"] .product-compare' ),
					compareTooltip = compareBtn ? ( compareBtn.querySelector( '.tooltip' ) || compareBtn.querySelector( '.action-text' ) ) : false;
				if ( compareTooltip ) {
					compareBtn.classList.add( 'active' );
					compareTooltip.innerHTML = btyStrings.general.added_compare;
				}
			}
		);

		if ( btyJsonParse( sessionStorage.getItem( 'compare-ids' ) ).length ) {
			btyUpdateCountcompare( btyJsonParse( sessionStorage.getItem( 'compare-ids' ) ), '.action-compare .item-count' );
		}
	}

	let ids = [];

	selector.forEach(
		function( el ) {
			el.onclick = function( e ) {
				e.preventDefault();

				let params, productId = el.parentNode.getAttribute( 'data-id' );
				if ( productId && ! ids.includes( productId ) ) {
					ids.push( productId );
				}

				document.documentElement.classList.add( 'compare-box-open' );
				box.classList.add( 'loading' );

				// Update local storage.
				if ( ids.length && productId ) {
					btyUpdateStorage( 'compare-ids', ids, productId, 'session' );
				}

				if ( ! sessionStorage.getItem( 'compare-ids' ) ) {
					document.documentElement.classList.remove( 'compare-box-open' );
					box.classList.remove( 'loading' );

					return;
				}

				// Update compare product count.
				btyUpdateCountcompare( JSON.parse( sessionStorage.getItem( 'compare-ids' ) ), '.action-compare .item-count' );

				// Parse params.
				params = JSON.parse( sessionStorage.getItem( 'compare-ids' ) ).map(
					function( id ) {
						return 'id:' + id;
					}
				).join( ' OR ' );

				// Fetch.
				fetch( '/search?section_id=product-compare&type=product&q=' + params )
					.then(
						function( r ) {
							if ( 200 !== r.status ) {
								console.log( 'Status Code: ' + r.status );
								throw r;
							}

							return r.text();
						}
					).then(
						function( res ) {
							content.innerHTML = btyGetSectionHtml( res, '.compare-table', 'outer' );

							// Add active status for add to compare button.
							let addActive  = doc.querySelector( '.product-actions[data-id="' + productId + '"] .product-compare' ),
								addTooltip = addActive ? ( addActive.querySelector( '.tooltip' ) || addActive.querySelector( '.action-text' ) ) : false;
							if ( addTooltip ) {
								addActive.classList.add( 'active' );
								addTooltip.innerHTML = btyStrings.general.added_compare;
							}
						}
					).catch(
						function( e ) {
							console.error( e );
						}
					).finally(
						function() {
							// Re-init quantity.
							btyQuantityButton( box );

							// Add to cart.
							btyAddToCart( box );

							// Remove loading.
							box.classList.remove( 'loading' );

							// Close popup.
							btyClosePopup( 'compare-box-open', box );

							// Variations update.
							btyVariantsPopup( doc, box );

							// Remove to compare.
							let remove = box.querySelectorAll( '.compare-remove' );
							if ( ! remove.length ) {
								return;
							}

							remove.forEach(
								function( el ) {
									el.onclick = function() {
										let listId    = sessionStorage.getItem( 'compare-ids' ),
											currentId = el.getAttribute( 'data-id' ),
											td        = el.parentNode,
											index     = Array.prototype.indexOf.call( td.parentNode.childNodes, td ) + 1,
											thead     = box.querySelector( 'thead th:nth-child(' + index + ')' ),
											tbody     = box.querySelectorAll( 'tbody td:nth-child(' + index + ')' ),
											tfoot     = box.querySelector( 'tfoot td:nth-child(' + index + ')' );

										// Remove current product id.
										listId = btyJsonParse( listId );
										if ( listId ) {
											listId = btyRemoveArrayItem( listId, currentId );
										}

										// Remove active status for add to compare button.
										let resetActive  = doc.querySelector( '.product-actions[data-id="' + currentId + '"] .product-compare' ),
											resetTooltip = resetActive ? ( resetActive.querySelector( '.tooltip' ) || resetActive.querySelector( '.action-text' ) ) : false;
										if ( resetTooltip ) {
											resetActive.classList.remove( 'active' );
											resetTooltip.innerHTML = btyStrings.general.add_compare;
										}

										// Update product compare count.
										btyUpdateCountcompare( listId, '.action-compare .item-count' );

										// Clear.
										if ( ! listId.length ) {
											ids = [];
											sessionStorage.removeItem( 'compare-ids' );
											content.innerHTML = '<p class="compare-empty">' + btyStrings.general.compare_empty + '</p>';
											return;
										}

										// Update list id.
										sessionStorage.setItem( 'compare-ids', JSON.stringify( listId ) );

										// Update html.
										if ( thead ) {
											if ( listId.length < 4 ) {
												thead.classList.add( 'td-placeholder' );
												thead.innerHTML = '';
											} else {
												thead.remove();
											}
										}

										if ( tbody.length ) {
											tbody.forEach(
												function( tb ) {
													if ( listId.length < 4 ) {
														// Set image placeholder after click Remove button.
														let imageTd = tb.closest( '.compare-image' );
														if ( imageTd ) {
															tb.innerHTML = btyGlobals.image_placeholder;
														} else {
															tb.innerHTML = '';
														}

														tb.classList.add( 'td-placeholder' );
													} else {
														tb.remove();
													}
												}
											);
										}

										if ( tfoot ) {
											if ( listId.length < 4 ) {
												tfoot.classList.add( 'td-placeholder' );
												tfoot.innerHTML = '';
											} else {
												tfoot.remove();
											}
										}
									}
								}
							);
						}
					);
			}
		}
	);
}

// View wishlist.
function btyViewWishlist( doc = document ) {
	let count    = doc.querySelector( '.action-wishlist .item-count' ),
		box      = doc.querySelector( '.wishlist-box' ),
		content  = box ? box.querySelector( '.wishlist-content' ) : false,
		selector = doc.querySelectorAll( '.action-wishlist' );
	if ( ! count || ! selector.length || ! content || 'undefined' === typeof( Storage ) ) {
		return;
	}

	// Get current products in wishlist on first load.
	const firstLoadedIds = JSON.parse( localStorage.getItem( 'wishlist-ids' ) );
	if ( firstLoadedIds ) {
		btyUpdateCount( firstLoadedIds );
	}

	// Add wishlist button state.
	const addButtonState = function( array ) {
		if ( ! array.length ) {
			return;
		}

		for ( let i = 0, j = array.length; i < j; i++ ) {
			let button  = doc.querySelector( '.product-actions[data-id="' + array[i] + '"] .product-wishlist' ),
				tooltip = button ? ( button.querySelector( '.tooltip' ) || button.querySelector( '.action-text' ) ) : false;

			if ( tooltip ) {
				button.classList.add( 'active' );
				tooltip.innerHTML = btyStrings.general.added_wishlist;
			}
		}
	}

	if ( firstLoadedIds ) {
		addButtonState( firstLoadedIds );
	}

	// Remove wishlist button state.
	const removeButtonState = function( product_id ) {
		let button  = doc.querySelector( '.product-actions[data-id="' + product_id + '"] .product-wishlist' ),
			tooltip = button ? ( button.querySelector( '.tooltip' ) || button.querySelector( '.action-text' ) ) : false;

		if ( tooltip ) {
			button.classList.remove( 'active' );
			tooltip.innerHTML = btyStrings.general.add_wishlist;
		}
	}

	// View wishlist popup.
	selector.forEach(
		function( el ) {
			el.onclick = function( e ) {
				e.preventDefault();

				// Add loading animation.
				document.documentElement.classList.add( 'wishlist-box-open' );
				box.classList.add( 'loading' );

				// Parse product ids.
				let params = btyJsonParse( localStorage.getItem( 'wishlist-ids' ) );
				if ( params && params.length ) {
					params = params.map(
						function( id ) {
							return 'id:' + id;
						}
					).join( ' OR ' );
				}

				// Fetch content.
				fetch( '/search?section_id=product-wishlist&type=product&q=' + params )
					.then(
						function( r ) {
							if ( 200 !== r.status ) {
								console.log( 'Status Code: ' + r.status );
								throw r;
							}

							return r.text();
						}
					).then(
						function( res ) {
							content.innerHTML = btyGetSectionHtml( res, '.wishlist-table' );
						}
					).catch(
						function( e ) {
							console.error( e );
						}
					).finally(
						function() {
							// Remove loading.
							box.classList.remove( 'loading' );

							// Quantity button.
							btyQuantityButton( box );

							// Add to cart.
							btyAddToCart( box );

							// Variations update.
							btyVariantsPopup( doc, box );

							// Close popup.
							btyClosePopup( 'wishlist-box-open', box );

							// Remove wishlist item.
							let remove = content.querySelectorAll( '.wishlist-remove' );
							if ( remove.length ) {
								remove.forEach(
									function( rm ) {
										rm.onclick = function() {
											let tr = rm.closest( 'tr' ),
												id = rm.getAttribute( 'data-id' );
											if ( ! tr || ! id ) {
												return;
											}

											tr.remove();

											// Remove product id.
											let listId = JSON.parse( localStorage.getItem( 'wishlist-ids' ) );
											if ( listId ) {
												let filterIds = btyRemoveArrayItem( listId, id );

												// Update count.
												btyUpdateCount( filterIds );

												// Update button state.
												removeButtonState( id );

												// Update product wishlist ids.
												localStorage.setItem( 'wishlist-ids', JSON.stringify( filterIds ) );

												if ( ! filterIds.length ) {
													// Remove wishlist id list.
													localStorage.removeItem( 'wishlist-ids' );

													// Update popup content.
													let table = content.querySelector( '.wl-table' );
												}
											}
										}
									}
								);
							}
						}
					);
			}
		}
	);
}


// Share Wishlist 




document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayWishlist();
});
function fetchAndDisplayWishlist() {
    let params = JSON.parse(localStorage.getItem('wishlist-ids'));
    if (params && params.length) {
        params = params.map(id => 'id:' + id).join(' OR ');
    } else {
        updateWishlistContent('<p>Your wishlist is currently empty.</p>');
        return;
    }
    fetch(`/search?section_id=product-wishlist&type=product&q=${params}`)
        .then(response => {
            if (response.status !== 200) {
                throw new Error('Failed to fetch wishlist');
            }
            return response.text();
        })
        .then(html => {
            const wishlistTableHtml = btyGetSectionHtml(html, '.wishlist-table');
            updateWishlistContent(wishlistTableHtml);
        })
        .catch(error => {
            console.error('Error fetching wishlist:', error);
            updateWishlistContent('<p>Error loading wishlist. Please try again later.</p>');
        });
}

 function updateWishlistContent(html) {
    const wishlistContents = document.querySelectorAll('.wishlist-content');
    wishlistContents.forEach(content => {
        content.innerHTML = html;
    });
}




 



// Add to wishlist.
function btyAddWishlist( doc = document ) {
	let count    = document.querySelector( '.action-wishlist .item-count' ),
		selector = doc.querySelectorAll( '.product-wishlist' );
	if ( ! count || ! selector.length || 'undefined' === typeof( Storage ) ) {
		return;
	}

	let ids = [];

	selector.forEach(
		function( el ) {
			el.onclick = function( e ) {
				e.preventDefault();

				let state        = el.classList.contains( 'active' ),
					tooltip      = el.querySelector( '.tooltip' ),
					productId    = el.parentNode.getAttribute( 'data-id' ),
					productCard  = el.closest( '.product-card' ) || el.closest( '.product-summary-inner' ),
					productImage = productCard ? productCard.querySelector( '.product-image' ) : false,
					productTitle = productCard ? productCard.querySelector( '.product-title' ) : false,
					productPrice = productCard ? productCard.querySelector( '.product-price' ) : false,
					html         = '';

				if ( ! productImage || ! productTitle || ! productPrice ) {
					return;
				}

				if ( ! ids.includes( productId ) ) {
					ids.push( productId );
				}

				// Update local storage.
				btyUpdateStorage( 'wishlist-ids', ids, productId );

				// Get total product ids in wishlist.
				let total = btyJsonParse( localStorage.getItem( 'wishlist-ids' ) );

				// Update active state and tooltip.
				if ( state ) {
					el.classList.remove( 'active' );

					if ( tooltip ) {
						tooltip.innerHTML = btyStrings.general.add_wishlist;
					}

					// Remove product id from wishlist.
					total = btyRemoveArrayItem( total, productId );
					localStorage.setItem( 'wishlist-ids', JSON.stringify( total ) );
					total = btyJsonParse( localStorage.getItem( 'wishlist-ids' ) );
				} else {
					el.classList.add( 'active' );

					if ( tooltip ) {
						tooltip.innerHTML = btyStrings.general.remove_wishlist;
					}
				}

				// Update wishlist count.
				if ( total ) {
					btyUpdateCount( total );
				}

				// View wishlist.
				btyViewWishlist();
			}
		}
	);
}

// Swatch list.
function btySwatch( doc = document ) {
	let swatch = doc.querySelectorAll( '.product-card .swatch' );
	if ( ! swatch.length ) {
		return;
	}

	swatch.forEach(
		function( el ) {
			el.onclick = function( e ) {
				e.preventDefault();

				// Get swatch image src.
				let src = el.getAttribute( 'data-src' ) || '';
				if ( ! src ) {
					return;
				}

				// Get wrapper.
				let card    = el.closest( '.product-card' ),
					wrapper = card ? card.querySelector( '.product-image-wrap' ) : false;
				if ( ! wrapper ) {
					return;
				}

				// Get product image.
				let image = wrapper.querySelector( '.product-image' );
				if ( ! image ) {
					return;
				}

				// Handle loading image.
				const imageLoadHandle = function( dataSrc, main ) {
					let newImage     = new Image(),
						variationImg = el.getAttribute( 'data-key' ) || false,
						mainImg      = image.getAttribute( 'data-key' ) || false;

					newImage.crossOrigin = 'anonymous';

					// Main image.
					if ( main ) {
						variationImg = mainImg;
					}

					// Check local storage first.
					if ( sessionStorage.getItem( variationImg ) ) {
						image.src = sessionStorage.getItem( variationImg );
						image.removeAttribute( 'srcset' );
						return;
					}

					// Save main product image first.
					if ( 'string' !== typeof( image.getAttribute( 'data-loaded' ) ) && mainImg ) {
						let mainImage = new Image();

						mainImage.crossOrigin = 'anonymous';

						mainImage.onload = function() {
							let renderMainImage = btyGetImageSrc( mainImage );

							if ( mainImg ) {
								sessionStorage.setItem( mainImg, renderMainImage );
							}

							image.setAttribute( 'data-loaded', '' );
						}

						mainImage.src = image.src;
					}

					// Add loading animation.
					wrapper.classList.add( 'loading' );

					// Handle.
					newImage.onload = function() {
						wrapper.classList.remove( 'loading' );
						let renderImage = btyGetImageSrc( newImage );

						// Set final image src.
						image.src = renderImage;
						image.removeAttribute( 'srcset' );

						// Save image to local storage.
						if ( variationImg ) {
							sessionStorage.setItem( variationImg, renderImage );
						}
					}

					newImage.onerror = function() {
						wrapper.classList.remove( 'loading' );
					}

					// Set image src for 'newImage.onload' function handle.
					newImage.src = dataSrc;
				}

				// Remove current swatch selected.
				if ( el.classList.contains( 'selected' ) ) {
					el.classList.remove( 'selected' );
					imageLoadHandle( '', true );
					return;
				}

				// Get old selected.
				let oldActive = card.querySelector( '.swatch.selected' );
				if ( oldActive ) {
					oldActive.classList.remove( 'selected' );
				}

				// Set swatch selected.
				el.classList.add( 'selected' );

				// Update product image src.
				if ( src != image.src ) {
					imageLoadHandle( src );
				}
			}
		}
	);
}

// Product tabs.
function btyProductTabs( doc = document, event = {} ) {
	let selectors = doc.querySelectorAll( '.tabs .tab-head' );
	if ( ! selectors.length ) {
		return;
	}

	selectors.forEach(
		function( el ) {
			let wrap  = el.closest( '.tabs' ),
				index = el.getAttribute( 'data-index' ),
				tab   = wrap.querySelector( '.tab-content[data-index="' + index + '"]' );

			if ( ! tab ) {
				return;
			}

			// For design mode.
			if ( Shopify.designMode && Object.keys( event ).length ) {
				let currentTab = doc.querySelector( '.tab-head[data-id="' + event.detail.blockId + '"]' );
				if ( currentTab ) {
					currentTab.click();
				}
			}

			el.addEventListener(
				'click',
				function() {
					if ( el.classList.contains( 'active' ) ) {
						return;
					}

					let navActived = wrap.querySelector( '.tab-head.active' ),
						tabActived = wrap.querySelector( '.tab-content.active' );
					if ( navActived ) {
						navActived.classList.remove( 'active' );
					}

					if ( tabActived ) {
						tabActived.classList.remove( 'active' );
					}

					el.classList.add( 'active' );
					tab.classList.add( 'active' );
				}
			);
		}
	);

	let dropdown = doc.querySelectorAll( '.dropdown-content li' );
	if ( dropdown.length ) {
		dropdown.forEach(
			function( el ) {
				el.addEventListener(
					'click',
					function() {
						let parent  = el.closest( '.tabs' ),
							current = parent.querySelector( '.tab-head[data-index="' + el.getAttribute( 'data-index' ) + '"]' );
						if ( ! current ) {
							return;
						}

						current.click();
					}
				);
			}
		);
	}
}

// Animation for accordion.
class btyAccordion {
	constructor( el, toggle = 'summary', view = '.details-content' ) {
		const accordion = this;

		accordion.el      = el;
		accordion.summary = el.querySelector( toggle );
		accordion.content = el.querySelector( view );

		accordion.animation   = null;
		accordion.isClosing   = false;
		accordion.isExpanding = false;

		if ( ! accordion.content ) {
			return;
		}

		accordion.summary.addEventListener(
			'click',
			function( e ) {
				accordion.onClick( e );
			}
		);
	}

	onClick(e) {
		e.preventDefault();
		const accordion = this;

		accordion.el.style.overflow = 'hidden';

		if ( accordion.isClosing || ! accordion.el.open ) {
			accordion.open();
		} else if ( accordion.isExpanding || accordion.el.open ) {
			accordion.shrink();
		}
	}

	shrink() {
		const accordion = this;

		accordion.isClosing = true;

		let startHeight = accordion.el.offsetHeight + 'px',
			endHeight   = accordion.summary.offsetHeight + 'px';

		if ( accordion.animation ) {
			accordion.animation.cancel();
		}

		accordion.animation = accordion.el.animate(
			{
				height: [startHeight, endHeight]
			},
			{
				duration: 200,
				easing: 'ease-out'
			}
		);

		accordion.animation.onfinish = function() {
			accordion.onAnimationFinish( false );
		}

		accordion.animation.oncancel = function() {
			accordion.isClosing = false;
		}
	}

	open() {
		const accordion = this;

		accordion.el.style.height = accordion.el.offsetHeight + 'px';
		accordion.el.open         = true;

		window.requestAnimationFrame(
			function() {
				accordion.expand();
			}
		);
	}

	expand() {
		const accordion = this;

		accordion.isExpanding = true;

		let startHeight = accordion.el.offsetHeight + 'px',
			endHeight   = ( accordion.summary.offsetHeight + accordion.content.offsetHeight ) + 'px';

		if (accordion.animation) {
			accordion.animation.cancel();
		}

		accordion.animation = accordion.el.animate(
			{
				height: [startHeight, endHeight]
			},
			{
				duration: 200,
				easing: 'ease-out'
			}
		);

		accordion.animation.onfinish = function() {
			accordion.onAnimationFinish( true );
		}

		accordion.animation.oncancel = function() {
			accordion.isExpanding = false;
		}
	}

	onAnimationFinish(open) {
		const accordion = this;

		accordion.el.open     = open;
		accordion.animation   = null;
		accordion.isClosing   = false;
		accordion.isExpanding = false;

		accordion.el.removeAttribute( 'style' );
	}
}

function btyAccordionHandle( doc = document ) {
	let details = doc.querySelectorAll( 'details' );
	if ( ! details.length ) {
		return;
	}

	details.forEach(
		function( el ) {
			new btyAccordion( el );
		}
	);
}

// Footer accordion.
function btyFooterAccordion( doc = document ) {
	let headings = doc.querySelectorAll( '.footer .footer-block-heading' );
	if ( ! headings.length || window.matchMedia( '(min-width: 768px)' ).matches ) {
		return;
	}

	headings.forEach(
		function( el ) {
			let block = el.parentNode.querySelector( '.footer-block' );
			if ( ! block ) {
				return;
			}

			el.onclick = function() {
				if ( 'none' === window.getComputedStyle( block ).display ) {
					btySlideDown( block );
					el.parentNode.classList.add( 'open' );
				} else {
					btySlideUp( block );
					el.parentNode.classList.remove( 'open' );
				}
			}
		}
	);
}

// Video.
function btyVideo( doc = document ) {
	let selectors = doc.querySelectorAll( '.video-item' );
	if ( ! selectors.length ) {
		return;
	}

	selectors.forEach(
		function( el ) {
			el.addEventListener(
				'click',
				function() {
					let iframe = el.querySelector( 'iframe' );
					if ( ! iframe ) {
						return;
					}

					iframe.src = iframe.getAttribute( 'data-src' );
				}
			);
		}
	);
}

// Action for media.
function MediaAction( el, type = 'pause' ) {
	if ( ! el ) {
		el = document;
	}

	let video = el.querySelectorAll( '.js-youtube, .js-vimeo, video' );
	if ( ! video.length ) {
		return;
	}

	if ( video.length ) {
		video.forEach(
			function( vd ) {
				if ( 'video' === vd.tagName.toLowerCase() ) {
					if ( 'pause' === type ) {
						vd.pause();
					} else {
						vd.play();
					}
				} else if ( vd.classList.contains( 'js-youtube' ) ) {
					vd.contentWindow.postMessage( '{"event":"command","func":"stopVideo","args":""}', '*' );
				} else if ( vd.classList.contains( 'js-vimeo' ) ) {
					vd.contentWindow.postMessage( '{"method":"pause"}', '*' );
				}
			}
		);
	}
}

// Popup Video.
function btyVideoPopup( doc = document ) {
	let selectors  = doc.querySelectorAll( '.play-video' ),
		popupvideo = doc.querySelector( '.popup-video' ),
		closevideo = doc.querySelector( '.close-popup-video' );
	if ( ! selectors.length ) {
		return;
	}

	selectors.forEach(
		function( el ) {
			el.addEventListener(
				'click',
				function() {
					console.log( 1 );
					let iframe = el.parentNode.parentNode.querySelector( 'iframe' );
					if ( ! iframe ) {
						return;
					}

					popupvideo.classList.add( 'show' );
					iframe.src = iframe.getAttribute( 'data-src' );

					setTimeout(
						function() {
							console.log( 2 );
							iframe.contentWindow.postMessage( '{"event":"command","func":"playVideo","args":""}', '*' );
						},
						100
					);

					closevideo.addEventListener(
						'click',
						function() {
							let iframe = closevideo.parentNode.querySelector( 'iframe' );
							if ( ! iframe ) {
								return;
							}
							console.log( 3 );

							iframe.contentWindow.postMessage( '{"event":"command","func":"stopVideo","args":""}', '*' );

							popupvideo.classList.remove( 'show' );
						}
					);
				}
			);
		}
	);

	popupvideo.addEventListener(
		'click',
		function(){
			popupvideo.classList.remove( 'show' );

		}
	);

}

// hover menu main

function btyHoverMenu( doc = document ) {

	let list  = doc.querySelectorAll( '.header .menu li' );
	if ( ! list.length ) {
		return;
	}

	for(var i = 0; i < list.length; i++) {

		list[i].addEventListener(
			'mouseover',
			function() {
	  			doc.body.classList.add( 'menu-open' );
			}
		);

	    list[i].addEventListener(
	    	'mouseout',
	    	function() {
	  			doc.body.classList.remove( 'menu-open' );
			}
		);
  	}

}


// hover search header top

function btyHoverSearch( doc = document ) {

	let search  = doc.querySelectorAll( '.header .search-form-wrap' );
	if ( ! search.length ) {
		return;
	}

	for(var i = 0; i < search.length; i++) {

		search[i].addEventListener(
			'mouseover',
			function() {
	  			doc.body.classList.add( 'menu-open' );
			}
		);

	    search[i].addEventListener(
	    	'mouseout',
	    	function() {
	  			doc.body.classList.remove( 'menu-open' );
			}
		);
  	}

}

// Address box section.
function btyAddress( doc =document ) {
	let selectors = doc.querySelectorAll( '.address-box .address-summary' );
	if ( ! selectors.length ) {
		return;
	}

	selectors.forEach(
		function( el ) {
			let items = el.querySelectorAll( '.summary-item' );
			if ( items.length < 2 ) {
				return;
			}

			items.forEach(
				function( im, index ) {
					im.addEventListener(
						'click',
						function( e ) {
							e.preventDefault();

							const mobile = window.matchMedia( '(max-width: 767px)' ).matches;

							let oldActive = el.querySelector( '.summary-item.active' ),
								subBox    = im.querySelector( '.address-sub' ),
								image     = el.parentNode.querySelector( '.address-content-inner' );

							if ( im.classList.contains( 'active' ) ) {
								return;
							}

							if ( oldActive ) {
								let oldSubBox = oldActive.querySelector( '.address-sub' );
								if ( oldSubBox && mobile ) {
									btySlideUp( oldSubBox );
								}
								oldActive.classList.remove( 'active' );
							}

							if ( image ) {
								image.setAttribute( 'data-level', index );
							}

							im.classList.add( 'active' );

							if ( subBox && mobile ) {
								btySlideDown( subBox );
							}
						}
					);
				}
			);
		}
	);
}

// Pickup availability.
function btyPickupAvailability( doc = document, variant_id = false, pickup = false ) {
	fetch( '/variants/' + variant_id + '?section_id=pickup-availability' )
		.then(
			function( r ) {
				if ( 200 !== r.status ) {
					console.log( 'Status Code: ' + r.status );
					throw r;
				}

				return r.text();
			}
		).then(
			function( res ) {
				pickup.innerHTML = btyGetSectionHtml( res );

				let toggle = pickup.querySelector( '.toggle-modal' );
				if ( toggle ) {
					toggle.onclick = function() {
						document.documentElement.classList.add( 'pickup-availability-open' );

						let pickupAvailability = toggle.closest( '.pickup-availability' ),
							modal              = pickupAvailability ? pickupAvailability.querySelector( '.pickup-availability-modal' ) : false;

						btyClosePopup( 'pickup-availability-open', modal );
					}
				}
			}
		).catch(
			function( e ) {
				console.error( e );
			}
		);
}

// Pickup availability for simple product.
function btyPickupAvailabilityInit( doc = document ) {
	let variants = doc.querySelectorAll( '.product-variants' );
	if ( variants.length ) {
		return;
	}

	let inner     = doc.querySelector( '.product-summary-inner[data-selected-id]' ),
		pickup    = doc.querySelector( '.pickup-availability' ),
		productId = inner ? inner.getAttribute( 'data-selected-id' ) : false;

	if ( ! pickup || ! productId ) {
		return;
	}

	btyPickupAvailability( doc, productId, pickup );
}

// Variant options.
function btyProductVariants( doc = document ) {
	let selector = doc.querySelectorAll( '.product-variants' );
	if ( ! selector.length ) {
		return;
	}

	selector.forEach(
		function( el ) {
			let variants = el.querySelector( '[data-product-variants]' ),
				quantity = el.querySelector( '[data-inventory-quantity]' ),
				field    = el.querySelectorAll( '.field-value' );
			if ( ! field.length || ! variants ) {
				return;
			}

			let layout       = el.closest( '[data-gallery="list"]' ),
				featured     = el.closest( '.featured-product-product' ),
				image        = featured ? featured.querySelector( '.media-preview' ) : false,
				summary      = el.closest( '.product-summary' ),
				variant_pick = {};

			variants = JSON.parse( variants.textContent );
			quantity = JSON.parse( quantity.textContent );

			let price      = summary.querySelector( '.product-price' ),
				form       = summary.querySelector( '[data-type="add-to-cart-form"]' ),
				input      = form ? form.querySelector( '.quantity-input' ) : false,
				productId  = form ? form.querySelector( '[name="id"]' ) : false,
				productUrl = el.getAttribute( 'data-url' ),
				button     = form ? form.querySelector( '[name="add"]' ) : false,
				pickup     = summary.querySelector( '.pickup-availability' ),
				amount     = summary.querySelector( '.product-sale-label .sale-total' );

			field.forEach(
				function( el ) {
					// Product bought together have other function to handling.
					if ( el.closest( '.product-bought-together' ) ) {
						return;
					}

					if ( 'radio' === el.type ) {
						if ( el.checked ) {
							variant_pick[ el.name ] = el.value;
						}
					} else {
						variant_pick[ el.name ] = el.value;
					}

					el.onchange = function() {
						variant_pick[ el.name ] = el.value;

						// When variant change.
						let selected = btySelectedVariant( variant_pick, variants, window.btyMainSlider ),
							labeled  = el.parentNode.querySelector( '.selected-value' );

						if ( layout ) {
							let currentMedia = layout.querySelector( '.media-preview-wrap[data-id="' + selected.featured_media.id + '"]' );

							if ( currentMedia ) {
								currentMedia.scrollIntoView( { behavior: 'smooth' } );
							}
						}

						// Update image on Featured product.
						if ( image ) {
							image.removeAttribute( 'srcset' );
							btyImageLoad( image, selected.featured_image.src, selected.featured_media.id, image.parentNode );
						}

						// Update product variant ID.
						if ( productId ) {
							productId.value = selected.id;
						}

						// Pickup availability.
						if ( pickup ) {
							btyPickupAvailability( doc, productId.value, pickup );
						}

						// Update product url.
						if ( productUrl ) {
							window.history.replaceState( {}, '', productUrl + '?variant=' + selected.id );
						}

						// Update price.
						if ( price ) {
							price.innerHTML = btyPriceHtml( selected.price, selected.compare_at_price, selected.unit_price, selected.unit_price_measurement );
						}

						// Update selected value.
						if ( labeled ) {
							labeled.innerHTML = el.value;
						}

						// Update sale number badge.
						if ( amount ) {
							if ( selected.compare_at_price ) {
								let amountTotal = 100 * ( selected.compare_at_price - selected.price ) / selected.compare_at_price;

								amount.innerHTML = Math.round( amountTotal ) + '%';

								amount.parentNode.classList.remove( 'hidden' );
							} else {
								amount.parentNode.classList.add( 'hidden' );
							}
						}

						// Set max quantity.
						if ( input ) {
							let max = quantity.filter(
								function ( e ) {
									return e.id === selected.id;
								}
							);
							if ( max.length ) {
								let qty = max[0].qty;

								if ( qty > 0 ) {
									if ( Number( input.value ) > qty ) {
										input.value = qty;
									}

									input.setAttribute( 'max', qty );
								} else {
									input.removeAttribute( 'max' );
								}
							} else {
								input.removeAttribute( 'max' );
							}
						}

						// Update form state.
						if ( form ) {
							if ( selected.available ) {
								form.classList.remove( 'disabled' );
							} else {
								form.classList.add( 'disabled' );
							}
						}

						// Update add to cart button text.
						if ( button ) {
							if ( selected.available ) {
								button.innerHTML = btyStrings.product.add_to_cart;
							} else {
								button.innerHTML = btyStrings.product.out_of_stock;
							}
						}
					}
				}
			);

			// For first load.
			// Variant selected.
			btySelectedVariant( variant_pick, variants, window.btyMainSlider );

			// Pickup availability.
			if ( pickup && productId ) {
				btyPickupAvailability( doc, productId.value, pickup );
			}
		}
	);
}

// Popup content.
function btyProductPopup( doc = document ) {
	let selectors = doc.querySelectorAll( '.product-popup' );
	if ( ! selectors.length ) {
		return;
	}

	selectors.forEach(
		function( el ) {
			let button = el.querySelector( '.popup-toggle' ),
				view   = el.querySelector( '.popup-view' ),
				close  = el.querySelector( '.popup-close' );

			if ( ! button || ! view || ! close ) {
				return;
			}

			button.onclick = function() {
				button.parentNode.classList.add( 'open' );

				// Target.
				view.onclick = function( e ) {
					if ( view !== e.target ) {
						return;
					}

					button.parentNode.classList.remove( 'open' );
				}

				// Use ESC key.
				document.addEventListener(
					'keyup',
					function( e ) {
						if ( 27 !== e.keyCode ) {
							return;
						}

						button.parentNode.classList.remove( 'open' );
					}
				);

				// Use close button.
				close.onclick = function() {
					button.parentNode.classList.remove( 'open' );
				}
			}
		}
	);
}

// Share button.
function btyProductShare( doc = document ) {
	let selector = doc.querySelector( '.product-share[data-os]' );
	if ( ! selector ) {
		return;
	}

	let button  = selector.querySelector( '.share-button' ),
		summary = selector.querySelector( 'summary' ),
		input   = selector.querySelector( '.field-input' ),
		message = selector.querySelector( '.share-message' ),
		copy    = selector.querySelector( '.share-button-copy' ),
		close   = selector.querySelector( '.share-button-close' );

	if ( ! button || ! summary || ! copy || ! close ) {
		return;
	}

	let closeAction = function() {
		summary.parentNode.removeAttribute( 'open' );
		close.classList.add( 'hidden' );
		message.classList.add( 'hidden' );
		message.textContent = '';
	}

	if ( navigator.share ) {
		button.classList.remove( 'hidden' );
		button.onclick = function() {
			navigator.share(
				{
					url: document.location.href,
					title: document.title
				}
			);
		}
	} else {
		summary.classList.remove( 'hidden' );

		copy.onclick = function() {
			navigator.clipboard.writeText( input.value ).then(
				function() {
					message.classList.remove( 'hidden' );
					close.classList.remove( 'hidden' );

					message.textContent = btyStrings.general.share_success;
				}
			);
		}

		// Click any to close.
		document.addEventListener(
			'click',
			function( e ) {
				if ( e.target.closest( '.product-share' ) ) {
					return;
				}

				closeAction();
			}
		);

		// Use ESC key.
		document.addEventListener(
			'keyup',
			function( e ) {
				if ( 27 !== e.keyCode ) {
					return;
				}

				closeAction();
			}
		);

		// Close button.
		close.onclick = closeAction;
	}
}

// Sale notification.
function btySalesNotification( doc = document ) {
	let selector = doc.querySelector( '.sales-notification' );
	if ( ! selector ) {
		return;
	}

	let inner   = selector.querySelector( '.sn-inner' ),
		options = selector.querySelector( '[data-options]' ),
		items   = selector.querySelector( '[data-items]' );
	if ( ! inner || ! options || ! items ) {
		return;
	}

	let parseOptions = btyJsonParse( options.content.textContent ),
		parseItems   = new DOMParser().parseFromString( items.innerHTML, 'text/html' );

	// Remove html template.
	options.remove();
	items.remove();

	let length = parseItems.querySelectorAll( '.sn-item' );
	if ( ! length.length ) {
		return;
	}

	// Get random item in array.
	const randomItem = function( arr = [] ) {
		return arr[ Math.floor( Math.random() * arr.length ) ];
	}

	// Display function.
	const displayFn  = function() {
		let item     = randomItem( length ),
			time     = item.querySelector( '.sn-time' ),
			customer = item.querySelector( '.sn-customer' );

		// Append time text.
		if ( time ) {
			time.innerText = randomItem( parseOptions.virtual_times );
		}

		// Append customer text.
		if ( customer ) {
			customer.innerText = randomItem( parseOptions.virtual_customers ) + parseOptions.purchased;
		}

		inner.innerHTML = item.outerHTML;

		let current = inner.querySelector( '.sn-item' );
		if ( ! current ) {
			return;
		}

		// Set animation.
		setTimeout(
			function() {
				current.classList.add( 'active' );
			},
			50
		);

		// Start loading bar when animation end.
		setTimeout(
			function() {
				current.insertAdjacentHTML( 'beforeend', '<span class="underline-animated' + ( parseOptions.loading_bar ? '' : ' visibility-hidden' ) + '"></span>' );

				// Remove notification after animation end.
				let animation = current.querySelector( '.underline-animated' );
				if ( animation ) {
					animation.addEventListener(
						'animationend',
						function() {
							current.classList.add( 'down' );
						}
					);
				}
			},
			300
		);

		// Remove notification by click to Close button.
		let closeBtn = current.querySelector( '.sn-close' );
		if ( closeBtn ) {
			closeBtn.onclick = function() {
				current.classList.add( 'down' );
			}
		}
	}

	let init, timeTotal = parseOptions.time_total * 1000;
	setTimeout(
		function() {
			displayFn();

			init = setInterval( displayFn, timeTotal );
		},
		( parseOptions.time_init * 1000 )
	);
}

// Sticky toolbar mobile.
function btyStickyToolbarMobile( doc = document ) {
	let selector = doc.querySelector( '.sticky-toolbar-mobile-section .toolbar-outer[data-direction]' ) || doc.querySelector( '.header.has-sticky' );
	if ( ! selector ) {
		return;
	}

	btyScrollingDetect();
}

// Back to top.
function btyScrollToTop() {
	window.scrollTo( 0, 0 );
}

// Counter number.
function btyCounterNumber( doc = document ) {
	let counters = doc.querySelectorAll( '.number' ),
		speed    = 200;

	counters.forEach(
		function( counter ) {
			const animate = function() {
				let value = +counter.getAttribute( 'data-number' ),
					data  = +counter.innerText,
					time  = value / speed;

				if ( data < value ) {
					counter.innerText = Math.ceil( data + time );
					setTimeout( animate, 1 );
				} else {
					counter.innerText = value;
				}
			}

			animate();
		}
	);
}

// Check element inviewport.
function btyInViewport( el ) {
	if ( ! el ) {
		return;
	}

	let rect = el.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= ( window.innerHeight || document.documentElement.clientHeight ) &&
		rect.right <= ( window.innerWidth || document.documentElement.clientWidth )
	);
};

// Check header sticky trigger.
function btyStickyHeader( doc = document ) {
	let selector = doc.querySelector( '.header.has-sticky' );
	if ( ! selector ) {
		return;
	}

	let stickyContent = selector.querySelector( '.sticky-header' );
	if ( ! stickyContent ) {
		return;
	}

	setTimeout(
		function() {
			stickyContent.parentNode.style.height = stickyContent.parentNode.offsetHeight + 'px';
		}
	);

	const stickyHeader = function() {
		if ( window.scrollY > 300 ) {
			document.body.classList.add( 'pity' );

		} else {
			document.body.classList.remove( 'pity' );
		}

		if ( window.scrollY > 500 ) {
			selector.classList.add( 'scroll-triggered' );
		} else {
			selector.classList.remove( 'scroll-triggered' );
		}

		if ( window.matchMedia( '(max-width: 991px)' ).matches ) {
			stickyContent.parentNode.removeAttribute( 'style' );
			return;
		}
	}

	// Init.
	stickyHeader();

	// Trigger.
	window.onscroll = function() {
		stickyHeader();
	}
}

// Animation for image load.
function btyAnimationImageLoad( doc = document ) {
	let images = doc.querySelectorAll( '.lazy-image' );
	if ( ! images.length ) {
		return;
	}

	const imgLazyObserver = new IntersectionObserver(
		function( entries, observer )  {
			entries.forEach(
				function( entry ) {
					if ( entry.isIntersecting ) {
						if ( entry.target.dataset.src ) {
							entry.target.src = entry.target.dataset.src;
						}

						if ( entry.target.dataset.srcSet ) {
							entry.target.srcSet = entry.target.dataset.srcSet;
						}

						observer.unobserve( entry.target );

						entry.target.classList.add( 'lazyloaded' );

						entry.target.removeAttribute( 'data-src' );
						entry.target.removeAttribute( 'data-srcset' );
					}
				}
			);
		},
		{
			threshold: 0
		}
	);

	images.forEach(
		function( img ) {
			imgLazyObserver.observe( img );
		}
	);
}

window.addEventListener(
	'scroll',
	function() {
		let section = document.querySelector( '.counter-number-section' );
		if ( btyInViewport( section ) ) {
			btyCounterNumber();
		}
	}
);

// DOM Loaded.
document.addEventListener(
	'DOMContentLoaded',
	function() {
		if ( ! Shopify.designMode ) {
			btySalesNotification();
		}

		btyAnimationImageLoad();
		btyStickyHeader();
		btyAccountPopup();
		btyBoughtTogether();
		btyCarousel();
		btyProductTabs();
		btyCountdownTime();
		btyNavMenu();
		btyCookiespopup();
		btyPopupVisit();
		btySlider();
		btyQuantityButton();
		btySideCart();
		btyDialogSearch();
		btyDialogSearchHeader();
		btyAddToCart();
		btyTabNav();
		btyUpdateProductQuantity();
		btyCollectionSlide();
		btyQuickView();
		btyCompare();
		btyAddWishlist();
		btyViewWishlist();
		btySwatch();
		btyAccordionHandle();
		btyToggleDropdown();
		btyFooterAccordion();
		btyVideo();
		btyVideoPopup();
		btyHoverMenu();
		btyHoverSearch();
		btyAddress();
		btyPickupAvailabilityInit();
		btyProductVariants();
		btyProductPopup();
		btyProductShare();
		btyScrollToTop();
		btyInViewport();

		window.addEventListener(
			'storage',
			function( e ) {
				if ( 'wishlist-ids' === e.key ) {
					btyViewWishlist();
				}
			}
		);

		window.addEventListener(
			'scroll',
			function() {
				btyStickyToolbarMobile();
				btyAnimationImageLoad();
			}
		);
	}
);

// Design mode event.
document.addEventListener(
	'shopify:section:load',
	function( e ) {
		let section = e.target;

		btyAnimationImageLoad( section );
		btyNavMenu( section );
		btyStickyHeader( section );
		btyCountdownTime( section );
		btyBoughtTogether( section );
		btyCarousel( section );
		btyProductTabs( section );
		btyAccordionHandle( section );
		btySlider( section );
		btyCollectionSlide( section );
		btyVideo( section );
		btyAddress( section );
		btyProductVariants( section );
		btyProductPopup( section );
		btyProductShare( section );
		btyCompare( section );
		btyAddWishlist( section );
		btyViewWishlist( section );

		console.log( 'Section load.' );
	}
);
document.addEventListener(
	'shopify:section:unload',
	function() {
		console.log( 'Section unload.' );
	}
);
document.addEventListener(
	'shopify:section:select',
	function( e ) {
		let section = e.target;

		btyAnimationImageLoad( section );
		btyNavMenu( section );
		btyStickyHeader( section );
		btySalesNotification( section );
		btyToggleDropdown( section );
		btyBoughtTogether( section );
		btyCarousel( section );
		btyProductTabs( section );
		btyCountdownTime( section );
		btyCompare( section );
		btyAddWishlist( section );
		btyViewWishlist( section );
		btyAccordionHandle( section );
		btyVideo( section );
		btyAddress( section );
		btyProductVariants( section );
		btyProductPopup( section );
		btyProductShare( section );

		console.log( 'Section select.' );
	}
);
document.addEventListener(
	'shopify:section:deselect',
	function() {
		console.log( 'Section deselect.' );
	}
);
document.addEventListener(
	'shopify:block:select',
	function( e ) {
		console.log( 'Block select.' );

		let section = e.target.closest( '.shopify-section' );
		if ( ! section ) {
			return;
		}

		btyProductTabs( section, e );
		btySlider( section, e );
	}
);
document.addEventListener(
	'shopify:block:deselect',
	function() {
		console.log( 'Block deselect.' );
	}
);

// Map 
function initMap() {
	var wrappers = document.querySelectorAll('.map-wrapper');
	wrappers.forEach( function( wrapper ) {
		createMap(wrapper)
	});
}  

function createMap (wrapper) {
var mapElement = wrapper.querySelector('.map');
if( ! mapElement || mapElement.classList.contains('leaflet-container') ) return;
	var id = mapElement.id;
	var map = L.map(id);

		map.createPane('labels');
	
		// This pane is above markers but below popups
		map.getPane('labels').style.zIndex = 650;
	
		// Layers in this pane are non-interactive and do not obscure mouse/touch events
		map.getPane('labels').style.pointerEvents = 'none';
		
		var cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

		var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
			attribution: cartodbAttribution
		}).addTo(map);

		var positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
			pane: 'labels'
		}).addTo(map);
		map.setView({lat: mapElement.dataset.lat, lng: mapElement.dataset.lng}, 4);
		var mapMarker = document.querySelectorAll('.address .item-address');
		mapMarker.forEach(function(item) {
			L.marker([item.dataset.lat, item.dataset.lng]).addTo(map);
		})
	}

	initMap();
	document.addEventListener('shopify:section:load', function(){
		initMap();
	})
// Button scroll to top
	// Get the button
	document.addEventListener("scroll", function() {
		scrollFunction();
	});
	let mybutton = document.getElementById("btn-back-to-top");
	function scrollFunction() {
	  if (
		document.body.scrollTop > 20 ||
		document.documentElement.scrollTop > 20
	  ) {
		mybutton.style.display = "flex";
	  } else {
		mybutton.style.display = "none";
	  }
	}
	// When the user clicks on the button, scroll to the top of the document
	mybutton.addEventListener("click", backToTop);
	
	function backToTop() {
	  document.body.scrollTop = 0;
	  document.documentElement.scrollTop = 0;
	}
