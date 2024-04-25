/**
 * Main collection
 *
 * @package Dev
 */

'use strict';

// Toggle nav menu.
function btyToggleNavList( doc = document ) {
	let selectors = doc.querySelectorAll( '.link-arrow' );
	if ( ! selectors.length || 'function' !== typeof( btySlideUp ) || 'function' !== typeof( btySlideDown ) ) {
		return;
	}

	selectors.forEach(
		function( el ) {
			el.onclick = function( e ) {
				e.preventDefault();

				let linkItem = el.parentNode.parentNode,
					linkSub  = linkItem.querySelector( '.link-sub' );
				if ( ! linkSub ) {
					return;
				}

				if ( linkItem.classList.contains( 'active' ) ) {
					btySlideUp( linkSub );
					linkItem.classList.remove( 'active' );
				} else {
					btySlideDown( linkSub );
					linkItem.classList.add( 'active' );
				}

				// Remove active siblings.
				for ( let i = 0, j = linkItem.parentNode.children.length; i < j; i++ ) {
					let sb = linkItem.parentNode.children[i];
					if ( ! sb.classList.contains( 'active' ) || linkItem === sb || sb.nodeName !== linkItem.nodeName ) {
						continue;
					}

					sb.classList.remove( 'active' );
					let siblingsSub = sb.querySelector( '.link-sub' );
					if ( ! siblingsSub ) {
						continue;
					}

					btySlideUp( siblingsSub );
				}
			}
		}
	);
}

// Range slider.
function btyRangeSlider( doc = document ) {
	let selectors = doc.querySelectorAll( '.price-slider' );
	if ( ! selectors.length || 'undefined' === typeof( window.noUiSlider ) ) {
		return;
	}

	selectors.forEach(
		function( el ) {
			let template = el.querySelector( 'template' );
			if ( ! template || 'function' !== typeof( btyJsonParse ) || 'object' === typeof( el.noUiSlider ) ) {
				return;
			}

			let options = btyJsonParse( template.content.textContent ),
				input   = el.parentNode.querySelectorAll( '.price-value' );

			options.format = {
				from: function( value ) {
					return Math.round( value );
				},
				to: function( value ) {
					return Math.round( value );
				}
			};

			window.btyRangePrice = noUiSlider.create( el, options );

			// Remove template html.
			if ( template ) {
				template.remove();
			}

			// Register min/max value.
			let minValue = 0,
				maxValue = 0;

			// Update event.
			btyRangePrice.on(
				'slide',
				function( values ) {
					console.log(1);
					// Update unput value.
					if ( input.length ) {
						input.forEach(
							function( ip ) {
								let inputType  = ip.getAttribute( 'data-type' ),
									inputValue = Number( ip.value | 0 );

								if ( 'min' === inputType ) {
									minValue = inputValue;
									ip.value = values[0];
								} else if ( 'max' === inputType ) {
									ip.value = values[1];
									maxValue = inputValue;
								}
							}
						);
					}
				}
			);

			// End event.
			btyRangePrice.on(
				'change',
				function( values ) {
					console.log(input);
					// Update unput value.
					if ( input.length ) {
						let eventChange = new Event( 'change', { bubbles: true } ),
							inputVal    = [];
						input.forEach(
							function( ip ) {
								inputVal.push( Number( ip.value ) );
							}
						);

						// Trigger change event.
						input[0].dispatchEvent( eventChange );
					}
				}
			);

			// Set value.
			if ( input.length ) {
				input.forEach(
					function( ip ) {
						let inputType  = ip.getAttribute( 'data-type' ),
							inputValue = Number( ip.value || 0 );
						// When first load.
						if ( 'min' === inputType ) {
							minValue = inputValue;
						} else if ( 'max' === inputType ) {
							maxValue = inputValue;
						}

						// When input change.
						ip.oninput = function() {
							console.log(3);
							let minInput      = Number( ip.getAttribute( 'min' ) || 0 ),
								maxInput      = Number( ip.getAttribute( 'max' ) || 0 ),
								newInputValue = Number( ip.value || 0 );

							if ( newInputValue < minInput ) {
								ip.value = minInput;
							}

							if ( newInputValue > maxInput ) {
								ip.value = maxInput;
							}

							if ( 'min' === inputType ) {
								minValue = Number( ip.value || 0 );
							} else if ( 'max' === inputType ) {
								maxValue = Number( ip.value || 0 );
							}

							if ( minValue != maxValue && minValue < maxValue ) {
								btyRangePrice.set( [minValue, maxValue] );
							}
						}
					}
				);
			}
		}
	);
}

// Fetch per page item.
function btyFetchPerPage( callback, items ) {
	fetch(
		btyGlobals.cart_update_url + '/update.js',
		{
			credentials: 'same-origin',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest'
			},
			body: JSON.stringify(
				{
					attributes: {
						'collection_products_per_page': items
					}
				}
			)
		}
	).then(
		function() {
			callback();
		}
	);
}

// Pagination.
function btyPagination( callback, currentUrl ) {
	let pag = document.querySelectorAll( '.pagination a' );
	if ( ! pag.length ) {
		return;
	}

	pag.forEach(
		function( el ) {
			el.onclick = function( e ) {
				e.preventDefault();

				let page = el.getAttribute( 'data-page' ) || 2;
				currentUrl.searchParams.set( 'page', Number( page ) );

				callback( currentUrl );
			}
		}
	);
}

// Desktop filter.
function btyDesktopFilters( doc = document ) {
	let form        = doc.querySelector( '.filter-form' ),
		currentUrl  = new URL( window.location.href ),
		collections = doc.querySelector( '.collections[data-id]' );

	if ( ! collections ) {
		return;
	}

	// Toggle more filter items.
	let toggleItems = function() {
		if ( ! form ) {
			return;
		}

		let toggle = form.querySelector( '.item-list .toggle' ),
			items  = form.querySelector( '.item-list .more-items' );

		if ( ! toggle || ! items || 'function' !== typeof( btySlideUp ) || 'function' !== typeof( btySlideDown ) ) {
			return;
		}

		let more = toggle.innerText,
			less = toggle.getAttribute( 'data-toggle' ) || '';

		toggle.onclick = function() {
			if ( 'none' === window.getComputedStyle( items ).display ) {
				btySlideDown( items );
				toggle.innerText = less;
				return;
			}

			btySlideUp( items );
			toggle.innerText = more;
		}
	}

	// Toggle sort by.
	let toggleDropdown = function() {
		let toggle = collections.querySelectorAll( '.toggle-dropdown .dropdown-summary' );
		if ( ! toggle.length ) {
			return;
		}

		toggle.forEach(
			function( el ) {
				let parent = el.parentNode,
					items  = parent.querySelectorAll( 'li[data-value]' ),
					info   = parent.querySelector( '.summary-info' );
				if ( ! items.length || ! info ) {
					return;
				}

				items.forEach(
					function( fo ) {
						fo.addEventListener(
							'click',
							function() {
								// Remove old current.
								let old   = fo.parentNode.querySelector( '[data-current]' ),
									value = fo.getAttribute( 'data-value' );
								if ( old ) {
									old.removeAttribute( 'data-current' );
								}

								// Update summary text.
								info.innerText = fo.innerText;
								fo.setAttribute( 'data-current', '' );

								// Reset pagination.
								currentUrl.searchParams.delete( 'page' );

								// Update data.
								if ( parent.classList.contains( 'sort-by' ) ) {
									currentUrl.searchParams.set( 'sort_by', value );

									desktopFiltering( currentUrl );
								} else if ( parent.classList.contains( 'per-page' ) ) {
									btyFetchPerPage( desktopFiltering, value );
								}
							}
						);
					}
				);
			}
		);
	}

	// Filters.
	let sidebarFilters = function() {
		let filters = doc.querySelectorAll( '[name^="filter."]' );
		if ( ! filters.length ) {
			return;
		}

		filters.forEach(
			function( el ) {
				el.onchange = function() {
					let formData           = new FormData( form ),
						searchParamsString = window.location.pathname + '?' + new URLSearchParams( formData ).toString();

					currentUrl = new URL( searchParamsString, window.location.origin );

					desktopFiltering( currentUrl );
				}
			}
		);
	}

	// Reset filter.
	let resetFilters = function() {
		if ( ! form ) {
			return;
		}

		let selectors = form.querySelectorAll( 'a.active-filter-item' );
		if ( ! selectors.length ) {
			return;
		}

		selectors.forEach(
			function( el ) {
				el.addEventListener(
					'click',
					function( e ) {
						e.preventDefault();

						currentUrl = new URL( el.href, window.location.origin );

						desktopFiltering( currentUrl );
					}
				);
			}
		);
	}

	// Remove empty filter.
	let removeEmptyFilter = function( doc ) {
		let list = doc.querySelectorAll( '.item-list' );
		if ( ! list.length ) {
			return;
		}

		list.forEach(
			function( el ) {
				if ( el.innerHTML === '' ) {
					el.parentNode.parentNode.remove();
				}
			}
		);
	}

	// Filtering.
	let desktopFiltering = function( currentUrl ) {
		let loadingBar = document.querySelector( '.loading-bar' );
		if ( loadingBar ) {
			loadingBar.classList.add( 'active' );
			loadingBar.style.transform = 'scaleX(0.7)';
		}

		document.documentElement.setAttribute( 'data-filtering', '' );

		// Update current url.
		if ( currentUrl ) {
			window.history.pushState(
				{
					path: currentUrl.toString()
				},
				'',
				currentUrl.toString()
			);
		}

		let paramsUrl  = currentUrl && currentUrl.search ? '&' + currentUrl.search.slice( 1 ) : '',
			sectionUrl = window.location.pathname + '?section_id=' + collections.getAttribute( 'data-id' ) + paramsUrl;

		fetch( sectionUrl )
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
					let activeFilters = doc.querySelector( '.active-filter' ),
						wrapperFilter = doc.querySelector( '.filter-wrapper' ),
						toolbar       = doc.querySelector( '.toolbar' ),
						products      = doc.querySelector( '.products' );

					// Active filter.
					if ( activeFilters ) {
						activeFilters.innerHTML = btyGetSectionHtml( res, '.active-filter' );
					}

					// Filters.
					if ( wrapperFilter ) {
						let div     = document.createElement( 'div' ),
							filters = wrapperFilter.querySelectorAll( '.filter-item' );

						div.innerHTML = btyGetSectionHtml( res, '.filter-wrapper', 'outer' );

						// Loop each filter.
						if ( filters.length ) {
							filters.forEach(
								function( el ) {
									let tmpIndex       = el.getAttribute( 'data-index' ) || 0,
										tmpMoreItems   = el.querySelector( '.more-items' ),
										tmpToggleItems = el.querySelector( '.toggle' ),
										item           = div.querySelector( '.filter-item[data-index="' + tmpIndex + '"]' );

									if ( ! item ) {
										return;
									}

									// Set open state.
									if ( 'string' === typeof( el.getAttribute( 'open' ) ) ) {
										item.setAttribute( 'open', '' );
									}

									// Update toggle state, see more, see less.
									if ( tmpMoreItems && tmpToggleItems ) {
										let moreItems   = item.querySelector( '.more-items' ),
											toggleItems = item.querySelector( '.toggle' );
										if ( 'block' === window.getComputedStyle( tmpMoreItems ).display && moreItems ) {
											moreItems.style.display = 'block';

											if ( toggleItems ) {
												toggleItems.innerText = toggleItems.getAttribute( 'data-toggle' );
											}
										}
									}
								}
							);
						}

						// Remove empty filter.
						removeEmptyFilter( div );

						// Update html.
						wrapperFilter.innerHTML = btyGetSectionHtml( div.innerHTML, '.filter-wrapper' );
					}

					// Toolbar.
					if ( toolbar ) {
						toolbar.innerHTML = btyGetSectionHtml( res, '.toolbar' );
					}

					// Product grid.
					if ( products ) {
						products.innerHTML = btyGetSectionHtml( res, '.products' );
					}

					// Re-init some functions.
					toggleItems();
					sidebarFilters();
					btyPagination( desktopFiltering, currentUrl );
					btyToggleDropdown();
					resetFilters();
					btyRangeSlider( doc );
					btyDesktopFilters( doc );

					if ( 'function' === typeof( btyQuickView ) ) {
						btyQuickView( doc );
					}

					if ( 'function' === typeof( btySwatch ) ) {
						btySwatch( doc );
					}

					if ( 'function' === typeof( btyAccordionHandle ) ) {
						btyAccordionHandle( doc );
					}

					if ( 'function' === typeof( btyAddToCart ) ) {
						btyAddToCart( doc );
					}
				}
			).catch(
				function( e ) {
					console.error( e );
				}
			).finally(
				function() {
					// Toolbar update.
					let toolbar = doc.querySelector( '.toolbar' );
					if ( toolbar ) {
						let rect = toolbar.getBoundingClientRect();
						if ( rect.top < 0 ) {
							toolbar.scrollIntoView( { behavior: 'smooth' } );
						}
					}

					document.documentElement.removeAttribute( 'data-filtering' );

					// Loading bar.
					if ( loadingBar ) {
						loadingBar.style.transform = 'scaleX(1)';
						loadingBar.setAttribute( 'data-finished', '' );

						loadingBar.addEventListener(
							'transitionend',
							function( e ) {
								if ( 'transform' === e.propertyName && 'string' === typeof( loadingBar.getAttribute( 'data-finished' ) ) ) {
									loadingBar.classList.remove( 'active' );
									loadingBar.removeAttribute( 'data-finished' );
									loadingBar.style.transform = 'scaleX(0)';
								}
							}
						);
					}
				}
			);
	}

	sidebarFilters();
	toggleItems();
	toggleDropdown();
	resetFilters();
	removeEmptyFilter( doc );

	if ( window.matchMedia( '(min-width: 992px)' ).matches ) {
		btyPagination( desktopFiltering, currentUrl );
	}
}

// Mobile filters.
function btyMobileFilters( doc = document ) {
	let collections = doc.querySelector( '.collections[data-id]' ),
		wrapper     = collections ? collections.querySelector( '.mobile-filter' ) : false,
		open        = wrapper ? wrapper.querySelector( '.filter-sort' ) : false,
		close       = wrapper ? wrapper.querySelector( '.close-button' ) : false,
		back        = wrapper ? wrapper.querySelector( '.back-button' ) : false,
		active      = wrapper ? wrapper.querySelector( '.mobile-active-filter' ) : false,
		modal       = wrapper ? wrapper.querySelector( '.mobile-filter-modal' ) : false,
		form        = wrapper ? wrapper.querySelector( '.mobile-filter-form' ) : false,
		items       = form ? form.querySelectorAll( '.filter-item' ) : [],
		reset       = form ? form.querySelector( '.form-footer .active-filter-item' ) : false,
		submit      = form ? form.querySelector( '[type="submit"]' ) : false;

	if ( ! open || ! close || ! back || ! items.length || ! modal || ! reset || ! submit ) {
		return;
	}

	let currentUrl = new URL( window.location.href );

	// Remove filter.
	const removeFilter = function() {
		let selectors = wrapper.querySelectorAll( 'a.active-filter-item' );
		if ( ! selectors.length ) {
			return;
		}

		selectors.forEach(
			function( el ) {
				el.addEventListener(
					'click',
					function( e ) {
						e.preventDefault();

						currentUrl = new URL( el.href, window.location.origin );

						mobileFiltering( currentUrl );
					}
				);
			}
		);
	}

	// Filtering.
	let mobileFiltering = function( currentUrl ) {
		let loadingBar = document.querySelector( '.loading-bar' );
		if ( loadingBar ) {
			loadingBar.classList.add( 'active' );
			loadingBar.style.transform = 'scaleX(0.7)';
		}

		document.documentElement.setAttribute( 'data-filtering', '' );

		// Update current url.
		if ( currentUrl ) {
			window.history.pushState(
				{
					path: currentUrl.toString()
				},
				'',
				currentUrl.toString()
			);
		}

		let paramsUrl  = currentUrl && currentUrl.search ? '&' + currentUrl.search.slice( 1 ) : '',
			sectionUrl = window.location.pathname + '?section_id=' + collections.getAttribute( 'data-id' ) + paramsUrl;

		fetch( sectionUrl )
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
					// Active filter.
					if ( active ) {
						active.innerHTML = btyGetSectionHtml( res, '.mobile-active-filter' );
					}

					// Product count.
					let productCount = wrapper.querySelector( '.product-count' );
					if ( productCount ) {
						productCount.innerHTML = btyGetSectionHtml( res, '.product-count' );
					}

					// Filters.
					if ( modal ) {
						modal.innerHTML = btyGetSectionHtml( res, '.mobile-filter-modal' );
					}

					// Product grid.
					let products = doc.querySelector( '.products' );
					if ( products ) {
						products.innerHTML = btyGetSectionHtml( res, '.products' );
					}

					// Re-init some functions.
					btyMobileFilters( doc );
					btyRangeSlider( doc );

					if ( 'function' === typeof( btySwatch ) ) {
						btySwatch( doc );
					}

					if ( 'function' === typeof( btyAddToCart ) ) {
						btyAddToCart( doc );
					}

					// Remove filter.
					removeFilter();

					// Update per page items.
					perPageItems();

					// Pagintaion.
					btyPagination( mobileFiltering, currentUrl );
				}
			).catch(
				function( e ) {
					console.error( e );
				}
			).finally(
				function() {
					document.documentElement.removeAttribute( 'data-filtering' );

					// Loading bar.
					if ( loadingBar ) {
						loadingBar.style.transform = 'scaleX(1)';
						loadingBar.setAttribute( 'data-finished', '' );

						loadingBar.addEventListener(
							'transitionend',
							function( e ) {
								if ( 'transform' === e.propertyName && 'string' === typeof( loadingBar.getAttribute( 'data-finished' ) ) ) {
									loadingBar.classList.remove( 'active' );
									loadingBar.removeAttribute( 'data-finished' );
									loadingBar.style.transform = 'scaleX(0)';
								}
							}
						);
					}
				}
			);
	}

	// Per page item.
	const perPageItems = function() {
		let perPage = form.querySelectorAll( '.list-per-page input' );
		if ( ! perPage.length ) {
			return;
		}

		perPage.forEach(
			function( el ) {
				el.onclick = function() {
					btyFetchPerPage( mobileFiltering, el.value );
				}
			}
		);
	}

	// Toggle filter.
	wrapper.onclick = function( e ) {
		let target = e.target;

		if ( open === target ) {
			wrapper.classList.add( 'is-open' );
		}

		// Hide model.
		if ( close === target || modal === target || submit === target || 'per_page' === target.name ) {
			wrapper.classList.remove( 'is-open' );
		}

		// Remove transform state.
		if ( back === target || reset === target || submit === target || 'per_page' === target.name ) {
			let activeItem = form.querySelector( '.filter-item.active' );
			if ( activeItem ) {
				activeItem.classList.remove( 'active' );
			}

			wrapper.classList.remove( 'transform' );
		}

		// Submit.
		if ( submit === target ) {
			e.preventDefault();

			let formData           = new FormData( form ),
				searchParamsString = window.location.pathname + '?' + new URLSearchParams( formData ).toString();

			currentUrl = new URL( searchParamsString, window.location.origin );

			mobileFiltering( currentUrl );
		}
	}

	// Show filter.
	items.forEach(
		function( el ) {
			let heading = el.querySelector( '.filter-heading' ),
				content = el.querySelector( '.filter-content' );

			if ( ! heading || ! content ) {
				return;
			}

			heading.onclick = function() {
				wrapper.classList.add( 'transform' );
				el.classList.add( 'active' );
			}
		}
	);

	removeFilter();
	perPageItems();

	if ( window.matchMedia( '(max-width: 991px)' ).matches ) {
		btyPagination( mobileFiltering, currentUrl );
	}
}

// DOM Loaded.
document.addEventListener(
	'DOMContentLoaded',
	function() {
		btyToggleNavList();
		btyRangeSlider();
		btyDesktopFilters();
		btyMobileFilters();
	}
);

document.addEventListener(
	'shopify:section:select',
	function( e ) {
		btyToggleNavList( e.target );
		btyRangeSlider( e.target );
		btyDesktopFilters( e.target );
		btyMobileFilters( e.target );
	}
);
