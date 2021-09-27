import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function save() {

	return (
		<div {...useBlockProps.save()}>
			<div
				className="geolonia"
				data-lat="34.5752847"
				data-lng="135.4807895"
				data-zoom="18.57"
				data-style="geolonia/basic"
				data-pitch="0"
			>株式会社Geolonia</div>
		</div>
	);
}
