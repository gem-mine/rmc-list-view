/* eslint no-console:0 */
import 'rmc-list-view/assets/index.less';
import ListView from 'rmc-list-view';
import React from 'react';
import ReactDOM from 'react-dom';

const dataSource = [
  {
    category: 'A',
    data: ['A1', 'A2', 'A3', 'A4']
  },
  {
    category: 'B',
    data: ['B1', 'B2', 'B3', 'B4']
  },
  {
    category: 'C',
    data: ['C1', 'C2', 'C3', 'C4']
  },
  {
    category: 'D',
    data: ['D1', 'D2', 'D3', 'D4']
  },
]

const sections = ['A', 'B', 'C', 'D']

class Sections extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataSource: dataSource
    }
  }

  renderHeader = () => {
    return 'header'
  }

  renderFooter = () => {
    return 'footer'
  }

  renderItem(data, index) {
    return <div key={index}>{`${data}-${index}`}</div>
  }

  handleOnEndReached = () => {
    console.log('end')
  }

  renderSection = (data) => {
    return data
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderHeader={this.renderHeader}
        renderFooter={this.renderFooter}
        renderItem={this.renderItem}
        style={{
          height: 200,
          width: '50%',
          margin: '0 auto',
          border: '1px solid',
        }}
        onEndReached={this.handleOnEndReached}
        sections={sections}
        renderSection={this.renderSection}
      />
    )
  }
}

ReactDOM.render(<Sections />, document.getElementById('__react-content'));
