import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, TextControl } from '@wordpress/components';
import { useRef, useEffect, useState } from '@wordpress/element';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { lat, lng, zoom, style, pitch, description } = attributes;
	const [ mapObject, setMapObject ] = useState();
	const [ markerObject, setMarkerObject ] = useState();
	const [ lng, setLng ] = useState(attributes.lng);
	const [ lat, setLat ] = useState(attributes.lat);
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
			setMarkerObject(marker);

			map.on('move', function() {
				const center = map.getCenter().toArray();
				const zoom = map.getZoom().toFixed(2);
				marker.setLngLat(center);
			})
		})

	}, [mapNode, description])

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Block Settings', 'geolonia-map-blocks')}
				>
					<TextControl
						label={__('Text in Popup', 'geolonia-map-blocks')}
						value={description}
						onChange={(value) =>
							setAttributes({ description: value })
						}
					/>
					<SelectControl
						label={__('Map Style', 'geolonia-map-blocks')}
						value={style}
						onChange={(value) => {
							setAttributes({ style: value })
							mapObject.setStyle(`https://cdn.geolonia.com/style/${value}/ja.json`);
						}}
						options={[
							{
								value: 'geolonia/basic',
								label: __('Basic', 'geolonia-map-blocks'),
							},
							{
								value: 'geolonia/gsi',
								label: __('GSI', 'geolonia-map-blocks'),
							},
							{
								value: 'geolonia/homework',
								label: __('Homework', 'geolonia-map-blocks'),
							},
							{
								value: 'geolonia/midnight',
								label: __('Midnight', 'geolonia-map-blocks'),
							},
							{
								value: 'geolonia/notebook',
								label: __('Notebook', 'geolonia-map-blocks'),
							},
							{
								value: 'geolonia/red-planet',
								label: __('Red Planet', 'geolonia-map-blocks'),
							}
						]}
					/>
					<RangeControl
						label={__('Latitude', 'geolonia-map-blocks')}
						value={lat}
						onChange={(value) => {
							setAttributes({ lat: value });
							markerObject.setLngLat([lng, value])
							mapObject.setCenter([lng, value])
						}}
						min="-90"
						max="90"
						step="0.0000001"
					/>
					<RangeControl
						label={__('Longitude', 'geolonia-map-blocks')}
						value={lng}
						onChange={(value) => {
							setAttributes({ lng: value });
							markerObject.setLngLat([value, lat])
							mapObject.setCenter([value, lat])
						}}
						min="-180"
						max="180"
						step="0.0000001"
					/>
					<RangeControl
						label={__('Zoom', 'geolonia-map-blocks')}
						value={zoom}
						onChange={(value) => {
							setAttributes({ zoom: value });
							mapObject.setZoom(value);
						}}
						min="0"
						max="24"
						step="0.001"
					/>
					<RangeControl
						label={__('Pitch', 'geolonia-map-blocks')}
						value={pitch}
						onChange={(value) => {
							setAttributes({ pitch: value });
							mapObject.setPitch(value);
						}}
						min="0"
						max="60"
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
					data-marker="off"
				/>
			</div>
		</>
	);
}
