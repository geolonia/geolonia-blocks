export const edit = ({ attributes, setAttributes }) => {
  const onChange = event => setAttributes({ text: event.target.value })
  return (
    <div>
      <input value={attributes.text} onChange={onChange} type={'text'} />
    </div>
  )
}

export const save = ({ attributes }) => {
  return (
    <div
		style={{width: '100%', height: 500}}
		className={'geolonia'}
		data-lat={50}
		data-log={123}
		data-zoom={2}
		>
      <span className={'my-text'}>{`${attributes.text}`}</span>
    </div>
  )
}
