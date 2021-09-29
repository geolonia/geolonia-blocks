import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function save(props) {
	const { lat, lng, zoom, style, customStyle, pitch, bearing, description } = props.attributes;

	return (
		<div {...useBlockProps.save()}>
			<div
				className="geolonia"
				data-style={customStyle ? customStyle : style}
				data-lat={lat}
				data-lng={lng}
				data-zoom={zoom}
				data-pitch={pitch}
				data-bearing={bearing}
			>{description}</div>
		</div>
	);
}
