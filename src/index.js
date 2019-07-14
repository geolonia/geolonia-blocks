import { edit, save } from './components'
const { blocks } = window.wp

blocks.registerBlockType('tilecloud/basic', {
  title: 'TileCloud/Basic',
  icon: 'format-image',
  category: 'common',
  attributes: {
    text: {
      type: 'string',
      source: 'text',
      selector: 'span.my-text'
    }
  },
  edit,
  save
})
