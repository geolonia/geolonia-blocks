import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useRef, useEffect, useState } from '@wordpress/element';
import './editor.scss';

function getLang() {
  const lang = (
    window.navigator.languages &&
    window.navigator.languages[0] &&
    window.navigator.languages[0].toLowerCase()
  ) || window.navigator.language.toLowerCase();

  if (lang === 'ja' || lang === 'ja-jp') {
    return 'ja';
  } else {
    return 'en';
  }
}

export default function Edit({ attributes, setAttributes }) {
	const { lat, lng, zoom, style, pitch, bearing, description } = attributes;
	const [ mapObject, setMapObject ] = useState();
	const mapNode = useRef(null);

	useEffect(() => {
		if (!mapNode.current) {
			return
		}

		const { geolonia } = window;
		const map = new geolonia.Map({
			container: mapNode.current,
		});

		let marker;
		const markerColor = '#E4402F';
		if (description) {
			const popup = new window.geolonia.Popup({ offset: [0, -25] }).setHTML(description);
			marker = new window.geolonia.Marker({ color: markerColor }).setLngLat([lng, lat]).addTo(map).setPopup(popup);
			marker.getElement().classList.add('geolonia-clickable-marker');
		} else {
			marker = new window.geolonia.Marker({ color: markerColor }).setLngLat([lng, lat]).addTo(map);
		}

		map.on('load', function() {
			setMapObject(map);
		})

		map.on('move', function() {
			const center = map.getCenter().toArray();
			marker.setLngLat(center);
		})

		map.on('moveend', function() {
			const center = map.getCenter().toArray();
			const zoom = map.getZoom().toFixed(2);
			const pitch = map.getPitch();
			const bearing = map.getBearing();

			setAttributes({lng: center[0]});
			setAttributes({lat: center[1]});
			setAttributes({zoom: parseFloat(zoom)});
			setAttributes({pitch});
			setAttributes({bearing});
		})

	}, [mapNode, description])

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Block Settings', 'geolonia-blocks')}
				>
					<SelectControl
						label={__('Map Style', 'geolonia-blocks')}
						value={style}
						onChange={(value) => {
							setAttributes({ style: value })
							const lang = getLang();
							mapObject.setStyle(`https://cdn.geolonia.com/style/${value}/${lang}.json`);
						}}
						options={[
							{
								value: 'geolonia/basic',
								label: __('Basic', 'geolonia-blocks'),
							},
							{
								value: 'geolonia/gsi',
								label: __('GSI', 'geolonia-blocks'),
							},
							{
								value: 'geolonia/homework',
								label: __('Homework', 'geolonia-blocks'),
							},
							{
								value: 'geolonia/midnight',
								label: __('Midnight', 'geolonia-blocks'),
							},
							{
								value: 'geolonia/notebook',
								label: __('Notebook', 'geolonia-blocks'),
							},
							{
								value: 'geolonia/red-planet',
								label: __('Red Planet', 'geolonia-blocks'),
							}
						]}
					/>
					<TextControl
						label={__('Text in Popup', 'geolonia-blocks')}
						value={description}
						onChange={(value) =>
							setAttributes({ description: value })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>
				<div
					ref={mapNode}
					className="geolonia"
					data-lat={lat}
					data-lng={lng}
					data-zoom={zoom}
					data-style={style}
					data-pitch={pitch}
					data-bearing={bearing}
					data-marker="off"
				/>
			</div>
		</>
	);
}
