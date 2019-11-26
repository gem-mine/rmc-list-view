# rmc-list-view
---

list view ui component for react (mobile web)

## install
```
npm i @gem-mine/rmc-list-view
```

## Usage

```js
import React from 'react'
import { ListView } from '@gem-mine/rmc-list-view'

const dataSource = ['A', 'B', 'C', 'D', 'E', 'F']

class Demo extends React.Component {
  renderItem = (data) => (
    <div>{data}</div>
  )

  render() {
    return (
      <ListView
        dataSource={dataSource}
        renderItem={this.renderItem}
      >
    )
  }
}
```

## Development

```
npm install
npm run watch-tsc
npm start
```

## Example

http://127.0.0.1:8000/examples/

## API

### props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>dataSource</td>
          <td>object[]</td>
          <td></td>
          <td>data source</td>
        </tr>
        <tr>
          <td>renderItem</td>
          <td>(data, index) => ReactNode</td>
          <td></td>
          <td>Takes a data entry from the data source and its ids and should return a renderable component to be rendered as the row</td>
        </tr>
        <tr>
          <td>renderHeader</td>
          <td>() => ReactNode</td>
          <td></td>
          <td>the ListView header</td>
        </tr>
        <tr>
          <td>renderFooter</td>
          <td>() => ReactNode</td>
          <td></td>
          <td>the ListView footer</td>
        </tr>
        <tr>
          <td>sections</td>
          <td>string[]</td>
          <td></td>
          <td>the section data</td>
        </tr>
        <tr>
          <td>renderSection</td>
          <td>(data) => ReactNode</td>
          <td></td>
          <td>render section</td>
        </tr>
        <tr>
          <td>pageSize</td>
          <td>number</td>
          <td>1</td>
          <td>Number of rows to render per loop</td>
        </tr>
        <tr>
          <td>initialListSize</td>
          <td>number</td>
          <td>10</td>
          <td>How many rows to render on initial component mount</td>
        </tr>
        <tr>
          <td>onEndReachedThreshold</td>
          <td>number</td>
          <td>10</td>
          <td>Threshold in pixels for calling onEndReached</td>
        </tr>
        <tr>
          <td>onEndReached</td>
          <td>() => void</td>
          <td></td>
          <td>Called when all rows have been rendered and the list has been scrolled to within onEndReachedThreshold of the bottom</td>
        </tr>
        <tr>
          <td>onScroll</td>
          <td>(e) => void</td>
          <td></td>
          <td>Fires at most once per frame during scrolling. The frequency of the events can be controlled using the scrollEventThrottle prop</td>
        </tr>
        <tr>
          <td>scrollEventThrottle</td>
          <td>number</td>
          <td>50</td>
          <td>This controls how often the scroll event will be fired while scrolling</td>
        </tr>
        <tr>
          <td>renderBodyComponent</td>
          <td>() => ReactNode</td>
          <td></td>
          <td>render listview body wrapper component</td>
        </tr>
        <tr>
          <td>useBodyScroll</td>
          <td>boolean</td>
          <td>false</td>
          <td>use html body scroll</td>
        </tr>
        <tr>
          <td>pullToRefresh</td>
          <td>React.ReactElement</td>
          <td></td>
          <td>pullToRefresh container element </td>
        </tr>
        <tr>
          <td>renderSectionWrapper</td>
          <td>React.ReactElement</td>
          <td></td>
          <td>render listview section wrapper component</td>
        </tr>
    </tbody>
</table>

## Test Case

```
npm test
```

## Coverage

```
npm run coverage
```

open coverage/ dir

## License

MIT
