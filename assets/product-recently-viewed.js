/**
 * Product recently viewed
 *
 * @package Dev
 */

'use strict';

function btyRecentlyProduct( doc = document ) {
	let selectors = doc.querySelectorAll( '.product-recently-viewed' );
	if ( 'undefined' === typeof( Storage ) || ! btyGlobals.last_product_id || ! selectors.length ) {
		return;
	}

	let recently_viewed = [],
		product_id      = btyGlobals.last_product_id;

	recently_viewed.push( product_id );

	// First set new product id.
	if ( ! localStorage.getItem( 'recently-viewed' ) ) {
		localStorage.setItem( 'recently-viewed', JSON.stringify( recently_viewed ) );
	} else if ( ! localStorage.getItem( 'recently-viewed' ).includes( product_id ) ) {
		// Add new product id.
		let parse_storage = JSON.parse( localStorage.getItem( 'recently-viewed' ) );

		parse_storage.push( product_id );

		localStorage.setItem( 'recently-viewed', JSON.stringify( parse_storage ) );
	}

	let ids = localStorage.getItem( 'recently-viewed' );
	if ( ! ids ) {
		return;
	}

	ids = JSON.parse( ids );

	// Remove current product id, if template is product.
	if ( btyGlobals.is_product === btyGlobals.last_product_id ) {
		ids.splice( ids.indexOf( btyGlobals.is_product ), 1 );
	}

	let params,
		url = window.location.origin;

	params = ids.map(
		function( id ) {
			return 'id:' + id;
		}
	).join( ' OR ' );

	selectors.forEach(
		function( el ) {
			let data_url = el.getAttribute( 'data-url' ),
				section  = el.closest( '.shopify-section' );
			if ( ! data_url || ! section ) {
				return;
			}

			url += data_url + params;

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
						let dom    = new DOMParser().parseFromString( res, 'text/html' ),
							viewed = dom.querySelector( '.product-recently-viewed' );

						if ( ! viewed || ! viewed.innerHTML.trim() ) {
							section.classList.remove( 'has-products-recently' );
							return;
						}

						// Insert dom.
						el.innerHTML = viewed.innerHTML;

						section.classList.add( 'has-products-recently' );

						btyAddToCart( doc );
						btyCarousel( doc );

						// Remove data url.
						el.removeAttribute( 'data-url' );
					}
				).catch(
					function( err ) {
						console.log( err );
					}
				);
		}
	);
}

document.addEventListener(
	'DOMContentLoaded',
	function() {
		btyRecentlyProduct();
	}
);

document.addEventListener(
	'shopify:section:load',
	function( e ) {
		let section = e.target.closest( 'section.shopify-section' );

		setTimeout(
			function() {
				btyRecentlyProduct( section );
			}
		);
	}
);

document.addEventListener(
	'shopify:block:select',
	function( e ) {
		let section = e.target.closest( 'section.shopify-section' );

		setTimeout(
			function() {
				btyRecentlyProduct( section );
			}
		);
	}
);
