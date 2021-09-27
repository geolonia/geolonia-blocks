import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useRef, useEffect } from '@wordpress/element';
import './editor.scss';

export default function Edit() {

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
		<div {...useBlockProps()}>
			<div
				ref={mapNode}
				className="geolonia"
				data-lat="34.5752847"
				data-lng="135.4807895"
				data-zoom="18.57"
				data-style="geolonia/basic"
			>株式会社Geolonia</div>
		</div>
	);
}
