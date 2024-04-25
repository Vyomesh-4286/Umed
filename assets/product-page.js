/**
 * Product page
 *
 * @package Dev
 */

/* global btyMainSlideOptions, btyThumbSlideOptions */

'use strict';

// Gallery slide layout.
function btyProductGallery( doc = document ) {
	let gallery       = doc.querySelector( '.gallery-media' ),
		container     = gallery ? gallery.closest( '.main-product' ) : false,
		layout        = container ? container.getAttribute( 'data-gallery' ) : false,
		mainSelector  = gallery ? gallery.querySelector( '.product-main-slide' ) : false,
		thumbSelector = gallery ? gallery.querySelector( '.product-thumb-slide' ) : false;

	if (
		! mainSelector ||
		'undefined' === typeof( Swiper ) ||
		( ( 'vertical' === layout || 'grid' === layout ) && window.matchMedia( '(min-width: 992px)' ).matches )
	) {
		return;
	}

	// Thumb slide.
	if ( thumbSelector ) {
		window.btyThumbSlider = new Swiper( thumbSelector, btyThumbSlideOptions );

		// Center when there are only a few slides.
		let thumbWrap = thumbSelector.querySelector( '.swiper-wrapper' );
		if ( thumbWrap ) {
			let lastThumb = thumbWrap.children[ thumbWrap.children.length - 1 ];
			if ( lastThumb.swiperSlideOffset + lastThumb.offsetWidth - mainSelector.offsetWidth < 0 ) {
				thumbWrap.classList.add( 'flex-justify-center' );
			}
		}
	}

	// Set Thumb slide control for Main slide.
	if ( 'horizontal' === layout ) {
		btyMainSlideOptions.thumbs = {
			swiper: window.btyThumbSlider
		}
	}

	// Main slide.
	window.btyMainSlider = new Swiper( mainSelector, btyMainSlideOptions );

	window.btyMainSlider.on(
		'slideChange',
		function() {
			btyMediaAction();
		}
	);
}

// Gallery layout list.
function btyGalleryList( doc = document ) {
	let list = doc.querySelector( '[data-gallery="vertical"]' );
	if ( ! list || window.matchMedia( '(max-width: 991px)' ).matches ) {
		return;
	}

	let headerSticky       = document.querySelector( '.header.has-sticky' ),
		headerStickyHeight = headerSticky ? headerSticky.offsetHeight : 0;

	// Active current image item.
	const activeThumb = function() {
		let imagesItem = list.querySelectorAll( '.main-item' );
		if ( ! imagesItem.length ) {
			return;
		}

		for ( let i = 0, j = imagesItem.length; i < j; i++ ) {
			let rect       = imagesItem[i].getBoundingClientRect(),
				style      = window.getComputedStyle( imagesItem[i] ),
				marginBot  = parseInt( style.marginBottom ),
				itemHeight = rect.height,
				itemTop    = rect.top - headerStickyHeight,
				thumbIndex = i + 1,
				thumbItem  = list.querySelector( '.gallery-thumbs .media-preview-wrap:nth-child(' + thumbIndex + ')' );

			if ( ! thumbItem ) {
				return;
			}

			// Add 1 value for compatibility display.
			if ( itemTop <= 1 && ( ( itemTop + marginBot - 1 ) >= itemHeight * -1 ) ) {
				thumbItem.classList.add( 'active' );
			} else {
				thumbItem.classList.remove( 'active' );
			}
		}
	}

	// Scroll to image item.
	const scrollToImage = function() {
		let thumbItems = list.querySelectorAll( '.gallery-thumbs .media-preview-wrap' );
		if ( ! thumbItems.length ) {
			return;
		}

		for ( let i = 0, j = thumbItems.length; i < j; i++ ) {
			thumbItems[i].onclick = function() {
				let imageItem = list.getElementsByClassName( 'main-item' )[i];
				if ( ! imageItem ) {
					return;
				}

				imageItem.scrollIntoView( { behavior: 'smooth' } );
			}
		}
	}

	// Init.
	activeThumb();
	scrollToImage();

	// Trigger.
	window.onscroll = function() {
		activeThumb();
	}

	window.onload = function() {
		activeThumb();
	}
}

// Hover zoom image for gallery.
function btyGalleryZoom( doc = document ) {
	let selectors = doc.querySelectorAll( '.media-preview-wrap[data-zoom]' );
	if ( ! selectors.length ) {
		return;
	}

	selectors.forEach(
		function( item ) {
			item.onmousemove = function( e ) {
				let x          = e.offsetX / item.offsetWidth * 100,
					y          = e.offsetY / item.offsetHeight * 100,
					imgFullSrc = item.getAttribute( 'data-zoom' ),
					newImage   = new Image();

				if ( ! imgFullSrc ) {
					return;
				}

				item.classList.add( 'zooming' );

				newImage.crossOrigin = 'anonymous';

				let productImg = item.getAttribute( 'data-key' ) || false;

				// Set background image only first time.
				if ( ! item.style.backgroundImage ) {
					if ( sessionStorage.getItem( productImg ) ) {
						item.style.backgroundImage = 'url(' + sessionStorage.getItem( productImg ) + ')';
					} else {
						item.classList.add( 'loading' );

						newImage.onload = function() {
							let imageSrc = btyGetImageSrc( newImage );

							if ( productImg ) {
								sessionStorage.setItem( productImg, imageSrc );
							}

							item.style.backgroundImage = 'url(' + imageSrc + ')';
							item.classList.remove( 'loading' );
						}

						newImage.src = imgFullSrc;

						newImage.onerror = function() {
							item.classList.remove( 'loading' );
							console.log( 'Error! Loading Image.' );
						}
					}
				}

				// Set background position when hover.
				item.style.backgroundPosition = x + '% ' + y + '%';
			}

			// Remove BG properties when mouse leave.
			item.onmouseleave = function() {
				item.classList.remove( 'zooming' );
				item.style.backgroundImage    = '';
				item.style.backgroundPosition = '';
			}
		}
	);
}

// Photoswipe handle.
function btyPhotoswipeHandle( doc = document ) {
	// parse slide data (url, title, dimension ...) from DOM elements (children of gallerySelector).
	let parseThumbnailElements = function( el ) {
		let thumbElements = el.querySelectorAll( '.media-preview-wrap' ),
			items         = [],
			wrapEl, dimension, item;

		if ( ! thumbElements.length ) {
			return;
		}

		for ( let i = 0, ij = thumbElements.length; i < ij; i++ ) {
			wrapEl = thumbElements[ i ];

			// include only element nodes.
			if ( 'DIV' !== wrapEl.tagName ) {
				continue;
			}

			dimension = wrapEl.getAttribute( 'data-dimension' );
			if ( ! dimension ) {
				continue;
			}

			dimension = dimension.split( 'x' );

			// create slide object.
			item = {
				src: wrapEl.getAttribute( 'data-zoom' ),
				w: parseInt( dimension[0], 10 ),
				h: parseInt( dimension[1], 10 ),
				position: Number( wrapEl.getAttribute( 'data-pos' ) )
			};

			if ( wrapEl.children.length > 0 ) {
				// <img> thumbnail element, retrieving thumbnail url.
				item.msrc = wrapEl.children[0].getAttribute( 'src' );
			}

			item.el = wrapEl; // save link to element for getThumbBoundsFn.
			items.push( item );
		}

		return items;
	};

	// find nearest parent element.
	let closest = function closest( el, fn ) {
		return el && ( fn( el ) ? el : closest( el.parentNode, fn ) );
	};

	// triggers when user clicks on thumbnail.
	let onThumbnailsClick = function( e ) {
		e = e || window.event;
		e.preventDefault ? e.preventDefault() : e.returnValue = false;

		let eTarget = e.target || e.srcElement;

		// find root element of slide.
		let clickedListItem = closest(
			eTarget,
			function( el ) {
				return ( el.tagName && 'DIV' === el.tagName );
			}
		);

		if ( ! clickedListItem ) {
			return;
		}

		// find index of clicked item by looping through all child nodes
		// alternatively, you may define index via data- attribute.
		let clickedGallery = clickedListItem.parentNode.parentNode,
			childNodes     = clickedGallery.childNodes,
			nodeIndex      = 0,
			index;

		for ( let i = 0, j = childNodes.length; i < j; i++ ) {
			if ( childNodes[ i ].nodeType !== 1 ) {
				continue;
			}

			if ( ! childNodes[ i ].querySelector( '[data-dimension]' ) ) {
				continue;
			}

			if ( childNodes[ i ] === clickedListItem.parentNode ) {
				index = nodeIndex;
				break;
			}
			nodeIndex++;
		}

		if ( index >= 0 ) {
			// open PhotoSwipe if valid index found.
			openPhotoSwipe( index, clickedGallery );
		}

		return false;
	};

	// parse picture index and gallery index from URL (#&pid=1&gid=2).
	let photoswipeParseHash = function() {
		let hash   = window.location.hash.substring( 1 ),
			params = {};

		if ( hash.length < 5 ) {
			return params;
		}

		let vars = hash.split( '&' );
		for ( let i = 0, ij = vars.length; i < ij; i++ ) {
			if ( ! vars[ i ] ) {
				continue;
			}
			let pair = vars[ i ].split( '=' );
			if ( pair.length < 2 ) {
				continue;
			}
			params[ pair[0] ] = pair[1];
		}

		if ( params.gid ) {
			params.gid = parseInt( params.gid, 10 );
		}

		return params;
	};

	// open photoswipe.
	let openPhotoSwipe = function( index, galleryElement, disableAnimation, fromURL ) {
		let pswpElement = doc.querySelector( '.pswp' ),
			gallery,
			options,
			items;

		items = parseThumbnailElements( galleryElement );

		// define options (if needed).
		options = {
			// define gallery index (for URL).
			galleryUID: galleryElement.getAttribute( 'data-pswp-uid' ),
			getThumbBoundsFn: function( index ) {
				// See Options -> getThumbBoundsFn section of documentation for more info.
				let thumbnail   = items[ index ].el.querySelector( 'img' ), // find thumbnail.
					pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
					rect        = thumbnail.getBoundingClientRect();

				return {
					x: rect.left,
					y: rect.top + pageYScroll,
					w: rect.width
				};
			}
		};

		// PhotoSwipe opened from URL.
		if ( fromURL ) {
			if ( options.galleryPIDs ) {
				// parse real index when custom PIDs are used
				// http://photoswipe.com/documentation/faq.html#custom-pid-in-url.
				for ( let j = 0, ji = items.length; j < ji; j++ ) {
					if ( items[ j ].pid == index ) {
						options.index = j;
						break;
					}
				}
			} else {
				// in URL indexes start from 1.
				options.index = parseInt( index, 10 ) - 1;
			}
		} else {
			options.index = parseInt( index, 10 );
		}

		// exit if index not found.
		if ( isNaN( options.index ) ) {
			return;
		}

		if ( disableAnimation ) {
			options.showAnimationDuration = 0;
		}

		// Pass data to PhotoSwipe and initialize it.
		gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options );
		gallery.init();

		// Update current slide for Swiper.
		gallery.listen(
			'afterChange',
			function( e ) {
				if ( 'object' === typeof( window.btyMainSlider ) ) {
					let pos = gallery.items[ gallery.getCurrentIndex() ].position - 1;
					window.btyMainSlider.slideTo( pos, 0 );
				}
			}
		);
	};

	// loop through all gallery elements and bind events.
	let galleryElements = doc.querySelectorAll( '.product-main-slide .swiper-wrapper' );
	if ( galleryElements.length ) {
		for ( let i = 0, l = galleryElements.length; i < l; i++ ) {
			galleryElements[ i ].setAttribute( 'data-pswp-uid', i + 1 );
			galleryElements[ i ].onclick = onThumbnailsClick;
		};

		// Parse URL and open gallery if it contains #&pid=3&gid=1.
		let hashData = photoswipeParseHash();
		if ( hashData.pid && hashData.gid ) {
			openPhotoSwipe( hashData.pid, galleryElements[ hashData.gid - 1 ], true, true );
		};
	}
}

// Setup Shopify-XR library.
function btySetupXr() {
	if ( ! window.ShopifyXR ) {
		document.addEventListener(
			'shopify_xr_initialized',
			function() {
				btySetupXr();
			}
		);
	} else {
		let modelConfig = document.getElementById( 'product-model-config' );
		if ( ! modelConfig ) {
			return;
		}

		window.ShopifyXR.addModels( JSON.parse( modelConfig.textContent ) );
		window.ShopifyXR.setupXRElements();

		// Remove config after loaded.
		modelConfig.remove();
	}
}

// Setup Model viewer UI.
function btySetupModelViewerUI( errors ) {
	if ( errors ) {
		return;
	}

	let modelLoaded = document.querySelectorAll( '.media-loaded model-viewer' );
	if ( ! modelLoaded.length ) {
		return;
	}

	modelLoaded.forEach(
		function( model ) {
			const modelViewerUI = new Shopify.ModelViewerUI( model );
		}
	);
}

// Detect model exit.
function btyModelExit() {
	document.addEventListener(
		'click',
		function( e ) {
			let el   = e.target,
				node = document.querySelector( '.product-main-slide' ) ? '.product-main-slide' : '.single-media';

			if ( ! el.closest( node ) ) {
				btyMediaAction();
			}
		}
	);
}

// Action for media.
function btyMediaAction( el = document, type = 'pause' ) {
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
					vd.contentWindow.postMessage( '{"event":"command","func":"pauseVideo","args":""}', '*' );
				} else if ( vd.classList.contains( 'js-vimeo' ) ) {
					vd.contentWindow.postMessage( '{"method":"pause"}', '*' );
				}
			}
		);
	}
}

// Load model.
function btyLoadModel( doc = document ) {
	let button = doc.querySelectorAll( '.main-item' );
	if ( ! button.length ) {
		return;
	}

	button.forEach(
		function( el ) {
			el.addEventListener(
				'click',
				function() {
					let wrapper = el.querySelector( '.media-preview-wrap' );

					// Play current media.
					btyMediaAction( wrapper, 'play' );

					if ( wrapper.classList.contains( 'media-loaded' ) ) {
						return;
					}

					let template = wrapper.querySelector( 'template' ),
						mediaDiv = wrapper.querySelector( '.media-content' );

					if ( ! mediaDiv ) {
						wrapper.classList.add( 'media-loaded' );

						if ( template ) {
							wrapper.insertAdjacentHTML( 'beforeend', '<div class="media-content">' + template.innerHTML + '</div>' );
						}
					}

					// Remove model after loaded, inside <template> tag.
					if ( template ) {
						template.remove();
					}

					// Click anywhere outside to close media.
					btyModelExit();

					// Run XR.
					if ( 'string' === typeof( wrapper.getAttribute( 'data-model' ) ) ) {
						let obj = {
							model3dId: wrapper.getAttribute( 'data-id' )
						}
						window.ShopifyXR.launchXR( obj );
						// With viewer UI.
						window.Shopify.loadFeatures(
							[
								{
									name: 'model-viewer-ui',
									version: '1.0',
									onLoad: btySetupModelViewerUI,
								}
							]
						);
					}
				}
			);
		}
	);
}

// Product recommendations.
function btyProductRecommendations( doc = document ) {
	let selectors = doc.querySelectorAll( '.product-recommendations' );
	if ( ! selectors.length ) {
		return;
	}

	selectors.forEach(
		function( el ) {
			let url = el.getAttribute( 'data-url' );

			if ( el.innerHTML.trim() || ! url ) {
				return;
			}

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
						el.innerHTML = btyGetSectionHtml( res, '.product-recommendations' );

						btyAddToCart( doc );
						btyQuickView( doc );
						btySwatch( doc );
						btyCarousel( doc );
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
		window.Shopify.loadFeatures(
			[
				{
					name: 'shopify-xr',
					version: '1.0',
					onLoad: btySetupXr
				}
			]
		);

		btyProductGallery();
		btyGalleryZoom();
		btyGalleryList();
		btyPhotoswipeHandle();
		btyLoadModel();
		btyProductRecommendations();
	}
);

document.addEventListener(
	'shopify:section:load',
	function( e ) {
		let section = e.target.closest( 'section.shopify-section' );

		setTimeout(
			function() {
				btyProductRecommendations( section );
			}
		);
	}
);

document.addEventListener(
	'shopify:section:select',
	function( e ) {
		let section = e.target;

		btyProductGallery( section );
		btyGalleryZoom( section );
		btyPhotoswipeHandle( section );
		btyGalleryList( section );

		setTimeout(
			function() {
				btyProductRecommendations( section );
			}
		);
	}
);

document.addEventListener(
	'shopify:block:select',
	function( e ) {
		let section = e.target.closest( '.shopify-section' );
		if ( ! section ) {
			return;
		}

		btySlider( section, e );
		btyProductGallery( section );
		btyGalleryZoom( section );
		btyPhotoswipeHandle( section );
		btyGalleryList( section );
	}
);
