import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, TextControl } from '@wordpress/components';
import { useRef, useEffect } from '@wordpress/element';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { lat, lng, zoom, style, pitch, description } = attributes;

	const mapNode = useRef(null);

	useEffect(() => {
		if (!mapNode.current) {
			return
		}

		const { geolonia } = window;
		new geolonia.Map({
			container: mapNode.current,
		});

	}, [mapNode])

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
						onChange={(value) => setAttributes({ style: value })}
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
						}}
						min="0"
						max="24"
					/>
					<RangeControl
						label={__('Pitch', 'geolonia-map-blocks')}
						value={pitch}
						onChange={(value) => {
							setAttributes({ pitch: value });
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
				>{description}</div>
			</div>
		</>
	);
}
